"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { User } from "next-auth";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Home,
  MessageSquare,
  BarChart2,
  HelpCircle,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navbar = () => {
  const navItems = [
    { icon: Home, label: "Dashboard", key: "dashboard" },
    { icon: BarChart2, label: "Analytics", key: "analytics" },
    { icon: MessageSquare, label: "Notifications", key: "notifications" },
  ];
  const [activePage, setActivePage] = useState<string>(
    window.parent.location.pathname.slice(1)
  );
  const [activeLabel, setActiveLabel] = useState(
    navItems.filter((path) => path.key === activePage)
  );
  // console.log(" window.parent", window.parent.location.pathname.slice(1));
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const username = user?.username || user?.email;
  return (
    <>
      {/* mobile navbar */}
      <Sheet>
        <SheetTrigger>
          <Button
            variant="outline"
            className="sm:hidden py-2 absolute right-1 top-1"
          >
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent className="bg-white sm:hidden w-3/5 p-0">
          <aside className="w-full shadow-md flex flex-col fixed h-screen">
            <div className=" p-4 flex items-center justify-start">
              <h2 className="text-2xl font-bold text-gray-800">{activePage}</h2>
            </div>
            <nav className="flex-1 pt-6">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href="#"
                  className={`flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-all ${
                    activePage === item.label
                      ? "bg-gray-100 text-gray-900 "
                      : ""
                  }`}
                  onClick={() => setActivePage(item.label)}
                >
                  <item.icon
                    className={`w-5 h-5 mr-3  ${
                      activePage === item.label
                        ? "transition-all scale-[1.2]"
                        : ""
                    }`}
                  />
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start">
                    <Avatar className="w-8 h-8 mr-2">
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="@user"
                      />
                      <AvatarFallback>
                        {username?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{username}</span>
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-56"
                  align="end"
                  alignOffset={-8}
                  sideOffset={8}
                >
                  <div className="space-y-1">
                    <Button variant="ghost" className="w-full justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Help
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-blue-600"
                    >
                      Upgrade Plan
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600"
                      onClick={() => signOut()}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Log out
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </aside>
        </SheetContent>
      </Sheet>

      {/* large screen navbar */}
      <aside className=" max-sm:hidden w-52 bg-white shadow-md flex flex-col fixed h-screen">
        <div className="p-4 flex items-center justify-center border-b">
          <h2 className="text-xl tracking-tighter font-bold text-gray-800">
            {activeLabel[0]?.label || "Dashboard"}
          </h2>
        </div>
        <nav className="flex-1 pt-6">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.key}
              className={`flex items-center px-6 transition-all py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-800 mx-auto rounded-lg w-[95%] ${
                activePage === item.key
                  ? " bg-gray-100 mx-auto rounded-lg p-1 w-[95%] text-gray-900 "
                  : ""
              }`}
              onClick={() => setActivePage(item.key)}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="w-full justify-start">
                <Avatar className="w-8 h-8 mr-2">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@user"
                  />
                  <AvatarFallback>
                    {username?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{username}</span>
                <ChevronRight className="w-4 h-4 ml-auto" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-56"
              align="end"
              alignOffset={-8}
              sideOffset={8}
            >
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Help
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-blue-600"
                >
                  Upgrade Plan
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600"
                  onClick={() => signOut()}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </aside>
    </>
  );
};

export default navbar;
