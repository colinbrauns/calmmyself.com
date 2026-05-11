import { ButtonHTMLAttributes, forwardRef } from 'react'

const getButtonClasses = (variant: string = 'default', size: string = 'default') => {
  const baseClasses = 'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-calm-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]'
  
  const variantClasses = {
    default: 'bg-calm-600 text-white hover:bg-calm-700 active:bg-calm-800 shadow-sm hover:shadow-md dark:bg-calm-500 dark:hover:bg-calm-400',
    outline: 'border border-gray-200 bg-transparent hover:bg-gray-50 active:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 dark:active:bg-gray-700 dark:text-gray-300',
    ghost: 'hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-gray-800 dark:active:bg-gray-700 dark:text-gray-300',
    calm: 'bg-calm-100 text-calm-800 hover:bg-calm-200 active:bg-calm-300 dark:bg-calm-900/50 dark:text-calm-200 dark:hover:bg-calm-900/70',
    grounding: 'bg-grounding-100 text-grounding-800 hover:bg-grounding-200 active:bg-grounding-300 dark:bg-grounding-900/50 dark:text-grounding-200 dark:hover:bg-grounding-900/70'
  }
  
  const sizeClasses = {
    default: 'h-10 px-5 py-2',
    sm: 'h-9 rounded-lg px-3',
    lg: 'h-11 rounded-lg px-8',
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
