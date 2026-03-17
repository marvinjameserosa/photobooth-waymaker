import type { ReactNode } from "react";

type CardProps = {
  icon: ReactNode;
  title: string;
  description?: string;
  className?: string;
};

function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

export function Card({ icon, title, description, className }: CardProps) {
  return (
    <div
      className={cn(
        "group relative flex h-32 flex-col items-center justify-center gap-3 rounded-xl border border-[rgba(0,206,209,0.2)] bg-[rgba(13,27,42,0.7)] backdrop-blur-md px-6 text-center text-white shadow-lg transition-all duration-300 hover:border-[#00CED1] hover:bg-[rgba(13,27,42,0.85)] hover:shadow-[0_0_30px_rgba(0,206,209,0.15)]",
        className
      )}
    >
      <div className="flex items-center justify-center text-[#00CED1] transition-all duration-300 group-hover:text-[#FF6B35] group-hover:scale-110">
        {icon}
      </div>
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-200">
        {title}
      </div>
      {description ? (
        <p className="text-[0.6rem] uppercase tracking-[0.15em] text-gray-400">
          {description}
        </p>
      ) : null}
    </div>
  );
}
