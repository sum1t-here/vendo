import { Button } from './ui/button';
import { Input } from './ui/input';

export default function Footer() {
  return (
    <footer
      className="
        mt-16
        bg-secondary-background
        border-t-4 border-black
        shadow-[0_-6px_0px_#000]
      "
    >
      <div className="px-4 md:px-14 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="space-y-4">
          <h2 className="text-2xl font-extrabold uppercase tracking-tight">Vendo</h2>
          <p className="font-medium text-sm max-w-xs">A modern brutal marketplace experience.</p>
        </div>

        {/* Shop */}
        <div className="space-y-4">
          <h3 className="font-bold uppercase text-sm tracking-wide">Shop</h3>
          <ul className="space-y-2 font-semibold text-sm">
            <li className="hover:underline cursor-pointer">Men</li>
            <li className="hover:underline cursor-pointer">Women</li>
            <li className="hover:underline cursor-pointer">Accessories</li>
          </ul>
        </div>

        {/* Company */}
        <div className="space-y-4">
          <h3 className="font-bold uppercase text-sm tracking-wide">Company</h3>
          <ul className="space-y-2 font-semibold text-sm">
            <li className="hover:underline cursor-pointer">About</li>
            <li className="hover:underline cursor-pointer">Careers</li>
            <li className="hover:underline cursor-pointer">Contact</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="space-y-4">
          <h3 className="font-bold uppercase text-sm tracking-wide">Stay Updated</h3>

          <div className="flex gap-1">
            <Input type="email" placeholder="Email" className="focus-visible:ring-0" />

            <Button className="cursor-pointer">Join</Button>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="
          border-t-4 border-black
          px-4 md:px-14
          py-4
          flex
          flex-col md:flex-row
          justify-between
          items-center
          gap-4
          text-xs
          font-semibold
        "
      >
        <span>© {new Date().getFullYear()} Vendo</span>
        <span className="uppercase tracking-wide">Built Bold by <span className="text-primary">Sumit Mazumdar</span></span>
      </div>
    </footer>
  );
}
