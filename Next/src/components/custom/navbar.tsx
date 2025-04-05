"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Home, BarChart2, HelpCircle, Settings, LogOut, ChevronRight, Menu, MessageCircle, FileText, Workflow,Bell } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: Home, label: "Dashboard", key: "dashboard" },
  { icon: MessageCircle , label: "Feedbacks", key: "feedbacks" },
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
        <SheetContent side="left" className="p-0 bg-black text-white w-64">
          <motion.aside
            className="w-full h-full flex flex-col"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="p-4 border-b border-gray-800">
              <h2 className="text-2xl font-bold text-neon-green">{activePage || "Dashboard"}</h2>
            </div>
            <nav className="flex-1 pt-6">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  href={`/${item.key}`}
                  className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-neon-green transition-all duration-300 ${activePage === item.key ? "bg-gray-800 text-neon-green" : ""
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
            <div className="p-4 border-t border-gray-800">
              <UserMenu username={username} />
            </div>
          </motion.aside>
        </SheetContent>
      </Sheet>

      {/* Desktop Navbar */}
      <motion.aside
        className="max-sm:hidden w-64 bg-primary-foreground custom-shadow flex flex-col fixed h-full"
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="p-6 flex items-center justify-center border-b ">
          <h2 className="text-2xl font-bold text-primary">
            {navItems.find((item) => item.key === activePage)?.label || "Dashboard"}
          </h2>
        </div>
        <nav className="flex-1 pt-6">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={`/${item.key}`}
              className={`flex items-center px-6 py-2 transition-all duration-300 hover:bg-background hover:text-neon-green ${activePage === item.key ? "bg-background text-neon-green" : ""
                }`}
              onClick={() => setActivePage(item.key)}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span className="text-lg">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-6 border-t border-gray-800">
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
        variant="ghost"
        className="w-full justify-start hover:bg-background hover:text-primary transition-colors duration-300"
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
    <PopoverContent className="w-56 bg-background border text-white">
      {/* Dialogue Title */}
      <div className="border-b">
        <h3 className="text-lg font-semibold text-center pb-2">Account Settings</h3>
      </div>
      <div className="space-y-1 pt-2">
        <Button
          variant="ghost"
          className="w-full justify-start hover:text-primary-foreground hover:bg-foreground"
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start hover:text-primary-foreground hover:bg-foreground"
        >
          <HelpCircle className="w-4 h-4 mr-2" />
          Help
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-red-400 hover:text-red-700 hover:bg-foreground"
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