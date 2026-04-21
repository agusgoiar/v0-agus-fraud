"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, Search, ChevronLeft, X } from "lucide-react"
import { PlatformSidebar } from "@/components/platform-sidebar"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Operation,
  OperationType,
  OperationParameter,
  DEFAULT_PARAMETERS,
  OPERATION_TYPE_OPTIONS,
  PARAMETER_DATA_TYPE_OPTIONS,
  ParameterDataType,
} from "@/lib/types"

// Mock data
const initialOperations: Operation[] = [
  {
    id: "1",
    name: "Transferencia bancaria",
    type: "transaccion",
    parameters: DEFAULT_PARAMETERS.map((p, i) => ({ ...p, id: `param-1-${i}` })),
    isActive: true,
    createdAt: new Date("2026-03-15"),
    updatedAt: new Date("2026-04-10"),
  },
  {
    id: "2",
    name: "Login de usuario",
    type: "evento",
    parameters: DEFAULT_PARAMETERS.slice(0, 5).map((p, i) => ({ ...p, id: `param-2-${i}` })),
    isActive: true,
    createdAt: new Date("2026-03-20"),
    updatedAt: new Date("2026-04-08"),
  },
]

function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

type ViewMode = "list" | "create" | "edit"

export default function OperacionesPage() {
  const [operations, setOperations] = useState<Operation[]>(initialOperations)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [editingOperation, setEditingOperation] = useState<Operation | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [operationToDelete, setOperationToDelete] = useState<Operation | null>(null)

  // Form state
  const [formName, setFormName] = useState("")
  const [formType, setFormType] = useState<OperationType>("transaccion")
  const [showParameters, setShowParameters] = useState(false)
  const [formParameters, setFormParameters] = useState<OperationParameter[]>([])

  const filteredOperations = operations.filter((op) =>
    op.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const resetForm = () => {
    setFormName("")
    setFormType("transaccion")
    setShowParameters(false)
    setFormParameters([])
    setEditingOperation(null)
  }

  const handleCreate = () => {
    resetForm()
    setViewMode("create")
  }

  const handleEdit = (operation: Operation) => {
    setEditingOperation(operation)
    setFormName(operation.name)
    setFormType(operation.type)
    setFormParameters(operation.parameters)
    setShowParameters(true)
    setViewMode("edit")
  }

  const handleDeleteClick = (operation: Operation) => {
    setOperationToDelete(operation)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (operationToDelete) {
      setOperations(operations.filter((op) => op.id !== operationToDelete.id))
      setOperationToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  const handleToggleActive = (id: string) => {
    setOperations(
      operations.map((op) =>
        op.id === id ? { ...op, isActive: !op.isActive } : op
      )
    )
  }

  const handleCreateOperation = () => {
    if (!formName.trim()) return
    
    // Initialize with default parameters
    const params = DEFAULT_PARAMETERS.map((p, i) => ({
      ...p,
      id: generateId(),
    }))
    setFormParameters(params)
    setShowParameters(true)
  }

  const handleSaveOperation = () => {
    if (!formName.trim()) return

    if (viewMode === "edit" && editingOperation) {
      setOperations(
        operations.map((op) =>
          op.id === editingOperation.id
            ? {
                ...op,
                name: formName,
                type: formType,
                parameters: formParameters,
                updatedAt: new Date(),
              }
            : op
        )
      )
    } else {
      const newOperation: Operation = {
        id: generateId(),
        name: formName,
        type: formType,
        parameters: formParameters,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setOperations([...operations, newOperation])
    }

    resetForm()
    setViewMode("list")
  }

  const handleBack = () => {
    resetForm()
    setViewMode("list")
  }

  const handleToggleParameter = (paramId: string) => {
    setFormParameters(
      formParameters.map((p) =>
        p.id === paramId ? { ...p, enabled: !p.enabled } : p
      )
    )
  }

  const handleAddParameter = () => {
    const newParam: OperationParameter = {
      id: generateId(),
      name: "",
      dataType: "STRING",
      enabled: true,
    }
    setFormParameters([...formParameters, newParam])
  }

  const handleUpdateParameter = (
    paramId: string,
    field: keyof OperationParameter,
    value: string | boolean
  ) => {
    setFormParameters(
      formParameters.map((p) =>
        p.id === paramId ? { ...p, [field]: value } : p
      )
    )
  }

  const handleRemoveParameter = (paramId: string) => {
    setFormParameters(formParameters.filter((p) => p.id !== paramId))
  }

  return (
    <div className="flex h-screen bg-background">
      <PlatformSidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {viewMode === "list" ? (
            <>
              <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-foreground">
                  Operaciones
                </h1>
                <Button
                  onClick={handleCreate}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="mr-2 size-4" />
                  Agregar operación
                </Button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <div className="relative w-80">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar operaciones"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="rounded-lg border border-border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Parámetros</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Última actualización</TableHead>
                      <TableHead className="w-24">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOperations.map((operation) => (
                      <TableRow key={operation.id}>
                        <TableCell className="font-medium">
                          {operation.name}
                        </TableCell>
                        <TableCell>
                          <span className="rounded-full bg-muted px-2 py-1 text-xs capitalize">
                            {operation.type}
                          </span>
                        </TableCell>
                        <TableCell>
                          {operation.parameters.filter((p) => p.enabled).length} activos
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={operation.isActive}
                            onCheckedChange={() => handleToggleActive(operation.id)}
                          />
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {operation.updatedAt.toLocaleDateString("es-AR")}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(operation)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <Pencil className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(operation)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredOperations.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                          No se encontraron operaciones
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          ) : (
            <>
              {/* Create/Edit View */}
              <div className="mb-6">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="mb-4 text-muted-foreground hover:text-foreground"
                >
                  <ChevronLeft className="mr-1 size-4" />
                  Volver al listado
                </Button>
                <h1 className="text-2xl font-semibold text-foreground">
                  {viewMode === "edit" ? "Editar operación" : "Nueva operación"}
                </h1>
              </div>

              <div className="max-w-4xl rounded-lg border border-border bg-card p-6">
                {/* Basic Info */}
                <div className="mb-6 grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Nombre de la operación
                    </label>
                    <Input
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Ingrese el nombre"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Tipo
                    </label>
                    <Select value={formType} onValueChange={(v) => setFormType(v as OperationType)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {OPERATION_TYPE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {!showParameters && (
                  <Button
                    onClick={handleCreateOperation}
                    disabled={!formName.trim()}
                    className="bg-primary/80 text-primary-foreground hover:bg-primary/70"
                  >
                    Crear operación
                  </Button>
                )}

                {/* Parameters Table */}
                {showParameters && (
                  <div className="mt-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-lg font-medium text-foreground">
                        Parámetros de la operación
                      </h2>
                      <Button
                        onClick={handleAddParameter}
                        size="sm"
                        className="bg-primary/80 text-primary-foreground hover:bg-primary/70"
                      >
                        <Plus className="mr-1 size-4" />
                        Agregar parámetro
                      </Button>
                    </div>

                    <div className="rounded-lg border border-border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Tipo de Dato</TableHead>
                            <TableHead>Habilitado</TableHead>
                            <TableHead className="w-16"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {formParameters.map((param) => (
                            <TableRow key={param.id}>
                              <TableCell>
                                <Input
                                  value={param.name}
                                  onChange={(e) =>
                                    handleUpdateParameter(param.id, "name", e.target.value)
                                  }
                                  className="h-8"
                                />
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={param.dataType}
                                  onValueChange={(v) =>
                                    handleUpdateParameter(param.id, "dataType", v as ParameterDataType)
                                  }
                                >
                                  <SelectTrigger className="h-8 w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {PARAMETER_DATA_TYPE_OPTIONS.map((opt) => (
                                      <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>
                                <Switch
                                  checked={param.enabled}
                                  onCheckedChange={() => handleToggleParameter(param.id)}
                                />
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveParameter(param.id)}
                                  className="size-8 text-muted-foreground hover:text-destructive"
                                >
                                  <X className="size-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Save/Cancel */}
                    <div className="mt-6 flex gap-3">
                      <Button
                        onClick={handleSaveOperation}
                        className="bg-accent text-accent-foreground hover:bg-accent/90"
                      >
                        {viewMode === "edit" ? "Guardar cambios" : "Guardar operación"}
                      </Button>
                      <Button variant="destructive" onClick={handleBack}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar operación</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea eliminar la operación &quot;{operationToDelete?.name}&quot;?
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
