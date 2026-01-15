
import React from 'react';

interface InputGroupProps {
  label: string;
  icon: string;
  children: React.ReactNode;
}

export const InputGroup: React.FC<InputGroupProps> = ({ label, icon, children }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-sm font-semibold text-slate-400 flex items-center gap-2">
        <i className={icon}></i>
        {label}
      </label>
      {children}
    </div>
  );
};
