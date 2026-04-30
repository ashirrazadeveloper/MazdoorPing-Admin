"use client";

import React from "react";
import type { User } from "@supabase/supabase-js";

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
  user?: User | null;
}

export function Header({ title, onMenuClick, user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-4 sm:px-6">
      {/* Mobile menu button */}
      <button
        className="lg:hidden p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
        onClick={onMenuClick}
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
        <span className="sr-only">Toggle menu</span>
      </button>

      {/* Page title */}
      <h1 className="text-xl font-semibold text-gray-900">{title}</h1>

      <div className="flex-1" />

      {/* User avatar */}
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 text-sm font-semibold">
          {(user?.email?.[0] || "A").toUpperCase()}
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
            {user?.email || "Admin"}
          </p>
          <p className="text-xs text-gray-500">Super Admin</p>
        </div>
      </div>
    </header>
  );
}
