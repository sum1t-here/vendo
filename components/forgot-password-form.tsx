'use client';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordForm() {
  const [user, setUser] = useState({
    email: '',
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
      const response = await fetch('/api/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message);
      }
      setSuccess('Reset link sent successfully');
    } catch (error) {
      console.error('Forgot password error:', error);
      setError('An error occurred during forgot password');
    } finally {
      setLoading(false);
    }
  };
  return (
    <form
      className="bg-secondary-background w-[300px] md:w-[450px] p-3 flex flex-col gap-3 rounded-md border shadow-[6px_6px_0px_#000]"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-1">
        <Label htmlFor="email" className="text-sm font-semibold">
          Email
        </Label>
        <Input type="email" name="email" value={user.email} onChange={handleChange} placeholder="Email" />
      </div>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      <Button type="submit" disabled={loading} className="cursor-pointer">
        {loading ? 'Sending...' : 'Send Reset Link'}
      </Button>
      {success && (
        <div className="text-green-500 text-sm text-center flex flex-col items-center gap-2 justify-center">
          <span className="text-sm">{success}</span>
          <Link href="/login" className="text-blue-500 hover:underline">
            <Button className="text-sm cursor-pointer"> Back to Login </Button>
          </Link>
        </div>
      )}
    </form>
  );
}
