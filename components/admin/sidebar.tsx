'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  FileText, 
  FolderOpen, 
  Settings, 
  LogOut,
  User,
  Mail
} from 'lucide-react';
import { toast } from 'sonner';

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Blogs',
    href: '/admin/blogs',
    icon: FileText,
  },
  {
    title: 'Projects',
    href: '/admin/projects',
    icon: FolderOpen,
  },
  {
    title: 'Work Experience',
    href: '/admin/experience',
    icon: User,
  },
  {
    title: 'Messages',
    href: '/admin/messages',
    icon: Mail,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        toast.success('Logged out successfully');
        router.push('/admin');
      } else {
        toast.error('Logout failed');
      }
    } catch {
      toast.error('An error occurred during logout');
    }
  }

  return (
    <div className="animate-in fade-in slide-in-from-top-2 duration-500 border-b border-border/70 bg-card/80 backdrop-blur-sm">
      <div className="flex flex-col gap-4 px-5 py-4 md:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <Link href="/admin/dashboard" className="inline-flex items-center">
              <span className="type-section-title text-[1.5rem] md:text-[1.85rem]">Admin</span>
            </Link>
            <p className="type-body text-muted-foreground">
              Manage content, site settings, and incoming conversations from the same editorial system as the public site.
            </p>
          </div>
          <Button
            variant="outline"
            className="w-full justify-center md:w-auto"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <nav className="flex flex-wrap gap-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Button
                key={item.href}
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                className="justify-start"
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
