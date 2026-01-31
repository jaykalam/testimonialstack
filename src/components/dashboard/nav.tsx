"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  MessageSquareQuote,
  LayoutDashboard,
  Quote,
  Code2,
  Target,
  Settings,
  CreditCard,
  FileText,
} from "lucide-react";

const navItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Testimonials",
    href: "/dashboard/testimonials",
    icon: Quote,
  },
  {
    title: "Widgets",
    href: "/dashboard/widgets",
    icon: Code2,
  },
  {
    title: "Collection Pages",
    href: "/dashboard/collection-pages",
    icon: FileText,
  },
  {
    title: "Milestones",
    href: "/dashboard/milestones",
    icon: Target,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    title: "Billing",
    href: "/dashboard/billing",
    icon: CreditCard,
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r bg-white min-h-[calc(100vh-64px)]">
      <div className="p-4 border-b">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <MessageSquareQuote className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">TestimonialStack</span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-slate-100 hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
