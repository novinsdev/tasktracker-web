import type { ReactNode } from "react";
import clsx from "clsx";

type CardProps = {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  headerRight?: ReactNode;
};

export function Card({
  children,
  className,
  title,
  description,
  headerRight,
}: CardProps) {
  return (
    <section
      className={clsx(
        "rounded-2xl border border-slate-200 bg-white shadow-sm",
        className
      )}
    >
      {(title || description || headerRight) && (
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-4 py-3 sm:px-5">
          <div>
            {title && (
              <h2 className="text-sm font-semibold tracking-tight text-slate-900">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 text-xs text-slate-500">{description}</p>
            )}
          </div>
          {headerRight && <div className="shrink-0">{headerRight}</div>}
        </header>
      )}
      <div className="px-4 py-4 sm:px-5 sm:py-5">{children}</div>
    </section>
  );
}
