import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
  showRequiredIndicator?: boolean;
  showErrorAsPlaceholder?: boolean;
}

/**
 * 재사용 가능한 Input 컴포넌트
 */
export const Input: React.FC<InputProps> = ({
  label,
  error,
  required = false,
  showRequiredIndicator = true,
  showErrorAsPlaceholder = false,
  className = '',
  placeholder,
  ...props
}) => {
  const displayPlaceholder = showErrorAsPlaceholder && error ? error : placeholder;

  return (
    <div className="w-full space-y-2">
      {label && (
        <label
          htmlFor={props.id}
          className="block text-sm font-semibold text-slate-800 tracking-tight"
        >
          {label}
          {required && showRequiredIndicator && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}
      <input
        {...props}
        placeholder={displayPlaceholder}
        className={`
          w-full px-4 py-3 rounded-xl border text-sm
          focus:outline-none focus:ring-4 focus:ring-blue-100
          focus:border-blue-300
          transition-all duration-200 shadow-sm
          ${error
            ? 'border-rose-100 bg-rose-50 placeholder-rose-400'
            : 'border-blue-50 bg-blue-50 placeholder-slate-400'
          }
          text-slate-900
          ${className}
        `}
      />
      {error && !showErrorAsPlaceholder && (
        <p className="text-sm font-medium text-rose-600">{error}</p>
      )}
    </div>
  );
};

