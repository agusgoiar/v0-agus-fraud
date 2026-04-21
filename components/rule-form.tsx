"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
} from "@/lib/types"

interface RuleFormProps {
  rule?: FraudRule
  onSave: (rule: Omit<FraudRule, "id" | "createdAt" | "updatedAt">) => void
  onCancel: () => void
}

function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

export function RuleForm({ rule, onSave, onCancel }: RuleFormProps) {
  const [name, setName] = useState(rule?.name || "")
  const [type, setType] = useState<RuleType>(rule?.type || "operacion")
  const [groups, setGroups] = useState<ConditionGroup[]>(
    rule?.groups || [
      {
        id: generateId(),
        type: "standard",
        conditions: [
          {
            id: generateId(),
            field: "idCanal",
            operator: "=",
            value: "",
            scope: "misma_transaccion",
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
      isActive: rule?.isActive ?? true,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-2">
        <Label htmlFor="name">Nombre de la regla</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ingrese el nombre de la regla"
          required
          className="max-w-md"
        />
      </div>

      {/* Rule Builder */}
      <div className="rounded-lg border border-border bg-muted/20 p-4">
        <RuleBuilder groups={groups} onChange={setGroups} />

        {/* Form Actions inside builder */}
        <div className="mt-4 flex gap-2">
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
    </form>
  )
}
