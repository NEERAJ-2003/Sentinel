import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * CustomSelect — animated drop-down that matches the Sentinel design system.
 *
 * Props:
 *   value       – currently selected option value
 *   onChange    – callback(value: string)
 *   options     – array of { value, label }
 *   style       – optional extra style for the trigger button
 */
export default function CustomSelect({ value, onChange, options = [], style = {} }) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [fixedWidth, setFixedWidth] = useState(null);
  const containerRef = useRef(null);
  const sizerRef = useRef(null);

  const selectedLabel = options.find(o => o.value === value)?.label ?? value;

  /* Measure the widest option label once options are known */
  useEffect(() => {
    if (sizerRef.current) {
      setFixedWidth(sizerRef.current.offsetWidth);
    }
  }, [options]);

  /* Close on outside click */
  useEffect(() => {
    function handleOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        closeMenu();
      }
    }
    if (open) document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  function openMenu() {
    setClosing(false);
    setOpen(true);
  }

  function closeMenu() {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 160); /* matches dropdown-collapse duration */
  }

  function handleToggle() {
    open ? closeMenu() : openMenu();
  }

  function handleSelect(val) {
    onChange(val);
    closeMenu();
  }

  /* Close on Escape */
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape' && open) closeMenu(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const triggerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    width: fixedWidth ? `${fixedWidth}px` : '100%',
    background: 'var(--bg)',
    color: 'var(--ink)',
    border: '1px solid var(--border)',
    borderRadius: open && !closing ? '6px 6px 0 0' : '6px',
    padding: '8px 12px',
    fontSize: '0.88rem',
    fontFamily: 'var(--font-sans)',
    fontWeight: 600,
    cursor: 'pointer',
    outline: 'none',
    transition: 'border-radius 0.12s ease, border-color 0.15s ease',
    ...style,
  };

  const menuStyle = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    zIndex: 200,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderTop: 'none',
    borderRadius: '0 0 6px 6px',
    boxShadow: '0 8px 24px rgba(16,16,16,0.10)',
    maxHeight: '260px',
    overflowY: 'auto',
    animation: closing
      ? 'dropdown-collapse 0.16s ease-in both'
      : 'dropdown-expand 0.18s cubic-bezier(0.23, 1, 0.32, 1) both',
    transformOrigin: 'top center',
  };

  /* Sizer font/padding must mirror the trigger exactly so measurements are accurate */
  const sizerItemStyle = {
    padding: '8px 12px',
    fontSize: style.fontSize ?? '0.88rem',
    fontFamily: 'var(--font-sans)',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: fixedWidth ? `${fixedWidth}px` : '100%' }}>
      {/* Hidden sizer: renders every option to find the widest width */}
      <div
        ref={sizerRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          visibility: 'hidden',
          pointerEvents: 'none',
          top: 0,
          left: 0,
          overflow: 'hidden',
          height: 0,
        }}
      >
        {options.map(opt => (
          <div key={opt.value} style={sizerItemStyle}>
            <span>{opt.label}</span>
            <ChevronDown size={15} style={{ flexShrink: 0 }} />
          </div>
        ))}
      </div>

      <button type="button" onClick={handleToggle} style={triggerStyle}>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selectedLabel}
        </span>
        <ChevronDown
          size={15}
          style={{
            flexShrink: 0,
            color: 'var(--muted)',
            transition: 'transform 0.2s ease',
            transform: open && !closing ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {open && (
        <div style={menuStyle}>
          {options.map(opt => (
            <div
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              style={{
                padding: '8px 14px',
                fontSize: '0.88rem',
                fontWeight: opt.value === value ? 700 : 400,
                color: opt.value === value ? 'var(--surface)' : 'var(--ink)',
                background: opt.value === value ? 'var(--ink)' : 'transparent',
                cursor: 'pointer',
                transition: 'background 0.1s ease',
              }}
              onMouseEnter={e => {
                if (opt.value !== value) e.currentTarget.style.background = 'rgba(16,16,16,0.05)';
              }}
              onMouseLeave={e => {
                if (opt.value !== value) e.currentTarget.style.background = 'transparent';
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
