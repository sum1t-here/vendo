import { cn } from "@/lib/utils";

export default function CategoryCard({ config }: { config: any }) {
  return (
    <div className={cn(`flex flex-col items-center justify-center gap-2 md:gap-6 w-full h-56 shadow-[6px_6px_0px_#000] rounded-md hover:shadow-[2px_2px_0px_#000] hover:translate-x-1 hover:translate-y-1 transition-all duration-150 cursor-pointer text-white border-2 border-black`, config.accent)}>
      <span className="text-6xl">{config.emoji}</span>
      <span className="font-semibold text-2xl">{config.label}</span>
      <span className="text-sm opacity-70">{config.tagline}</span>
    </div>
  );
}