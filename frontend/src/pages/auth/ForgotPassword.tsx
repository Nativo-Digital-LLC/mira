import { useState } from 'react';
import { Button, Input, Form, Typography, notification } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

export function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error de red');

      notification.success({ message: data.message });
      setSent(true);
    } catch (err: any) {
      notification.error({ message: 'Error', description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-industrial-gradient text-on-background p-4">
      <div className="max-w-md w-full bg-surface p-8 rounded-2xl border border-white/5 shadow-2xl">
        <div className="text-center mb-8">
          <Title level={2} className="!text-on-surface !mb-2">Recuperar Contraseña</Title>
          <Text className="text-on-surface-variant">
            Ingresa tu correo para recibir un enlace de recuperación.
          </Text>
        </div>

        {!sent ? (
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

            <Button type="primary" htmlType="submit" block loading={loading} className="!h-12 !bg-primary !text-on-primary font-medium mt-2">
              Enviar Enlace
            </Button>
          </Form>
        ) : (
          <div className="text-center bg-secondary/10 p-4 rounded-xl mb-6">
            <Text className="text-on-surface-variant">
              Si el correo existe en nuestra base de datos, recibirás un enlace de recuperación en breve.
            </Text>
          </div>
        )}

        <div className="text-center mt-6">
          <Link to="/login" className="text-primary hover:text-primary-focus transition-colors">
            Volver a Iniciar Sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
