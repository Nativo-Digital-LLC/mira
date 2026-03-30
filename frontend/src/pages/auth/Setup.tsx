import { useState } from 'react';
import { Button, Input, Form, Typography, notification } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text } = Typography;

export function Setup() {
  const [loading, setLoading] = useState(false);
  const { isSetup, checkSetupStatus } = useAuth();
  const navigate = useNavigate();

  if (isSetup === true) {
    return <Navigate to="/login" replace />;
  }

  const onFinish = async (values: any) => {
    if (values.password !== values.confirm) {
      notification.error({ message: 'Las contraseñas no coinciden' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email, password: values.password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al completar la configuración');

      notification.success({ message: 'Configuración guardada exitosamente' });
      await checkSetupStatus();
      
      // Navigate to login
      navigate('/login');
    } catch (err: any) {
      notification.error({
        message: 'Error',
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-industrial-gradient text-on-background p-4">
      <div className="max-w-md w-full bg-surface p-8 rounded-2xl border border-white/5 shadow-2xl">
        <div className="text-center mb-8">
          <Title level={2} className="!text-on-surface !mb-2">Primer Inicio</Title>
          <Text className="text-on-surface-variant">Configura el usuario administrador</Text>
        </div>

        <Form layout="vertical" onFinish={onFinish} size="large">
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Por favor ingresa tu correo' },
              { type: 'email', message: 'Ingresa un correo válido' }
            ]}
          >
            <Input prefix={<MailOutlined className="text-secondary" />} placeholder="Correo electrónico" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Por favor ingresa una contraseña' },
              { min: 6, message: 'La contraseña debe tener mínimo 6 caracteres' }
            ]}
          >
            <Input.Password prefix={<LockOutlined className="text-secondary" />} placeholder="Contraseña" />
          </Form.Item>

          <Form.Item
            name="confirm"
            rules={[
              { required: true, message: 'Por favor confirma la contraseña' }
            ]}
          >
            <Input.Password prefix={<LockOutlined className="text-secondary" />} placeholder="Confirmar contraseña" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={loading} className="!h-12 !bg-primary !text-on-primary font-medium mt-4">
            Completar Configuración
          </Button>
        </Form>
      </div>
    </div>
  );
}
