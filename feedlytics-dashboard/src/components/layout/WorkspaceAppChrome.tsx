"use client";

import * as React from "react";
import { MenuIcon } from "lucide-react";

import { WorkspaceSidebarBody } from "@/components/layout/WorkspaceSidebarBody";
import {
  Dialog,
  DialogDrawerContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IconButton } from "@/components/ui/icon-button";

export function WorkspaceAppChrome({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-secondary-gray-100 dark:bg-navy-900">
      <aside
        className="fixed inset-y-0 left-0 z-40 hidden w-[250px] flex-col border-r border-secondary-gray-200 bg-surface dark:border-white/10 dark:bg-navy-800 lg:flex"
        aria-label="Main navigation"
      >
        <WorkspaceSidebarBody />
      </aside>

      <div className="flex min-h-screen flex-col lg:pl-[250px]">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-secondary-gray-200 bg-surface px-4 py-3 dark:border-white/10 dark:bg-navy-800 lg:hidden">
          <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
            <DialogTrigger
              render={
                <IconButton type="button" variant="outline" size="icon" label="Open menu" className="shrink-0">
                  <MenuIcon className="size-5" />
                </IconButton>
              }
            />
            <DialogDrawerContent showCloseButton className="border-r border-secondary-gray-200 dark:border-white/10">
              <WorkspaceSidebarBody onNavigate={() => setMobileOpen(false)} className="pt-4" />
            </DialogDrawerContent>
          </Dialog>
          <span className="font-heading text-[15px] font-bold text-navy-700 dark:text-white">Menu</span>
        </header>

        <div className="flex flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}
