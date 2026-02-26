'use client';

import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import HeaderLabel from './header-label';

export default function RegisterForm() {
  const [user, setUser] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
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
      if (user.password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message);
      } else {
        router.push('/login');
        router.refresh();
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col justify-center items-center mt-[100px] gap-3">
      <HeaderLabel text="Register" />
      <form
        onSubmit={handleSubmit}
        className="bg-secondary-background w-[300px] md:w-[450px] p-3 flex flex-col gap-3 rounded-md border shadow-[6px_6px_0px_#000]"
      >
        <div className="flex flex-col gap-1">
          <Label htmlFor="name" className="text-sm font-semibold">
            Name
          </Label>
          <Input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            placeholder="Name"
            minLength={5}
            maxLength={20}
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="email" className="text-sm font-semibold">
            Email
          </Label>
          <Input type="email" name="email" value={user.email} onChange={handleChange} placeholder="Email" required />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="password" className="text-sm font-semibold">
            Password
          </Label>
          <Input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            placeholder="Password"
            required
            minLength={6}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="confirmPassword" className="text-sm font-semibold">
            Confirm Password
          </Label>
          <Input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
            minLength={6}
          />
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <Button type="submit" disabled={loading} className="cursor-pointer">
          {loading ? 'Registering...' : 'Register'}
        </Button>
        <p className="text-center text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
