'use client';
import { useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { PencilIcon } from 'lucide-react';
import { Button } from './ui/button';
import { User } from '@/payload-types';
import HeaderLabel from './header-label';

export default function ProfilePresenter({ user }: { user: User | null }) {
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zip: user?.address?.zip || '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  if (!user) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const res = await fetch(`/api/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        address: {
          street: form.street,
          city: form.city,
          state: form.state,
          zip: form.zip,
        },
      }),
    });

    if (res.ok) {
      setMessage('Profile updated!');
    } else {
      const data = await res.json();
      setMessage(data.errors?.[0]?.message || 'Failed to update.');
    }

    setSaving(false);
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="flex flex-col justify-center items-center mt-[100px] gap-3">
      <HeaderLabel text="Profile" />

      <form
        onSubmit={handleSubmit}
        className="bg-secondary-background w-[300px] md:w-[450px] p-6 flex flex-col gap-4 rounded-md border shadow-[6px_6px_0px_#000]"
      >
        {message && (
          <p
            className={`text-sm text-center font-medium ${message === 'Profile updated!' ? 'text-green-600' : 'text-red-500'}`}
          >
            {message}
          </p>
        )}

        {/* Personal Info */}
        <p className="text-xs font-bold uppercase text-center tracking-widest text-muted-foreground">Personal Info</p>

        <div className="flex flex-col gap-1">
          <Label className="text-sm font-semibold">Name</Label>
          <div className="flex items-center gap-2">
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              minLength={5}
              maxLength={20}
              required
              disabled={!editing}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <Label className="text-sm font-semibold">Email</Label>
          <Input type="email" name="email" value={form.email} onChange={handleChange} required disabled={!editing} />
        </div>

        {/* Shipping Address */}
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-2">Shipping Address</p>

        {[
          { label: 'Street', name: 'street' },
          { label: 'City', name: 'city' },
          { label: 'State', name: 'state' },
          { label: 'ZIP', name: 'zip' },
        ].map(field => (
          <div key={field.name} className="flex flex-col gap-1">
            <Label className="text-sm font-semibold">{field.label}</Label>
            <Input
              name={field.name}
              value={form[field.name as keyof typeof form]}
              onChange={handleChange}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              disabled={!editing}
            />
          </div>
        ))}

        {/* Read-only */}
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-2">Other</p>

        <div className="flex flex-col gap-1">
          <Label className="text-sm font-semibold">Stripe ID</Label>
          <Input
            value={user.stripeCustomerId || 'Not available'}
            readOnly
            className="bg-muted cursor-default text-muted-foreground"
          />
        </div>

        <Button type="submit" onClick={() => setEditing(!editing)} disabled={saving} className="w-full">
          {editing ? 'Save' : saving ? 'Saving...' : 'Edit'}
        </Button>
      </form>
    </div>
  );
}
