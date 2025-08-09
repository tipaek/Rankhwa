import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { cn } from '@/lib/cn';

interface DropdownItem {
  label: string;
  onSelect: () => void;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  portal?: boolean; // default true
}

/**
 * A minimal dropdown menu.  The caller provides the trigger element
 * and a list of items.  Clicking outside or pressing escape will
 * close the menu.  Keyboard navigation is not implemented but could
 * be added in the future.
 *
 * If `portal` is true, the menu renders into document.body to avoid
 * clipping by overflow-hidden parents.
 */
export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  align = 'left',
  portal = true,
}) => {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number; width: number } | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const measure = () => {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    setCoords({
      top: r.bottom, // viewport-relative, no scrollY
      left: r.left,
      width: r.width,
    });
  };

  useEffect(() => {
    if (!open) return;

    const handleDocClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        !menuRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    const onScroll = () => measure();
    const onResize = () => measure();

    document.addEventListener('mousedown', handleDocClick);
    document.addEventListener('keydown', handleKey);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);

    return () => {
      document.removeEventListener('mousedown', handleDocClick);
      document.removeEventListener('keydown', handleKey);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  const triggerEl = (
    <div
      ref={containerRef}
      className="relative inline-block text-left"
      onClick={() => {
        setOpen((o) => {
          const next = !o;
          if (next) measure();
          return next;
        });
      }}
    >
      {trigger}
      {!portal && open && (
        <div
          ref={menuRef}
          className={cn(
            'absolute z-50 mt-2 w-48 rounded-md shadow-lg bg-card border border-border focus:outline-none',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          <ul className="py-1">
            {items.map((item, idx) => (
              <li key={idx}>
                <button
                  className="w-full text-left px-4 py-2 text-sm hover:bg-muted hover:text-foreground/90"
                  onClick={() => {
                    item.onSelect();
                    setOpen(false);
                  }}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  if (!portal) return triggerEl;

  return (
    <>
      {triggerEl}
      {open && coords &&
        ReactDOM.createPortal(
          <div
            ref={menuRef}
            className="fixed z-[9999] rounded-md shadow-lg bg-card border border-border focus:outline-none"
            style={{
              top: coords.top + 8, // small offset below trigger
              left:
                align === 'right'
                  ? coords.left + coords.width - 192 // 192px ≈ w-48
                  : coords.left,
              width: 192,
            }}
          >
            <ul className="py-1">
              {items.map((item, idx) => (
                <li key={idx}>
                  <button
                    className="w-full text-left px-4 py-2 text-sm hover:bg-muted hover:text-foreground/90"
                    onClick={() => {
                      item.onSelect();
                      setOpen(false);
                    }}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>,
          document.body
        )}
    </>
  );
};
