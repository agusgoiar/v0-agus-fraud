"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ConditionGroup,
  RuleCondition,
  FIELD_OPTIONS,
  OPERATOR_OPTIONS,
  RiskList,
} from "@/lib/types"

interface RuleBuilderProps {
  groups: ConditionGroup[]
  onChange: (groups: ConditionGroup[]) => void
  riskLists: RiskList[]
}

function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

export function RuleBuilder({ groups, onChange, riskLists }: RuleBuilderProps) {
  const addCondition = (groupId: string) => {
    const updatedGroups = groups.map((group) => {
      if (group.id === groupId) {
        const newCondition: RuleCondition = {
          id: generateId(),
          logicalOperator: group.conditions.length > 0 ? "AND" : undefined,
          field: "userId",
          operator: "=",
          value: "",
        }
        return { ...group, conditions: [...group.conditions, newCondition] }
      }
      return group
    })
    onChange(updatedGroups)
  }

  const removeCondition = (groupId: string, conditionId: string) => {
    const updatedGroups = groups.map((group) => {
      if (group.id === groupId) {
        const filteredConditions = group.conditions.filter((c) => c.id !== conditionId)
        // Update first condition to not have logical operator
        if (filteredConditions.length > 0 && filteredConditions[0].logicalOperator) {
          filteredConditions[0] = { ...filteredConditions[0], logicalOperator: undefined }
        }
        return { ...group, conditions: filteredConditions }
      }
      return group
    })
    onChange(updatedGroups)
  }

  const updateCondition = (
    groupId: string,
    conditionId: string,
    field: keyof RuleCondition,
    value: string
  ) => {
    const updatedGroups = groups.map((group) => {
      if (group.id === groupId) {
        const updatedConditions = group.conditions.map((condition) => {
          if (condition.id === conditionId) {
            return { ...condition, [field]: value }
          }
          return condition
        })
        return { ...group, conditions: updatedConditions }
      }
      return group
    })
    onChange(updatedGroups)
  }

  const addGroup = (type: "standard" | "geoip" = "standard") => {
    const newGroup: ConditionGroup = {
      id: generateId(),
      type,
      conditions: [
        {
          id: generateId(),
          field: "userId",
          operator: "=",
          value: "",
        },
      ],
    }
    onChange([...groups, newGroup])
  }

  const removeGroup = (groupId: string) => {
    onChange(groups.filter((group) => group.id !== groupId))
  }

  return (
    <div className="space-y-4">
      {groups.map((group, groupIndex) => (
        <div
          key={group.id}
          className="rounded-lg border border-border bg-muted/30 p-4"
        >
          {/* Group Header */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Button
              type="button"
              size="sm"
              className="bg-primary/80 text-primary-foreground hover:bg-primary/70"
              onClick={() => addCondition(group.id)}
            >
              <Plus className="mr-1 size-4" />
              Agregar condición
            </Button>
            {groups.length > 1 && (
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() => removeGroup(group.id)}
              >
                <Minus className="mr-1 size-4" />
                Borrar grupo
              </Button>
            )}
          </div>

          {/* Group Type Label */}
          {group.type === "geoip" && (
            <div className="mb-3 text-sm font-medium text-muted-foreground">
              Grupo GeoIP
            </div>
          )}

          {/* Conditions */}
          <div className="space-y-2">
            {group.conditions.map((condition, conditionIndex) => (
              <div key={condition.id} className="flex flex-wrap items-center gap-2">
                {/* Logical Operator */}
                {conditionIndex > 0 && (
                  <Select
                    value={condition.logicalOperator}
                    onValueChange={(value) =>
                      updateCondition(group.id, condition.id, "logicalOperator", value)
                    }
                  >
                    <SelectTrigger className="w-20 bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AND">AND</SelectItem>
                      <SelectItem value="OR">OR</SelectItem>
                    </SelectContent>
                  </Select>
                )}

                {/* Field */}
                <Select
                  value={condition.field}
                  onValueChange={(value) =>
                    updateCondition(group.id, condition.id, "field", value)
                  }
                >
                  <SelectTrigger className="w-44 bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FIELD_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Operator */}
                <Select
                  value={condition.operator}
                  onValueChange={(value) => {
                    updateCondition(group.id, condition.id, "operator", value)
                    // Clear value when switching to/from IN
                    if (value === "IN" || condition.operator === "IN") {
                      updateCondition(group.id, condition.id, "value", "")
                    }
                  }}
                >
                  <SelectTrigger className="w-20 bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {OPERATOR_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Value or Risk List */}
                {condition.operator === "IN" ? (
                  <Select
                    value={condition.value}
                    onValueChange={(value) =>
                      updateCondition(group.id, condition.id, "value", value)
                    }
                  >
                    <SelectTrigger className="w-44 bg-background">
                      <SelectValue placeholder="Seleccionar lista" />
                    </SelectTrigger>
                    <SelectContent>
                      {riskLists.length === 0 ? (
                        <SelectItem value="" disabled>
                          No hay listas creadas
                        </SelectItem>
                      ) : (
                        riskLists.map((list) => (
                          <SelectItem key={list.id} value={list.id}>
                            {list.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    type="text"
                    value={condition.value}
                    onChange={(e) =>
                      updateCondition(group.id, condition.id, "value", e.target.value)
                    }
                    placeholder="Valor"
                    className="w-32 bg-background"
                  />
                )}

                {/* Remove Condition */}
                {group.conditions.length > 1 && (
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    onClick={() => removeCondition(group.id, condition.id)}
                  >
                    <Minus className="size-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {groups.length === 0 && (
        <div className="flex justify-center py-8">
          <Button
            type="button"
            className="bg-primary/80 text-primary-foreground hover:bg-primary/70"
            onClick={() => addGroup("standard")}
          >
            <Plus className="mr-2 size-4" />
            Agregar primera condición
          </Button>
        </div>
      )}
    </div>
  )
}
