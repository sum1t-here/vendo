'use client';

import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import Link from 'next/link';
import HeaderLabel from './header-label';
import { useRouter } from 'next/navigation';
import { fetchCartFromServer } from '@/lib/cartSync';
import { useCartStore } from '@/store/cart';

export default function LoginForm() {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.errors[0].message);
        setLoading(false);
        return;
      }

      // sync cart with server
      const serverItems = await fetchCartFromServer();
      if (serverItems.length > 0) {
        useCartStore.setState({ items: serverItems });
      }
      router.refresh();
      router.push('/');
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      const adminCreds = {
        email: process.env.NEXT_PUBLIC_ADMIN_EMAIL || '',
        password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '',
      };

      setUser(adminCreds);

      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminCreds),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.errors[0].message);
        setLoading(false);
        return;
      }
      router.refresh();
      window.location.href = '/admin';
    } catch (error) {
      console.error('Admin login error:', error);
      setError('An error occurred during admin login');
    } finally {
      setLoading(false);
    }
  };

  const handleTestUserLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      const testUserCreds = {
        email: process.env.NEXT_PUBLIC_TEST_USER_MAIL || '',
        password: process.env.NEXT_PUBLIC_TEST_USER_PASSWORD || '',
      };

      setUser(testUserCreds);

      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testUserCreds),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.errors[0].message);
        setLoading(false);
        return;
      }
      router.refresh();
      router.push('/');
    } catch (error) {
      console.error('Test user login error:', error);
      setError('An error occurred during test user login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mt-[100px] gap-3">
      <HeaderLabel text="Login" />
      <form
        onSubmit={handleSubmit}
        className="bg-secondary-background w-[300px] md:w-[450px] p-3 flex flex-col gap-3 rounded-md border shadow-[6px_6px_0px_#000]"
      >
        <div className="flex flex-col gap-1">
          <Label htmlFor="email" className="text-sm font-semibold">
            Email
          </Label>
          <Input type="email" name="email" value={user.email} onChange={handleChange} placeholder="Email" />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="password" className="text-sm font-semibold">
            Password
          </Label>
          <Input type="password" name="password" value={user.password} onChange={handleChange} placeholder="Password" />
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <Button type="submit" disabled={loading} className="cursor-pointer">
          {loading ? 'Logging in...' : 'Login'}
        </Button>
        <p className="text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>
        <p className="text-center text-sm">OR</p>
        <div className="flex justify-center items-center gap-2">
          <Link href="/forgot-password" className="text-blue-500 hover:underline text-sm">
            Forgot Password
          </Link>
        </div>
      </form>
      <i className="text-center text-sm text-muted-foreground">Only for testing purposes</i>
      <div className="flex justify-center items-center gap-2">
        <Button onClick={handleAdminLogin}>Login as Admin</Button>
        <Button onClick={handleTestUserLogin}>Login as Test User</Button>
      </div>
    </div>
  );
}
