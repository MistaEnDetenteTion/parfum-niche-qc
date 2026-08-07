"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FlaskConical,
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Calculator,
  Sparkles,
  Home,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/admin",
    icon: LayoutDashboard,
    label: "Tableau de bord",
    exact: true,
  },
  {
    href: "/admin/parfums",
    icon: FlaskConical,
    label: "Catalogue parfums",
  },
  {
    href: "/admin/grossistes",
    icon: Users,
    label: "Grossistes",
  },
  {
    href: "/admin/commandes",
    icon: ShoppingCart,
    label: "Lots de commande",
  },
  {
    href: "/admin/calculateur",
    icon: Calculator,
    label: "Calculateur",
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-sidebar border-r border-border/50">
      {/* Brand */}
      <div className="p-6 border-b border-border/50">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-gold-muted border border-gold/20 flex items-center justify-center transition-all group-hover:border-gold/40">
            <FlaskConical className="w-5 h-5 text-gold" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-foreground tracking-wide">
              Parfums Ramzi
            </span>
            <span className="text-xs text-muted-foreground uppercase tracking-widest">
              Centre de Commande
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group",
                isActive
                  ? "bg-gold-muted text-gold border border-gold/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              <item.icon
                className={cn(
                  "w-4 h-4 flex-shrink-0 transition-colors",
                  isActive ? "text-gold" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="w-3 h-3 text-gold/60" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer links */}
      <div className="p-3 border-t border-border/50 space-y-1">
        <Link
          href="/story"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Parfum du Jour</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Accueil</span>
        </Link>
      </div>
    </aside>
  );
}

/* ——— Mobile Header ——— */
export function AdminMobileHeader() {
  const pathname = usePathname();
  const currentItem = navItems.find((item) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)
  );

  return (
    <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border/50 bg-sidebar">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gold-muted border border-gold/20 flex items-center justify-center">
          <FlaskConical className="w-4 h-4 text-gold" />
        </div>
        <span className="text-sm font-semibold">Parfums Ramzi</span>
      </Link>

      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        {currentItem && (
          <>
            <currentItem.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{currentItem.label}</span>
          </>
        )}
      </div>
    </header>
  );
}
