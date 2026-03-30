import { useState, useEffect } from 'react';
import { Button, Input, Form, Typography, notification } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

const { Title, Text } = Typography;

export function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      notification.error({ message: 'Enlace inválido o sin token.' });
      navigate('/login');
    }
  }, [token, navigate]);

  const onFinish = async (values: any) => {
    if (values.password !== values.confirm) {
      notification.error({ message: 'Las contraseñas no coinciden' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: values.password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al reiniciar la contraseña');

      notification.success({ message: data.message });
      navigate('/login');
    } catch (err: any) {
      notification.error({ message: 'Error', description: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (!token) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-industrial-gradient text-on-background p-4">
      <div className="max-w-md w-full bg-surface p-8 rounded-2xl border border-white/5 shadow-2xl">
        <div className="text-center mb-8">
          <Title level={2} className="!text-on-surface !mb-2">Nueva Contraseña</Title>
          <Text className="text-on-surface-variant">Crea tu nueva contraseña de acceso</Text>
        </div>

        <Form layout="vertical" onFinish={onFinish} size="large">
          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Por favor ingresa una contraseña' },
              { min: 6, message: 'La contraseña debe tener mínimo 6 caracteres' }
            ]}
          >
            <Input.Password prefix={<LockOutlined className="text-secondary" />} placeholder="Nueva contraseña" />
          </Form.Item>

          <Form.Item
            name="confirm"
            rules={[
              { required: true, message: 'Por favor confirma la contraseña' }
            ]}
          >
            <Input.Password prefix={<LockOutlined className="text-secondary" />} placeholder="Confirmar nueva contraseña" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={loading} className="!h-12 !bg-primary !text-on-primary font-medium mt-4">
            Actualizar Contraseña
          </Button>

          <div className="text-center mt-6">
            <Link to="/login" className="text-primary hover:text-primary-focus transition-colors">
              Volver a Iniciar Sesión
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}
