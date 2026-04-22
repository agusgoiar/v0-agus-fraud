"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RulesList } from "@/components/rules-list"
import { RuleForm } from "@/components/rule-form"
import { PlatformSidebar } from "@/components/platform-sidebar"
import { FraudRule, RiskList } from "@/lib/types"

// Sample risk lists for the rule builder
const sampleRiskLists: RiskList[] = [
  {
    id: "list1",
    name: "Bancos riesgo alto",
    description: "Bancos con riesgo operativo alto",
    values: [{ id: "v1", value: "Banco A" }, { id: "v2", value: "Banco B" }],
    isActive: true,
    createdAt: new Date("2026-01-15"),
    updatedAt: new Date("2026-04-01"),
  },
  {
    id: "list2",
    name: "IPs bloqueadas",
    description: "Direcciones IP identificadas como fraudulentas",
    values: [{ id: "v3", value: "192.168.1.1" }],
    isActive: true,
    createdAt: new Date("2026-02-10"),
    updatedAt: new Date("2026-03-20"),
  },
  {
    id: "list3",
    name: "Dispositivos sospechosos",
    description: "IDs de dispositivos marcados como sospechosos",
    values: [],
    isActive: true,
    createdAt: new Date("2026-03-01"),
    updatedAt: new Date("2026-04-10"),
  },
]

// Sample data for demonstration
const sampleRules: FraudRule[] = [
  {
    id: "1",
    name: "Límite de monto por transacción",
    type: "operacion",
    groups: [
      {
        id: "g1",
        type: "standard",
        conditions: [
          { id: "c1", field: "amount", operator: ">", value: "500000" },
        ],
      },
    ],
    action: "AUTENTICAR",
    criticalityLevel: "alto",
    isActive: true,
    createdAt: new Date("2026-03-01"),
    updatedAt: new Date("2026-04-15T10:30:00"),
  },
  {
    id: "2",
    name: "Múltiples transacciones en 24hs",
    type: "operacion",
    groups: [
      {
        id: "g2",
        type: "standard",
        conditions: [
          { id: "c2", field: "userId", operator: "=", value: "12345" },
          { id: "c3", logicalOperator: "AND", field: "channel", operator: "=", value: "web" },
        ],
      },
    ],
    action: "REVISAR",
    criticalityLevel: "medio",
    isActive: true,
    createdAt: new Date("2026-02-15"),
    updatedAt: new Date("2026-04-10T14:20:00"),
  },
  {
    id: "3",
    name: "Dispositivo no confiable",
    type: "evento",
    groups: [
      {
        id: "g3",
        type: "standard",
        conditions: [
          { id: "c4", field: "isTrustedDevice", operator: "=", value: "false" },
        ],
      },
    ],
    action: "NOTIFICAR",
    criticalityLevel: "bajo",
    isActive: false,
    createdAt: new Date("2026-01-20"),
    updatedAt: new Date("2026-03-28T09:45:00"),
  },
  {
    id: "4",
    name: "IP en lista de riesgo",
    type: "operacion",
    groups: [
      {
        id: "g4",
        type: "standard",
        conditions: [
          { id: "c5", field: "ip", operator: "IN", value: "list2" },
        ],
      },
    ],
    action: "BLOQUEAR",
    criticalityLevel: "critico",
    isActive: true,
    createdAt: new Date("2026-02-01"),
    updatedAt: new Date("2026-04-18T16:00:00"),
  },
]

type ViewState = "list" | "create" | "edit"

export default function ReglasPage() {
  const [rules, setRules] = useState<FraudRule[]>(sampleRules)
  const [view, setView] = useState<ViewState>("list")
  const [editingRule, setEditingRule] = useState<FraudRule | null>(null)

  const handleCreate = () => {
    setEditingRule(null)
    setView("create")
  }

  const handleEdit = (rule: FraudRule) => {
    setEditingRule(rule)
    setView("edit")
  }

  const handleDelete = (ruleId: string) => {
    setRules((prev) => prev.filter((r) => r.id !== ruleId))
  }

  const handleToggleActive = (ruleId: string, isActive: boolean) => {
    setRules((prev) =>
      prev.map((r) =>
        r.id === ruleId ? { ...r, isActive, updatedAt: new Date() } : r
      )
    )
  }

  const handleSave = (ruleData: Omit<FraudRule, "id" | "createdAt" | "updatedAt">) => {
    if (editingRule) {
      // Update existing rule
      setRules((prev) =>
        prev.map((r) =>
          r.id === editingRule.id
            ? { ...r, ...ruleData, updatedAt: new Date() }
            : r
        )
      )
    } else {
      // Create new rule
      const newRule: FraudRule = {
        ...ruleData,
        id: Math.random().toString(36).substring(2, 9),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setRules((prev) => [...prev, newRule])
    }
    setView("list")
    setEditingRule(null)
  }

  const handleCancel = () => {
    setView("list")
    setEditingRule(null)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <PlatformSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-6">
            {view !== "list" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="mb-4"
              >
                <ArrowLeft className="mr-2 size-4" />
                Volver a la lista
              </Button>
            )}
            <h1 className="text-2xl font-semibold text-foreground">
              {view === "list" && "Reglas operacionales"}
              {view === "create" && "Nueva regla"}
              {view === "edit" && "Editar regla"}
            </h1>
            {view === "list" && (
              <p className="mt-1 text-sm text-muted-foreground">
                Gestiona las reglas de prevención de fraude para tu plataforma
              </p>
            )}
          </div>

          {/* Content */}
          {view === "list" && (
            <RulesList
              rules={rules}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onCreate={handleCreate}
              onToggleActive={handleToggleActive}
            />
          )}

          {(view === "create" || view === "edit") && (
            <div className="max-w-4xl">
              <RuleForm
                rule={editingRule || undefined}
                riskLists={sampleRiskLists}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
