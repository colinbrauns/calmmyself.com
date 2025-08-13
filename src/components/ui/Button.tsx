import { ButtonHTMLAttributes, forwardRef } from 'react'

const getButtonClasses = (variant: string = 'default', size: string = 'default') => {
  const baseClasses = 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-calm-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
  
  const variantClasses = {
    default: 'bg-calm-600 text-white hover:bg-calm-700 active:bg-calm-800',
    outline: 'border border-calm-300 bg-transparent hover:bg-calm-50 active:bg-calm-100',
    ghost: 'hover:bg-calm-50 active:bg-calm-100',
    calm: 'bg-calm-100 text-calm-800 hover:bg-calm-200 active:bg-calm-300',
    grounding: 'bg-grounding-100 text-grounding-800 hover:bg-grounding-200 active:bg-grounding-300'
  }
  
  const sizeClasses = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10',
  }
  
  return `${baseClasses} ${variantClasses[variant as keyof typeof variantClasses] || variantClasses.default} ${sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.default}`
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'calm' | 'grounding'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={`${getButtonClasses(variant, size)} ${className}`}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }