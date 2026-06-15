import { ReactNode, useRef, useEffect, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/shared/utils';
import s from './TableActionsMenu.module.css';

/* ------------------------------------------------------------------ */
/*  Tipos                                                             */
/* ------------------------------------------------------------------ */

export interface TableAction {
  key: string;
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  danger?: boolean;
  disabled?: boolean;
  shortcut?: string;
}

export interface TableActionsMenuProps {
  trigger: ReactNode;
  actions: TableAction[];
  primaryAction?: { label: string; icon?: ReactNode; onClick?: () => void };
  align?: 'left' | 'right';
}

/* ------------------------------------------------------------------ */
/*  TableActionsMenu                                                  */
/* ------------------------------------------------------------------ */

export const TableActionsMenu = ({
  trigger,
  actions,
  primaryAction,
  align = 'right',
}: TableActionsMenuProps) => {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const menuWidth = 260;
    const top = rect.bottom + window.scrollY + 8;
    let left = rect.right + window.scrollX - menuWidth;

    if (align === 'left') {
      left = rect.left + window.scrollX;
    }

    const vw = window.innerWidth;
    if (left + menuWidth > vw - 16) left = vw - menuWidth - 16;
    if (left < 16) left = 16;

    setCoords({ top, left });
  }, [align]);

  const handleToggle = useCallback(() => {
    if (!open) updatePosition();
    setOpen((v) => !v);
  }, [open, updatePosition]);

  /* ---------------- keyboard ---------------- */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        triggerRef.current?.focus();
      }
    },
    [close]
  );

  /* ---------------- outside click ---------------- */
  useEffect(() => {
    if (!open) return;

    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) {
        return;
      }
      close();
    };

    const scrollHandler = () => updatePosition();

    document.addEventListener('mousedown', handler, true);
    window.addEventListener('scroll', scrollHandler, { passive: true });

    return () => {
      document.removeEventListener('mousedown', handler, true);
      window.removeEventListener('scroll', scrollHandler, true);
    };
  }, [open, close, updatePosition]);

  const _primaryIndex = primaryAction ? 0 : -1;
  const regularActions = actions.filter((a) => !a.danger);
  const dangerActions = actions.filter((a) => a.danger);

  return (
    <div ref={triggerRef} className="relative inline-flex items-center">
      <div
        onClick={handleToggle}
        className="cursor-pointer"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
          }
        }}
        aria-haspopup="true"
        aria-expanded={open}
      >
        {trigger}
      </div>

      {open && coords &&
        createPortal(
          <>
            <div className="fixed inset-0 z-[9998]" onClick={close} aria-hidden="true" />
            <div
              ref={menuRef}
              className={cn(s.menu, align === 'left' && s.alignLeft)}
              style={{
                position: 'fixed',
                top: coords.top,
                left: coords.left,
                width: 260,
                zIndex: 9999,
              }}
              role="menu"
              aria-orientation="vertical"
              tabIndex={-1}
              onKeyDown={handleKeyDown}
            >
              <div className={s.inner}>
                {/* Primary action (View Detail) */}
                {primaryAction && (
                  <button
                    type="button"
                    role="menuitem"
                    className={cn(s.item, s.primaryItem)}
                    onClick={() => {
                      primaryAction.onClick?.();
                      close();
                    }}
                  >
                    <span className={cn(s.icon, s.primaryIcon)}>{primaryAction.icon}</span>
                    <span className={cn(s.label, s.primaryLabel)}>{primaryAction.label}</span>
                    <span className={s.shortcut}>⌘V</span>
                  </button>
                )}

                {/* Divider after primary */}
                {primaryAction && regularActions.length > 0 && (
                  <div className={s.divider} />
                )}

                {/* Regular actions */}
                {regularActions.map((action) => (
                  <button
                    key={action.key}
                    type="button"
                    role="menuitem"
                    className={s.item}
                    onClick={() => {
                      action.onClick?.();
                      close();
                    }}
                    disabled={action.disabled}
                  >
                    {action.icon && <span className={s.icon}>{action.icon}</span>}
                    <span className={s.label}>{action.label}</span>
                    {action.shortcut && <span className={s.shortcut}>{action.shortcut}</span>}
                  </button>
                ))}

                {/* Divider before danger */}
                {dangerActions.length > 0 && (primaryAction || regularActions.length > 0) && (
                  <div className={s.divider} />
                )}

                {/* Danger actions */}
                {dangerActions.map((action) => (
                  <button
                    key={action.key}
                    type="button"
                    role="menuitem"
                    className={cn(s.item, s.dangerItem)}
                    onClick={() => {
                      action.onClick?.();
                      close();
                    }}
                    disabled={action.disabled}
                  >
                    {action.icon && <span className={cn(s.icon)}>{action.icon}</span>}
                    <span className={cn(s.label, s.dangerLabel)}>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </>,
          document.body
        )}
    </div>
  );
};

