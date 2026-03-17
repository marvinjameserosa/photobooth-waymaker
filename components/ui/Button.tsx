import {
	forwardRef,
	type ButtonHTMLAttributes,
	type DetailedHTMLProps,
} from "react";

type ButtonProps = DetailedHTMLProps<
	ButtonHTMLAttributes<HTMLButtonElement>,
	HTMLButtonElement
> & {
	variant?: "primary" | "secondary" | "ghost" | "outline";
	size?: "sm" | "md" | "lg";
};

function cn(
	...classes: Array<string | false | null | undefined>
): string {
	return classes.filter(Boolean).join(" ");
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant = "primary", size = "md", ...props }, ref) => {
		const variants: Record<typeof variant, string> = {
			primary:
				"bg-[#00CED1] text-white hover:bg-[#00b8ba] focus-visible:outline-[#00CED1] shadow-[0_0_20px_rgba(0,206,209,0.3)]",
			secondary:
				"bg-transparent text-white border border-[#00CED1] hover:bg-[#00CED1]/10 focus-visible:outline-[#00CED1]",
			ghost:
				"bg-transparent text-gray-300 hover:bg-white/5 hover:text-white focus-visible:outline-white/50",
			outline:
				"bg-transparent text-[#00CED1] border border-[#00CED1]/50 hover:border-[#00CED1] hover:bg-[#00CED1]/5 focus-visible:outline-[#00CED1]",
		};

		const sizes: Record<typeof size, string> = {
			sm: "px-4 py-1.5 text-xs",
			md: "px-5 py-2 text-sm",
			lg: "px-8 py-3 text-base",
		};

		return (
			<button
				ref={ref}
				className={cn(
					"inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2",
					variants[variant],
					sizes[size],
					className
				)}
				{...props}
			/>
		);
	}
);

Button.displayName = "Button";

export { Button };
