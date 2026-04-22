"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RuleBuilder } from "@/components/rule-builder"
import {
  FraudRule,
  RuleType,
  ConditionGroup,
  ActionType,
  CriticalityLevel,
  ACTION_OPTIONS,
  CRITICALITY_OPTIONS,
  RiskList,
} from "@/lib/types"

interface RuleFormProps {
  rule?: FraudRule
  riskLists: RiskList[]
  onSave: (rule: Omit<FraudRule, "id" | "createdAt" | "updatedAt">) => void
  onCancel: () => void
}

function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

export function RuleForm({ rule, riskLists, onSave, onCancel }: RuleFormProps) {
  const [name, setName] = useState(rule?.name || "")
  const [type, setType] = useState<RuleType>(rule?.type || "operacion")
  const [isEnabled, setIsEnabled] = useState(rule?.isActive ?? true)
  const [groups, setGroups] = useState<ConditionGroup[]>(
    rule?.groups || [
      {
        id: generateId(),
        type: "standard",
        conditions: [
          {
            id: generateId(),
            field: "userId",
            operator: "=",
            value: "",
          },
        ],
      },
    ]
  )
  const [action, setAction] = useState<ActionType>(rule?.action || "AUTENTICAR")
  const [criticalityLevel, setCriticalityLevel] = useState<CriticalityLevel>(
    rule?.criticalityLevel || "bajo"
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      name,
      type,
      groups,
      action,
      criticalityLevel,
      isActive: isEnabled,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="flex items-end gap-6">
        <div className="flex-1 max-w-md space-y-2">
          <Label htmlFor="name">Nombre de la regla</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ingrese el nombre de la regla"
            required
          />
        </div>
        <div className="flex items-center gap-2 pb-2">
          <Label htmlFor="enabled" className="text-sm">Habilitada</Label>
          <Switch
            id="enabled"
            checked={isEnabled}
            onCheckedChange={setIsEnabled}
            className="data-[state=checked]:bg-primary"
          />
        </div>
      </div>

      {/* Rule Builder */}
      <div className="rounded-lg border border-border bg-muted/20 p-4">
        <RuleBuilder groups={groups} onChange={setGroups} riskLists={riskLists} />
      </div>

      {/* Action & Criticality */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="action">Acción</Label>
          <Select
            value={action}
            onValueChange={(value: ActionType) => setAction(value)}
          >
            <SelectTrigger id="action">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ACTION_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="criticality">Nivel de Criticidad</Label>
          <Select
            value={criticalityLevel}
            onValueChange={(value: CriticalityLevel) => setCriticalityLevel(value)}
          >
            <SelectTrigger id="criticality">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CRITICALITY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3">
        <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">
          Guardar
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={onCancel}
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}
