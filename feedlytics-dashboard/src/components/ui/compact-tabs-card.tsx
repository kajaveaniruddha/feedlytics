"use client";

import * as React from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export type CompactTabsCardItem<T extends string = string> = {
  id: T;
  label: string;
};

export type CompactTabsCardProps<T extends string = string> = {
  tabs: readonly CompactTabsCardItem<T>[];
  value: T;
  onValueChange: (id: T) => void;
  /** Accessible name for the tab list (e.g. "Preview view"). */
  tablistLabel: string;
  className?: string;
  disabled?: boolean;
};

export function CompactTabsCard<T extends string>({
  tabs,
  value,
  onValueChange,
  tablistLabel,
  className,
  disabled,
}: CompactTabsCardProps<T>) {
  const tabRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  React.useLayoutEffect(() => {
    tabRefs.current.length = tabs.length;
  }, [tabs.length]);

  const focusTab = React.useCallback((index: number) => {
    const el = tabRefs.current[index];
    el?.focus();
  }, []);

  const selectIndex = React.useCallback(
    (index: number) => {
      const tab = tabs[index];
      if (!tab) return;
      onValueChange(tab.id);
      queueMicrotask(() => focusTab(index));
    },
    [focusTab, onValueChange, tabs],
  );

  const onTabListKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled || tabs.length === 0) return;
      const i = tabs.findIndex((t) => t.id === value);
      const current = i >= 0 ? i : 0;

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        selectIndex((current + 1) % tabs.length);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        selectIndex((current - 1 + tabs.length) % tabs.length);
      } else if (e.key === "Home") {
        e.preventDefault();
        selectIndex(0);
      } else if (e.key === "End") {
        e.preventDefault();
        selectIndex(tabs.length - 1);
      }
    },
    [disabled, selectIndex, tabs, value],
  );

  return (
    <div className={cn("rounded-3xl bg-white p-2", className)} data-slot="compact-tabs-card">
      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label={tablistLabel}
        onKeyDown={onTabListKeyDown}
      >
        {tabs.map((tab, index) => {
          const selected = value === tab.id;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              type="button"
              role="tab"
              className={cn(buttonVariants({ variant: selected ? "brand" : "outline", size: "sm" }))}
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              disabled={disabled}
              onClick={() => selectIndex(index)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
