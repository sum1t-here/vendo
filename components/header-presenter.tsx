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
import { useCartStore } from '@/store/cart';
import { motion, useAnimation } from 'motion/react';
import { useEffect } from 'react';

export default function HeaderPresenter({ user }: { user: User | null }) {
  const router = useRouter();
  const control = useAnimation();
  const totalItems = useCartStore(state => state.totalItems());

  useEffect(() => {
    if (totalItems > 0) {
      control.start({
        scale: [1, 1.4, 1],
        transition: { duration: 0.8, ease: 'easeInOut' },
      });
    }
  }, [totalItems, control]);

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
          <Link href="/cart">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={control}
              className="relative group"
            >
              <ShoppingCartIcon />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                  className="absolute -top-2 -right-2 min-w-[22px] h-[22px] px-1 flex items-center justify-center text-[10px] font-black bg-yellow-300 text-black border-2 border-black shadow-[2px_2px_0px_#000] transition-all group-hover:translate-y-[2px] group-hover:translate-x-[-2px] group-hover:rotate-6"
                >
                  {totalItems}
                </motion.span>
              )}
            </motion.div>
          </Link>
        </div>
      </div>
    </header>
  );
}
