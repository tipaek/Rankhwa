import React, { useState } from 'react';
import { cn } from '@/lib/cn';

interface TabsProps {
  labels: string[];
  children: React.ReactNode[];
  defaultIndex?: number;
  onChange?: (index: number) => void;
}

/**
 * A simple tab component.  Children must correspond to the order of
 * labels.  The caller may control or observe the active index via
 * onChange.
 */
export const Tabs: React.FC<TabsProps> = ({ labels, children, defaultIndex = 0, onChange }) => {
  const [index, setIndex] = useState(defaultIndex);
  const handleChange = (i: number) => {
    setIndex(i);
    onChange?.(i);
  };
  return (
    <div>
      <div className="flex border-b border-border">
        {labels.map((label, i) => (
          <button
            key={i}
            onClick={() => handleChange(i)}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
              i === index ? 'border-primary text-primary' : 'border-transparent text-foreground hover:text-primary'
            )}
            role="tab"
            aria-selected={i === index}
          >
            {label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="mt-4">
        {children[index]}
      </div>
    </div>
  );
};