import React from "react";
import { ChevronDown } from "lucide-react";

type Option = {
  value: string | number;
  label: string;
};

type Props = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  helperText?: string;
  options: Option[];
  placeholder?: string;
};

const Select = React.forwardRef<HTMLSelectElement, Props>(
  ({ label, error, helperText, options, placeholder, className = "", id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-neutral-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`
              w-full h-11 px-4 pr-10
              bg-white border rounded-xl
              text-neutral-900
              appearance-none cursor-pointer
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent
              disabled:bg-neutral-100 disabled:cursor-not-allowed
              ${error ? "border-red-500 focus:ring-red-500" : "border-neutral-300"}
              ${className}
            `}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
        </div>
        {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-neutral-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
