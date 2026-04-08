import { getSetting, getNodes, saveEvent, getAutomations, type Automation } from './db';
import type { SwarmNode, EventSeverity } from './db';
import { execCommand } from './ssh';
import type { ApcUpsStatusProps } from './types';

// ── State ─────────────────────────────────────────────────────────────────────

let onBatterySince: number | null = null;
const activeTimers = new Map<number, ReturnType<typeof setTimeout>>(); // automation_id -> timer
const executedAutomations = new Set<number>(); // automation IDs executed this cycle

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseNum(val?: string): number {
  return val ? parseFloat(val) || 0 : 0;
}

function isEnabled(): boolean {
  return getSetting('automation_enabled', '0') === '1';
}

function logEvent(type: string, severity: EventSeverity, description: string, value?: string) {
  const event = saveEvent({ timestamp: Date.now(), type, severity, description, value });
  console.log(`[Automation] ${type}: ${description}`);
  // Import notify lazily to avoid circular deps
  import('./notifications').then(({ notify }) => notify(event)).catch(() => {});
  return event;
}

async function shutdownNode(node: SwarmNode, reason: string) {
  logEvent(
    'NODE_SHUTDOWN',
    'warning',
    `Apagando ${node.name} (${node.host}) — ${reason}`,
    node.host,
  );
  try {
    await execCommand(node, node.shutdown_cmd);
    console.log(`[Automation] ${node.name} shutdown command sent`);
  } catch (err: any) {
    logEvent('NODE_SHUTDOWN_SKIPPED', 'warning', `Error apagando ${node.name}: ${err.message}`, node.host);
  }
}

async function sendUpsShutdown(node: SwarmNode) {
  const cmd = node.ups_cmd || 'sudo apccontrol powerout';
  logEvent('UPS_POWEROUT', 'critical', `Enviando comando de apagado al UPS via ${node.name}: ${cmd}`);
  try {
    await execCommand(node, cmd);
    console.log('[Automation] UPS shutdown command sent');
  } catch (err: any) {
    console.error('[Automation] UPS shutdown command failed:', err.message);
  }
}

// ── Main status handler ──────────────────────────────────────────────────────

export function onStatus(status: ApcUpsStatusProps) {
  if (!isEnabled()) return;

  const isOnBattery = (status.STATUS ?? '').includes('ONBATT');
  const isOnline    = (status.STATUS ?? '').includes('ONLINE');
  const bcharge     = parseNum(status.BCHARGE);
  const timeleft    = parseNum(status.TIMELEFT); // minutes remaining

  const nodes = getNodes().filter(n => n.enabled);
  const automations = getAutomations().filter(a => a.enabled);

  // ── Power restored ────────────────────────────────────────────────────────
  if (isOnline && onBatterySince !== null) {
    onBatterySince = null;
    // Clear all active timers
    for (const timer of activeTimers.values()) {
      clearTimeout(timer);
    }
    activeTimers.clear();
    executedAutomations.clear();
    return;
  }

  // ── On battery ────────────────────────────────────────────────────────────
  if (!isOnBattery) return;

  if (onBatterySince === null) {
    onBatterySince = Date.now();
  }

  const elapsedMinutes = (Date.now() - onBatterySince) / 60000; // Convert to minutes

  // Process each automation
  for (const automation of automations) {
    if (executedAutomations.has(automation.id!)) continue;

    let shouldExecute = false;
    let reason = '';

    switch (automation.trigger_type) {
      case 'time_since_outage':
        if (elapsedMinutes >= automation.trigger_value) {
          shouldExecute = true;
          reason = `${automation.trigger_value} minutos desde el corte de energía`;
        } else if (!activeTimers.has(automation.id!)) {
          // Set a timer for future execution
          const remainingMs = (automation.trigger_value - elapsedMinutes) * 60000;
          const timer = setTimeout(() => {
            activeTimers.delete(automation.id!);
            if (onBatterySince !== null) { // still on battery
              executeAutomation(automation, nodes, reason);
            }
          }, remainingMs);
          activeTimers.set(automation.id!, timer);
        }
        break;

      case 'battery_percentage':
        if (bcharge <= automation.trigger_value && bcharge > 0) {
          shouldExecute = true;
          reason = `Batería al ${bcharge.toFixed(1)}% (umbral ${automation.trigger_value}%)`;
        }
        break;

      case 'battery_time_remaining':
        if (timeleft <= automation.trigger_value && timeleft > 0) {
          shouldExecute = true;
          reason = `Tiempo restante de batería: ${timeleft.toFixed(1)} min (umbral ${automation.trigger_value} min)`;
        }
        break;
    }

    if (shouldExecute) {
      executeAutomation(automation, nodes, reason);
    }
  }
}

function executeAutomation(automation: Automation, nodes: SwarmNode[], reason: string) {
  executedAutomations.add(automation.id!);

  // Clear any pending timer for this automation
  const timer = activeTimers.get(automation.id!);
  if (timer) {
    clearTimeout(timer);
    activeTimers.delete(automation.id!);
  }

  // Find the target node (if specified)
  let targetNode: SwarmNode | undefined;
  if (automation.node_id) {
    targetNode = nodes.find(n => n.id === automation.node_id);
    if (!targetNode || !targetNode.enabled) {
      logEvent('AUTOMATION_SKIPPED', 'warning', `Automatización ${automation.id} omitida: nodo ${automation.node_id} no encontrado o deshabilitado`);
      return;
    }
  }

  // Execute the command
  if (targetNode) {
    execCommand(targetNode, automation.command)
      .then(() => {
        logEvent('AUTOMATION_EXECUTED', 'info', `Automatización ejecutada en ${targetNode!.name}: ${automation.command}`, reason);
      })
      .catch((err: any) => {
        logEvent('AUTOMATION_FAILED', 'warning', `Error ejecutando automatización en ${targetNode!.name}: ${err.message}`, automation.command);
      });
  } else {
    // Execute locally or system command (assuming it's a system command when no node specified)
    const { exec } = require('child_process');
    exec(automation.command, (error: any, stdout: any, stderr: any) => {
      if (error) {
        logEvent('AUTOMATION_FAILED', 'warning', `Error ejecutando comando del sistema: ${error.message}`, automation.command);
        return;
      }
      logEvent('AUTOMATION_EXECUTED', 'info', `Comando del sistema ejecutado: ${automation.command}`, reason);
    });
  }
}
