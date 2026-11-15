import { useEffect, useId, useRef, useState } from "react";
import "./Menu.css";

/**
 * Dropdown menu.
 * Props:
 *   label    – text on the trigger button
 *   items    – [{ id, label, hint? }]
 *   onSelect – called with the chosen item
 * Keyboard: Arrow keys / Home / End move, Enter or Space selects, Esc closes.
 */
export default function Menu({ label = "Menu", items, onSelect }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const itemRefs = useRef([]);
  const menuId = useId();

  // Close when clicking outside.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Keep focus on the active item while open.
  useEffect(() => {
    if (open) itemRefs.current[active]?.focus();
  }, [open, active]);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const openAt = (index) => {
    setActive(index);
    setOpen(true);
  };

  const onTriggerKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      openAt(0);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      openAt(items.length - 1);
    }
  };

  const onMenuKeyDown = (e) => {
    const last = items.length - 1;
    const next = {
      ArrowDown: active === last ? 0 : active + 1,
      ArrowUp: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    };
    if (e.key in next) {
      e.preventDefault();
      setActive(next[e.key]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };

  const choose = (item) => {
    onSelect?.(item);
    close();
  };

  return (
    <div className="menu" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className="menu-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => (open ? close() : openAt(0))}
        onKeyDown={onTriggerKeyDown}
      >
        {label}
        <svg className="menu-chevron" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          <path d="M2 4.5 6 8.5l4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul id={menuId} className="menu-list" role="menu" onKeyDown={onMenuKeyDown}>
          {items.map((item, i) => (
            <li key={item.id} role="none">
              <button
                ref={(el) => (itemRefs.current[i] = el)}
                type="button"
                role="menuitem"
                className="menu-item"
                tabIndex={i === active ? 0 : -1}
                onClick={() => choose(item)}
                onMouseEnter={() => setActive(i)}
              >
                <span className="menu-item-label">{item.label}</span>
                {item.hint && <span className="menu-item-hint">{item.hint}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
