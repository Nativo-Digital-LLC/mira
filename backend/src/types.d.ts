declare module 'apcaccess' {
  export default class ApcAccess {
    isConnected: boolean;
    connect(host?: string, port?: number): Promise<void>;
    disconnect(): Promise<void>;
    getStatus(): Promise<string>;
    getStatusJson(): Promise<any>;
    getEvents(): Promise<any>;
  }
}
