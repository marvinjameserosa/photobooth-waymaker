import Image from "next/image";

export default function Logo({ className = "", width, height }: { className?: string; width?: number; height?: number }) {
    // If width/height are provided, use them for the container size style or just let className handle it if not provided.
    // For backward compatibility or specific overrides, we can keep width/height as style props on the div if passed.
    const style = width && height ? { width, height } : undefined;

    return (
        <div className={`relative ${className}`} style={style}>
            <Image
                src="/logo.png"
                alt="Arduino Logo"
                fill
                className="object-contain"
                priority
            />
        </div>
    );
}
