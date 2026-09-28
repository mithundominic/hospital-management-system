// Responsibility: Render the user login form with email/password and demo hints

import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Box } from '@/components/ui/Box';
import { Card } from '@/components/ui/Card';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/');
    } catch {
      // Error notification handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-8 shadow-lg">
      <Heading level={2} className="text-2xl font-bold text-gray-900 mb-6">
        Sign in to your account
      </Heading>

      <form onSubmit={handleSubmit}>
        <Box className="space-y-4">
          <Input
            label="Email address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="h-5 w-5" />}
            placeholder="admin@hospital.com"
          />

          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="h-5 w-5" />}
            placeholder="••••••••"
          />

          <Button type="submit" isLoading={loading} className="w-full py-3">
            Sign in
          </Button>
        </Box>
      </form>

      <Box className="mt-6 text-center">
        <Text size="sm" variant="muted">Demo Credentials:</Text>
        <Text size="xs" variant="muted" className="mt-1">Email: admin@hospital.com</Text>
        <Text size="xs" variant="muted">Password: (Set during setup)</Text>
      </Box>
    </Card>
  );
};
