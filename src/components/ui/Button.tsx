import { ButtonHTMLAttributes, forwardRef } from "react";

const getButtonClasses = (
  variant: string = "default",
  size: string = "default",
) => {
  const baseClasses =
    "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--button)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--page)] disabled:pointer-events-none disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]";

  const variantClasses = {
    default:
      "bg-[var(--button)] text-[var(--button-text)] shadow-sm hover:shadow-md",
    outline:
      "border border-[var(--pill)] bg-[var(--card)] text-[var(--ink)] hover:bg-[var(--pill)] active:bg-[var(--pill)]",
    ghost: "text-[var(--ink)] hover:bg-[var(--pill)] active:bg-[var(--pill)]",
    calm: "bg-[var(--button)] text-[var(--button-text)]",
    grounding: "bg-[var(--button)] text-[var(--button-text)]",
  };

  const sizeClasses = {
    default: "h-10 px-5 py-2",
    sm: "h-9 rounded-lg px-3",
    lg: "h-11 rounded-lg px-8",
    icon: "h-10 w-10",
  };

  return `${baseClasses} ${variantClasses[variant as keyof typeof variantClasses] || variantClasses.default} ${sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.default}`;
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "calm" | "grounding";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className = "", variant = "default", size = "default", ...props },
    ref,
  ) => {
    return (
      <button
        className={`${getButtonClasses(variant, size)} ${className}`}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
