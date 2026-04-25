"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Home, BarChart2, HelpCircle, Settings, LogOut, ChevronRight, Menu, MessageCircle, FileText, Workflow } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useMessageContext } from "@/hooks/use-message-context";

const navItems = [
  { icon: Home, label: "Dashboard", key: "dashboard" },
  { icon: MessageCircle, label: "Feedbacks", key: "feedbacks" },
  { icon: BarChart2, label: "Analytics", key: "analytics" },
  { icon: FileText, label: "Metadata", key: "metadata" },
  { icon: Workflow, label: "Workflows", key: "workflows" },
];

const Navbar = () => {
  const [activePage, setActivePage] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  const { session, userInfo } = useMessageContext();
  const user = session?.user || {};
  const username = user.username || user.email || "Guest";

  const pathname = usePathname();

  useEffect(() => {
    setActivePage(pathname.slice(1) || "dashboard");
  }, [pathname]);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Navbar */}
      <div className="sm:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="fixed top-4 right-4 z-50 sm:hidden">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            aria-labelledby="sheet-dialog-title"
            className="w-60 flex flex-col h-full border-r border-border bg-card"
          >
            <motion.aside
              className="w-full h-full flex flex-col"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="p-4 border-b border-border">
                <SheetTitle id="sheet-dialog-title" className="text-xl font-bold text-primary">
                  Feedlytics
                </SheetTitle>
              </div>
              <nav className="flex-1 pt-4 px-2 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.key}
                    href={`/${item.key}`}
                    className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      activePage === item.key
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                    }`}
                    onClick={() => {
                      setActivePage(item.key);
                      toggleMenu();
                    }}
                  >
                    <item.icon className="w-4 h-4 mr-3" />
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="p-4 border-t border-border">
                <UserMenu username={username} avatarUrl={userInfo.avatarUrl} />
              </div>
            </motion.aside>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <motion.aside
        className="max-sm:hidden w-60 flex flex-col fixed h-full border-r border-border bg-card"
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="p-6 flex items-center gap-2 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <BarChart2 className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-lg font-bold">Feedlytics</h2>
        </div>

        <nav className="flex-1 pt-4 px-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={`/${item.key}`}
              className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                activePage === item.key
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
              }`}
              onClick={() => setActivePage(item.key)}
            >
              <item.icon className="w-4 h-4 mr-3" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <UserMenu username={username} avatarUrl={userInfo.avatarUrl} />
        </div>
      </motion.aside>
    </>
  );
};

const UserMenu = ({ username, avatarUrl }: { username: string; avatarUrl: string }) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button
        variant="ghost"
        className="w-full justify-start rounded-lg hover:bg-primary/5"
      >
        <Avatar className="w-8 h-8 mr-2">
          <AvatarImage src={avatarUrl} alt="@user" />
          <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 truncate text-left">
          <span className="text-sm font-medium truncate block">{username}</span>
        </div>
        <ChevronRight className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-56 border border-border bg-card">
      <div className="border-b border-border">
        <h3 className="text-sm font-semibold text-center pb-2">Account</h3>
      </div>
      <div className="space-y-1 pt-2">
        <Button
          variant="ghost"
          disabled
          className="w-full justify-start text-sm"
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
        <Button
          disabled
          variant="ghost"
          className="w-full justify-start text-sm"
        >
          <HelpCircle className="w-4 h-4 mr-2" />
          Help
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-sm hover:text-destructive"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log out
        </Button>
      </div>
    </PopoverContent>
  </Popover>
);

export default Navbar;
