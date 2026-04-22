"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ArrowRightLeft,
  LayoutDashboard,
  Users,
  ChevronDown,
  CreditCard,
  Bell,
  HelpCircle,
  LogOut,
  ShieldAlert,
  FileText,
  ChevronRight,
  ExternalLink,
  DollarSign,
  Wallet,
  Building2,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface MenuItem {
  label: string
  icon: React.ReactNode
  href?: string
  children?: { label: string; href: string }[]
}

interface MenuSection {
  title: string
  items: MenuItem[]
}

const menuSections: MenuSection[] = [
  {
    title: "GO-DIGITAL",
    items: [
      { label: "Movimientos", icon: <ArrowRightLeft className="size-4" />, href: "/movimientos" },
      { label: "Préstamos", icon: <DollarSign className="size-4" />, href: "/prestamos" },
      { label: "Comisiones", icon: <Wallet className="size-4" />, href: "/comisiones" },
      { label: "Notificaciones", icon: <Bell className="size-4" />, href: "/notificaciones" },
    ],
  },
  {
    title: "RECAUDACIONES",
    items: [
      { label: "Dashboard", icon: <LayoutDashboard className="size-4" />, href: "/recaudaciones/dashboard" },
      { label: "Clientes", icon: <Users className="size-4" />, href: "/recaudaciones/clientes" },
      { label: "Movimientos", icon: <ArrowRightLeft className="size-4" />, href: "/recaudaciones/movimientos" },
      { label: "Cobranzas", icon: <CreditCard className="size-4" />, href: "/recaudaciones/cobranzas" },
      {
        label: "Adquirencia",
        icon: <Building2 className="size-4" />,
        children: [
          { label: "Transacciones", href: "/recaudaciones/adquirencia/transacciones" },
          { label: "Terminales", href: "/recaudaciones/adquirencia/terminales" },
        ],
      },
    ],
  },
  {
    title: "PAGOS",
    items: [
      { label: "Dashboard", icon: <LayoutDashboard className="size-4" />, href: "/pagos/dashboard" },
      { label: "Clientes", icon: <Users className="size-4" />, href: "/pagos/clientes" },
      { label: "Cuenta recaudadora", icon: <Building2 className="size-4" />, href: "/pagos/cuenta-recaudadora" },
    ],
  },
  {
    title: "MOTOR ANTIFRAUDE",
    items: [
      {
        label: "Administración",
        icon: <Building2 className="size-4" />,
        children: [
          { label: "Operaciones", href: "/antifraude/operaciones" },
          { label: "Listas de Riesgo", href: "/antifraude/listas" },
        ],
      },
      {
        label: "Reglas",
        icon: <ShieldAlert className="size-4" />,
        children: [
          { label: "Reglas Operacionales", href: "/antifraude/reglas" },
          { label: "Eventos", href: "/antifraude/eventos" },
        ],
      },
    ],
  },
]

export function PlatformSidebar() {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    )
  }

  const isActive = (href: string) => pathname === href
  const isChildActive = (children?: { label: string; href: string }[]) =>
    children?.some((child) => pathname === child.href)

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center gap-1">
          <span className="text-3xl font-bold text-primary">Go</span>
          <div className="flex flex-col">
            <span className="size-1.5 rounded-full bg-primary" />
            <span className="size-1.5 rounded-full bg-primary/60" />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {menuSections.map((section) => (
          <div key={section.title} className="mb-4">
            <h3 className="mb-2 px-3 text-[11px] font-semibold tracking-wider text-muted-foreground">
              {section.title}
            </h3>
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.label}>
                  {item.children ? (
                    <div>
                      <button
                        onClick={() => toggleExpanded(item.label)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent",
                          isChildActive(item.children) && "bg-sidebar-accent text-sidebar-accent-foreground"
                        )}
                      >
                        <span className="flex items-center gap-3">
                          {item.icon}
                          {item.label}
                        </span>
                        <ChevronDown
                          className={cn(
                            "size-4 transition-transform",
                            expandedItems.includes(item.label) && "rotate-180"
                          )}
                        />
                      </button>
                      {expandedItems.includes(item.label) && (
                        <ul className="ml-6 mt-1 space-y-0.5 border-l border-sidebar-border pl-3">
                          {item.children.map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                className={cn(
                                  "flex items-center rounded-md px-3 py-1.5 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent",
                                  isActive(child.href) &&
                                    "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                                )}
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href!}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent",
                        isActive(item.href!) && "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                      )}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-3 py-3">
        <p className="mb-2 px-3 text-[10px] text-muted-foreground">V 1.1.0</p>
        <Link
          href="/ayuda"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
        >
          <HelpCircle className="size-4" />
          Ayuda y soporte
          <ExternalLink className="ml-auto size-3" />
        </Link>
        <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10">
          <LogOut className="size-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
