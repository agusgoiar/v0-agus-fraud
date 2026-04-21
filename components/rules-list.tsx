"use client"

import { useState } from "react"
import { Pencil, Trash2, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { FraudRule, CriticalityLevel } from "@/lib/types"

interface RulesListProps {
  rules: FraudRule[]
  onEdit: (rule: FraudRule) => void
  onDelete: (ruleId: string) => void
  onCreate: () => void
  onToggleActive: (ruleId: string, isActive: boolean) => void
}

function getCriticalityBadgeClass(level: CriticalityLevel) {
  switch (level) {
    case "bajo":
      return "bg-green-100 text-green-700 border-green-200"
    case "medio":
      return "bg-yellow-100 text-yellow-700 border-yellow-200"
    case "alto":
      return "bg-orange-100 text-orange-700 border-orange-200"
    case "critico":
      return "bg-red-100 text-red-700 border-red-200"
    default:
      return "bg-gray-100 text-gray-700 border-gray-200"
  }
}

function getCriticalityLabel(level: CriticalityLevel) {
  return level.charAt(0).toUpperCase() + level.slice(1)
}

export function RulesList({
  rules,
  onEdit,
  onDelete,
  onCreate,
  onToggleActive,
}: RulesListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [ruleToDelete, setRuleToDelete] = useState<FraudRule | null>(null)

  const filteredRules = rules.filter(
    (rule) =>
      rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDeleteClick = (rule: FraudRule) => {
    setRuleToDelete(rule)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (ruleToDelete) {
      onDelete(ruleToDelete.id)
      setRuleToDelete(null)
    }
    setDeleteDialogOpen(false)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar reglas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={onCreate} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 size-4" />
          Agregar regla
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Nombre</TableHead>
              <TableHead>Acción</TableHead>
              <TableHead>Criticidad</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Última actualización</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  {searchTerm
                    ? "No se encontraron reglas con ese criterio"
                    : "No hay reglas creadas. Haz clic en \"Agregar regla\" para crear una."}
                </TableCell>
              </TableRow>
            ) : (
              filteredRules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-medium">{rule.name}</TableCell>
                  <TableCell>{rule.action}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getCriticalityBadgeClass(rule.criticalityLevel)}
                    >
                      {getCriticalityLabel(rule.criticalityLevel)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={rule.isActive}
                      onCheckedChange={(checked) => onToggleActive(rule.id, checked)}
                      className="data-[state=checked]:bg-primary"
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {rule.updatedAt.toLocaleDateString("es-AR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onEdit(rule)}
                        title="Editar"
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDeleteClick(rule)}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        title="Eliminar"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar regla?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la regla
              {ruleToDelete && <strong> &quot;{ruleToDelete.name}&quot;</strong>}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
