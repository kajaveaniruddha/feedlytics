"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Home, BarChart2, HelpCircle, Settings, LogOut, ChevronRight, Menu, MessageCircle, FileText, Workflow, Bell } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

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

  const { data: session } = useSession();
  const user = session?.user || {};
  const username = user.username || user.email || "Guest";

  const pathname = usePathname();

  useEffect(() => {
    // Update active page whenever the pathname changes
    setActivePage(pathname.slice(1) || "dashboard");
  }, [pathname]);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Navbar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="fixed top-4 right-4 z-50 sm:hidden">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          aria-labelledby="sheet-dialog-title"
          className="w-60 custom-shadow flex flex-col h-full"
        >
          <motion.aside
            className="w-full h-full flex flex-col"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="p-4 border-b border-gray-800">
              <SheetTitle id="sheet-dialog-title" className="text-2xl font-bold text-primary">
                {activePage || "Dashboard"}
              </SheetTitle>
            </div>
            <nav className="flex-1 pt-6">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  href={`/${item.key}`}
                  className={`flex items-center px-6 py-3 rounded-2xl hover:text-primary transition-all duration-300 ${activePage === item.key ? "scale-100 custom-shadow dark:text-primary" : "scale-95"
                    }`}
                  onClick={() => {
                    setActivePage(item.key);
                    toggleMenu();
                  }}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t">
              <UserMenu username={username} />
            </div>
          </motion.aside>
        </SheetContent>
      </Sheet>

      {/* Desktop Navbar */}
      <motion.aside
        className="max-sm:hidden w-60 custom-shadow flex flex-col fixed h-full"
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="p-6 flex items-center justify-center border-b border-border">
          <h2 className="text-2xl font-bold">
            {navItems.find((item) => item.key === activePage)?.label || "Dashboard"}
          </h2>
        </div>
        <nav className="flex-1 pt-6 px-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={`/${item.key}`}
              className={`flex items-center px-6 py-2 transition-all duration-300 hover:scale-100 rounded-2xl hover:custom-shadow ${activePage === item.key ? "scale-100 custom-shadow dark:text-primary" : "scale-95"}`}
              onClick={() => setActivePage(item.key)}
            >
              <item.icon className={`w-5 h-5 mr-3 transition-colors`} />
              <span className="text-lg">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-6">
          <UserMenu username={username} />
        </div>
      </motion.aside>
    </>
  );
};

const UserMenu = ({ username }: { username: string }) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button
        variant="secondary"
        className="w-full justify-start transition-colors duration-300 rounded-xl custom-shadow"
      >
        <Avatar className="w-8 h-8 mr-2">
          <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
          <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 truncate text-left">
          <span className="font-medium truncate block">{username}</span>
        </div>
        <ChevronRight className="w-4 h-4 flex-shrink-0" />
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-56 bg-secondary border">
      {/* Dialogue Title */}
      <div className="border-b">
        <h3 className="text-lg font-semibold text-center pb-2">Account Settings</h3>
      </div>
      <div className="space-y-1 pt-2">
        <Button
          variant="ghost"
          className="w-full justify-start scale-95 hover:scale-100 transition-transform"
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start scale-95 hover:scale-100 transition-transform"
        >
          <HelpCircle className="w-4 h-4 mr-2" />
          Help
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start scale-95 hover:scale-100 transition-transform"
          onClick={() => signOut()}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log out
        </Button>
      </div>
    </PopoverContent>
  </Popover>
);

export default Navbar;