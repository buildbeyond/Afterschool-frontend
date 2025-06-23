import React, { useState, useRef, useEffect } from 'react';

interface SelectWithInputProps {
  options: string[];
  onChange: (value: string) => void;
  value: string;
}

const SelectWithInput: React.FC<SelectWithInputProps> = ({
  options,
  onChange,
  value,
}) => {
  const [open, setOpen] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setCustomInput('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setOpen(false);
    setCustomInput('');
  };

  return (
    <div className="relative inline-block w-20" ref={wrapperRef} title={value}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full truncate rounded border border-slate-300 bg-transparent p-1 text-left shadow focus:outline-none dark:border-slate-700"
      >
        {value || 'Select an option'}
      </button>

      {open && (
        <div className="absolute z-10 mt-1 w-full rounded border border-slate-300 bg-white shadow dark:border-slate-700">
          {options.map((option) => (
            <div
              key={option}
              className="cursor-pointer bg-white p-1 dark:bg-slate-700"
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}

          <div className="bg-white p-1 dark:bg-slate-700">
            <input
              type="text"
              placeholder="その他"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="w-full rounded border border-slate-300 bg-white px-2 py-1 focus:outline-none dark:border-slate-600 dark:bg-slate-700"
            />
            {customInput && (
              <button
                onClick={() => handleSelect(customInput)}
                className="mt-2 w-full overflow-hidden rounded bg-blue-500 py-1 text-sm text-white hover:bg-blue-600"
              >
                "{customInput}"
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectWithInput;
