"use client";

import * as React from "react";

import { cn } from "@/lib/utils/cn";

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div data-slot="table-wrap" className="relative w-full overflow-x-auto rounded-xl border border-secondary-gray-100 bg-surface shadow-card dark:border-white/10 dark:bg-navy-800 dark:shadow-none">
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return <thead data-slot="table-header" className={cn("[&_tr]:border-b", className)} {...props} />;
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody data-slot="table-body" className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn("border-t border-secondary-gray-100 bg-secondary-gray-50/80 font-medium dark:border-white/10 dark:bg-navy-900/50", className)}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b border-secondary-gray-100 transition-colors hover:bg-secondary-gray-50/60 data-[state=selected]:bg-secondary-gray-50 dark:border-white/10 dark:hover:bg-white/[0.04] dark:data-[state=selected]:bg-white/[0.06]",
        className,
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-11 px-4 text-left align-middle text-[11px] font-bold uppercase tracking-wide text-secondary-gray-500 dark:text-secondary-gray-400",
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn("p-4 align-middle text-navy-700 dark:text-white", className)}
      {...props}
    />
  );
}

function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-sm text-secondary-gray-600 dark:text-secondary-gray-400", className)}
      {...props}
    />
  );
}

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
