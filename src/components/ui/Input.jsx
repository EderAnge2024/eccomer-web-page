// Componente Input reutilizable
import { forwardRef } from 'react';
import clsx from 'clsx';

const Input = forwardRef(({
  label,
  error,
  helperText,
  className,
  type = 'text',
  disabled = false,
  required = false,
  ...props
}, ref) => {
  const inputClasses = clsx(
    'block w-full rounded-lg border-gray-300 shadow-sm transition-colors duration-200',
    'focus:border-blue-500 focus:ring-blue-500 focus:ring-1',
    'placeholder:text-gray-400',
    {
      'border-red-300 focus:border-red-500 focus:ring-red-500': error,
      'bg-gray-50 cursor-not-allowed': disabled,
    },
    className
  );
  
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        ref={ref}
        type={type}
        className={inputClasses}
        disabled={disabled}
        {...props}
      />
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;