import React from "react";

interface FormFieldProps {
  label: string;
  codeName: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * A styled field for forms: label, code name (as a pill), description, and input/select.
 */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  codeName,
  description,
  children,
  className = "",
}) => (
  <div className={`flex flex-col gap-1 pb-5 mb-2 ${className}`} style={{ minWidth: 0 }}>
    <div className="flex items-center gap-2">
      <span className="font-semibold text-base text-black truncate">{label}</span>
      <span
        className="ml-2 px-2 py-0.5 rounded bg-[#EFF3FB] text-[#066DA1] text-xs font-mono border border-[#A1D1FF] tracking-tight"
        style={{ fontFamily: 'Menlo, monospace' }}
      >
        {codeName}
      </span>
    </div>
    <span className="text-xs text-gray-500 mb-1 truncate" style={{ lineHeight: "1.2" }}>{description}</span>
    <div className="mt-1">{children}</div>
  </div>
);
