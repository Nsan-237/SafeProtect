'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, AlertTriangle, FolderOpen, Users, Calendar, Building2, FileText, UserCog, MessageSquare, Settings, Phone, Shield } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/incidents', label: 'Incidents', icon: AlertTriangle },
  { href: '/cases', label: 'Cases', icon: FolderOpen },
  { href: '/victims', label: 'Victims', icon: Users },
  { href: '/appointments', label: 'Appointments', icon: Calendar },
  { href: '/organizations', label: 'Organizations', icon: Building2 },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/users', label: 'Users', icon: UserCog },
  { href: '/messages', label: 'Messages', icon: MessageSquare },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#1E1248] text-white flex flex-col min-h-screen">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/30 rounded-xl flex items-center justify-center border border-primary/50">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold leading-tight">SafeProtect</h1>
          <p className="text-xs text-white/60">Cameroon</p>
        </div>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (pathname === '/' && item.href === '/dashboard');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive ? "bg-primary text-white font-semibold" : "hover:bg-white/10 text-white/80 hover:text-white"
              )}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 mt-auto">
        <div className="bg-[#2D1B69] rounded-2xl p-4 border border-white/10">
          <h3 className="font-bold text-sm mb-1 text-white">Need Help?</h3>
          <p className="text-xs text-white/70">Call Emergency</p>
          <p className="text-base font-bold text-white mb-3">122 or 1332</p>
          <Button variant="destructive" className="w-full text-xs font-bold gap-2 bg-[#FF2E55] hover:bg-[#FF2E55]/90 rounded-xl">
            <Phone className="h-4 w-4" />
            Emergency SOS
          </Button>
        </div>
      </div>
    </aside>
  );
}
