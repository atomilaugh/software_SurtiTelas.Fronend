import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/shared/utils';

const btn = cva(
  'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none shrink-0',
  {
    variants: {
      variant: {
        primary:   'bg-[#000000] text-[#ffffff] hover:bg-[#222222] focus-visible:ring-[#000000]',
        secondary: 'bg-transparent text-[#000000] border border-[#e0e0e0] hover:bg-[#f5f5f5]',
        outline:   'border border-[#e0e0e0] bg-transparent text-[#000000] hover:bg-[#f5f5f5] hover:border-[#cccccc]',
        ghost:     'bg-transparent text-[#444444] hover:bg-[#f5f5f5] hover:text-[#000000]',
        danger:    'bg-[#dc2626] text-[#ffffff] hover:bg-[#b91c1c] focus-visible:ring-[#dc2626]',
        success:   'bg-[#22c55e] text-[#ffffff] hover:bg-[#16a34a] focus-visible:ring-[#22c55e]',
        warning:   'bg-[#f59e0b] text-[#ffffff] hover:bg-[#d97706] focus-visible:ring-[#f59e0b]',
      },
      size: {
        xs:      'h-7 px-2.5 text-[11px] rounded-lg',
        sm:      'h-8 px-3 text-[12px] rounded-lg',
        md:      'h-9 px-3.5 text-[13px] rounded-xl',
        lg:      'h-11 px-5 text-[14px] rounded-xl',
        xl:      'h-12 px-6 text-[15px] rounded-2xl',
        icon:    'h-9 w-9 rounded-xl',
        'icon-sm': 'h-7 w-7 rounded-lg',
        'icon-xs': 'h-6 w-6 rounded-md',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof btn> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => (
    <button ref={ref} className={cn(btn({ variant, size }), className)} disabled={disabled || loading} {...props}>
      {loading ? <Loader2 size={13} className="animate-spin" /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  )
);
Button.displayName = 'Button';



