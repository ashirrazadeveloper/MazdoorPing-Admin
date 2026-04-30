"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { User } from "@supabase/supabase-js";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  Grid3X3,
  DollarSign,
  AlertTriangle,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  HardHat,
  Menu,
  X,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  user: User | null;
  onSignOut: () => Promise<void>;
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose, user, onSignOut }: SidebarProps) {
  const pathname = usePathname();
  const [pendingWorkers, setPendingWorkers] = useState(0);
  const [activeSOS, setActiveSOS] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      const [wRes, sRes] = await Promise.all([
        supabase.from("workers").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("sos_alerts").select("id", { count: "exact", head: true }).eq("status", "active"),
      ]);
      setPendingWorkers(wRes.count || 0);
      setActiveSOS(sRes.count || 0);
    };
    fetchCounts();
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Workers",
      href: "/dashboard/workers",
      icon: Users,
      badge: pendingWorkers > 0 ? pendingWorkers : undefined,
    },
    {
      label: "Employers",
      href: "/dashboard/employers",
      icon: Building2,
    },
    {
      label: "Jobs",
      href: "/dashboard/jobs",
      icon: Briefcase,
    },
    {
      label: "Categories",
      href: "/dashboard/categories",
      icon: Grid3X3,
    },
    {
      label: "Financials",
      href: "/dashboard/financials",
      icon: DollarSign,
    },
    {
      label: "SOS Alerts",
      href: "/dashboard/sos-alerts",
      icon: AlertTriangle,
      badge: activeSOS > 0 ? activeSOS : undefined,
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-4 border-b border-gray-200">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-500 text-white shrink-0">
          <HardHat className="h-6 w-6" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-lg font-bold text-gray-900 truncate">MazdoorPing</h1>
            <p className="text-xs text-gray-500 truncate">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-orange-50 text-orange-700 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 shrink-0",
                  isActive ? "text-orange-600" : "text-gray-400"
                )}
              />
              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}
              {!collapsed && item.badge && (
                <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-medium text-white">
                  {item.badge}
                </span>
              )}
              {collapsed && item.badge && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-medium text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Button (Desktop) */}
      <div className="hidden lg:block border-t border-gray-200 p-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="w-full justify-center text-gray-500 hover:text-gray-700"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>

      {/* User section */}
      <Separator />
      <div className="p-3">
        {!collapsed && user && (
          <div className="px-3 pb-2 truncate">
            <p className="text-xs font-medium text-gray-900 truncate">
              {user.email}
            </p>
            <p className="text-xs text-gray-500">Super Admin</p>
          </div>
        )}
        <button
          onClick={onSignOut}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors w-full"
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:block h-screen sticky top-0 shrink-0 transition-all duration-300",
          collapsed ? "w-[72px]" : "w-64"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
