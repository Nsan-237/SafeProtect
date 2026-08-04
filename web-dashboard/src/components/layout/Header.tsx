'use client';
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, ChevronDown } from "lucide-react";

export function Header() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('@user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <header className="h-20 border-b bg-white px-8 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-[#1E1E2D]">Dashboard</h1>
        <p className="text-sm text-[#75759E]">Overview of Child Protection and GBV cases</p>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Bell className="h-6 w-6 text-[#1E1E2D]" />
          <span className="absolute top-1 right-1 w-5 h-5 bg-[#FF2E55] text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-white">
            5
          </span>
        </div>
        <div className="flex items-center gap-3 cursor-pointer pl-4 border-l border-gray-100">
          <Avatar className="h-10 w-10 border border-gray-200">
            <AvatarImage src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop" alt="Aline Ndey" />
            <AvatarFallback className="bg-primary text-white font-bold">AN</AvatarFallback>
          </Avatar>
          <div className="text-left">
            <p className="text-sm font-bold text-[#1E1E2D] leading-tight">
              {user ? user.name : 'Aline Ndey'}
            </p>
            <p className="text-xs text-[#75759E]">
              {user ? user.role.replace('_', ' ') : 'Social Worker'}
            </p>
          </div>
          <ChevronDown className="h-4 w-4 text-[#75759E] ml-1" />
        </div>
      </div>
    </header>
  );
}
