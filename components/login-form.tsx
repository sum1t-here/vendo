'use client';

import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import Link from 'next/link';
import HeaderLabel from './header-label';

export default function LoginForm() {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message);
      }
      setSuccess('Login successful');
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login');
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

        {success && (
          <div className="text-green-500 text-sm text-center flex flex-col items-center gap-2 justify-center">
            <span className="text-sm">{success}</span>
            <Link href="/login" className="text-blue-500 hover:underline">
              <Button className="text-sm cursor-pointer"> Back to Login </Button>
            </Link>
          </div>
        )}
      </form>
    </div>
  );
}
