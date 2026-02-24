import { Menu, ShoppingCartIcon, User } from 'lucide-react';
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

export default function Header() {
  return (
    <header className="bg-secondary-background w-full h-14 flex items-center justify-between px-4 md:px-14 shadow-[0_6px_0px_#000]">
      {/* Mobile Navigation */}
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Menu />
          </DropdownMenuTrigger>
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
                <User />
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
      <div className="flex justify-between gap-5 cursor-pointer">
        {/* login/register - desktop */}
        <div className="hidden md:flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 font-semibold outline-0">
                <div className="flex items-center gap-1 cursor-pointer">
                  <User />
                  <span>Login</span>
                </div>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="bg-secondary-background border-4 border-black shadow-[6px_6px_0px_#000]">
              <DropdownMenuItem asChild>
                <Link href="/login">Login</Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-black h-[2px]" />

              <DropdownMenuItem asChild>
                <Link href="/register">Register</Link>
              </DropdownMenuItem>
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
