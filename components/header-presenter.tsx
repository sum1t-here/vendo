'use client';

import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Menu, ShoppingCartIcon, User as UserIcon } from 'lucide-react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { User } from '@/payload-types';

export default function HeaderPresenter({ user }: { user: User | null }) {
  const router = useRouter();
  const handleLogout = async () => {
    await fetch('/api/users/logout', {
      method: 'POST',
    });
    router.push('/');
    router.refresh();
  };
  return (
    <header className="bg-secondary-background w-full h-14 flex items-center justify-between px-4 md:px-14 shadow-[0_6px_0px_#000]">
      {/* Mobile Navigation */}
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Menu />
          </DropdownMenuTrigger>
          {user ? (
            <DropdownMenuContent className="bg-secondary-background">
              <DropdownMenuLabel>
                <Link href="/about">About</Link>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>
                <Link href="/faqs">FAQs</Link>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>
                <Link href="/contact">Contact</Link>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <UserIcon />
                  <span>{user.name}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuLabel>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>
                    <div onClick={handleLogout} className="cursor-pointer">
                      Logout
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          ) : (
            <DropdownMenuContent className="bg-secondary-background">
              <DropdownMenuLabel>
                <Link href="/about">About</Link>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>
                <Link href="/faqs">FAQs</Link>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>
                <Link href="/contact">Contact</Link>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <UserIcon />
                  <span>Login/Register</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>
                    <Link href="/login">Login</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/register">Register</Link>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          )}
        </DropdownMenu>

        {/* logo */}
      </div>
      <Link href="/">
        <div className="flex items-center gap-1">
          <span className="bg-black text-white rounded-full w-6 h-6 flex items-center justify-center p-5 font-light text-3xl">
            V
          </span>
          <h1 className="font-light text-4xl">Vendo</h1>
        </div>
      </Link>

      {/* desktop navigation */}
      <div className="hidden md:flex">
        <ul className="flex items-center gap-5">
          <li className="cursor-pointer hover:underline hover:underline-offset-1">
            <Link href="/about">About</Link>
          </li>
          <li className="cursor-pointer hover:underline hover:underline-offset-1">
            <Link href="/faqs">FAQs</Link>
          </li>
          <li className="cursor-pointer hover:underline hover:underline-offset-1">
            <Link href="/contact">Contact</Link>
          </li>
        </ul>
      </div>

      {/* cart */}
      <div className="flex justify-between items-center gap-5 cursor-pointer">
        {/* login/register - desktop */}
        <div className="hidden md:flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex items-center gap-1 cursor-pointer">
                <UserIcon />
                <span>{user ? user.name : 'Login'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-secondary-background">
              {user ? (
                // logged in user
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <div onClick={handleLogout} className="cursor-pointer">
                      Logout
                    </div>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/login">Login</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/register">Register</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div>
          <ShoppingCartIcon />
        </div>
      </div>
    </header>
  );
}
