"use client"

import { useState, useRef } from "react"
import { Plus, Search, Pencil, Trash2, Upload, X } from "lucide-react"
import { PlatformSidebar } from "@/components/platform-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RiskList, RiskListValue } from "@/lib/types"

function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

// Sample data
const initialLists: RiskList[] = [
  {
    id: "1",
    name: "Bancos riesgo alto",
    description: "bancos con riesgo operativo alto",
    values: [
      { id: "v1", value: "Banco XYZ" },
      { id: "v2", value: "Banco ABC" },
    ],
    isActive: true,
    createdAt: new Date("2026-03-01"),
    updatedAt: new Date("2026-03-15"),
  },
]

type ViewMode = "list" | "create" | "edit"

export default function ListasPage() {
  const [lists, setLists] = useState<RiskList[]>(initialLists)
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [editingList, setEditingList] = useState<RiskList | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [listToDelete, setListToDelete] = useState<RiskList | null>(null)
  const [rowsPerPage, setRowsPerPage] = useState("10")

  // Form state
  const [formName, setFormName] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formValues, setFormValues] = useState<RiskListValue[]>([])
  const [newValue, setNewValue] = useState("")
  const [valueSearchTerm, setValueSearchTerm] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredLists = lists.filter(
    (list) =>
      list.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      list.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredValues = formValues.filter((v) =>
    v.value.toLowerCase().includes(valueSearchTerm.toLowerCase())
  )

  const handleCreate = () => {
    setViewMode("create")
    setFormName("")
    setFormDescription("")
    setFormValues([])
    setEditingList(null)
  }

  const handleEdit = (list: RiskList) => {
    setViewMode("edit")
    setFormName(list.name)
    setFormDescription(list.description)
    setFormValues([...list.values])
    setEditingList(list)
  }

  const handleDeleteClick = (list: RiskList) => {
    setListToDelete(list)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (listToDelete) {
      setLists(lists.filter((l) => l.id !== listToDelete.id))
      setListToDelete(null)
    }
    setDeleteDialogOpen(false)
  }

  const handleAddValue = () => {
    if (newValue.trim()) {
      setFormValues([...formValues, { id: generateId(), value: newValue.trim() }])
      setNewValue("")
    }
  }

  const handleRemoveValue = (valueId: string) => {
    setFormValues(formValues.filter((v) => v.id !== valueId))
  }

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const text = event.target?.result as string
        const lines = text.split("\n").filter((line) => line.trim())
        const newValues = lines.map((line) => ({
          id: generateId(),
          value: line.trim(),
        }))
        setFormValues([...formValues, ...newValues])
      }
      reader.readAsText(file)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSave = () => {
    if (!formName.trim()) return

    if (editingList) {
      setLists(
        lists.map((l) =>
          l.id === editingList.id
            ? {
                ...l,
                name: formName,
                description: formDescription,
                values: formValues,
                updatedAt: new Date(),
              }
            : l
        )
      )
    } else {
      const newList: RiskList = {
        id: generateId(),
        name: formName,
        description: formDescription,
        values: formValues,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setLists([...lists, newList])
    }
    setViewMode("list")
  }

  const handleCancel = () => {
    setViewMode("list")
    setEditingList(null)
  }

  const handleToggleActive = (listId: string, isActive: boolean) => {
    setLists(
      lists.map((l) =>
        l.id === listId ? { ...l, isActive, updatedAt: new Date() } : l
      )
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <PlatformSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Breadcrumb */}
          <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <span>Home</span>
            <span>{">"}</span>
            <span>Listas</span>
            {viewMode !== "list" && (
              <>
                <span>{">"}</span>
                <span>{viewMode === "create" ? "Nueva lista" : "Editar lista"}</span>
              </>
            )}
          </div>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-foreground">Listas</h1>
            <p className="text-sm text-muted-foreground">Administrar listas</p>
          </div>

          {viewMode === "list" ? (
            <>
              {/* Filter Section */}
              <div className="mb-4 rounded-lg border border-border bg-card p-4">
                <h2 className="mb-4 text-base font-medium">Administración</h2>
                <div className="flex flex-wrap items-end gap-4">
                  <div className="flex-1 space-y-1">
                    <Label className="text-sm font-normal text-muted-foreground">Nombre</Label>
                    <Input
                      placeholder="Nombre de la lista"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Search className="mr-2 size-4" />
                    Buscar
                  </Button>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button
                    onClick={handleCreate}
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    Nuevo
                  </Button>
                  <Button variant="outline">Ver</Button>
                  <Button variant="outline">Editar</Button>
                  <Button variant="destructive">Borrar</Button>
                </div>
              </div>

              {/* Table */}
              <div className="rounded-lg border border-border bg-card">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span>Mostrar</span>
                    <Select value={rowsPerPage} onValueChange={setRowsPerPage}>
                      <SelectTrigger className="w-16">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                    <span>registros</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Buscar:</span>
                    <Input
                      className="w-48"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-20">ID</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLists.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                          No hay listas creadas
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredLists.map((list) => (
                        <TableRow key={list.id}>
                          <TableCell>{list.id}</TableCell>
                          <TableCell className="font-medium">{list.name}</TableCell>
                          <TableCell>{list.description}</TableCell>
                          <TableCell>
                            <Switch
                              checked={list.isActive}
                              onCheckedChange={(checked) => handleToggleActive(list.id, checked)}
                              className="data-[state=checked]:bg-primary"
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => handleEdit(list)}
                                title="Editar"
                              >
                                <Pencil className="size-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => handleDeleteClick(list)}
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

                <div className="flex items-center justify-between border-t border-border px-4 py-3 text-sm">
                  <span className="text-muted-foreground">
                    Mostrando registros del {filteredLists.length > 0 ? 1 : 0} al{" "}
                    {filteredLists.length} de un total de {filteredLists.length} registros
                  </span>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" disabled>
                      Anterior
                    </Button>
                    <Button variant="default" size="sm" className="bg-primary">
                      1
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      Siguiente
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Create/Edit Form */}
              <div className="space-y-6">
                {/* Lista Section */}
                <div className="rounded-lg border border-border bg-card p-4">
                  <h2 className="mb-4 text-base font-medium">Lista</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <Label className="text-sm font-normal text-muted-foreground">Nombre</Label>
                      <Input
                        placeholder="Nombre de la lista"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm font-normal text-muted-foreground">
                        Descripción
                      </Label>
                      <Input
                        placeholder="Descripción de la lista"
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Valores Section */}
                <div className="rounded-lg border border-border bg-card p-4">
                  <h2 className="mb-4 text-base font-medium">Valores</h2>
                  <div className="mb-4 flex items-end gap-4">
                    <div className="flex-1 space-y-1">
                      <Label className="text-sm font-normal text-muted-foreground">Valor</Label>
                      <Input
                        placeholder="Valor"
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            handleAddValue()
                          }
                        }}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddValue}
                    >
                      Agregar
                    </Button>
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept=".csv,.txt"
                        className="hidden"
                        onChange={handleCsvUpload}
                      />
                      <Button
                        type="button"
                        className="bg-primary/80 text-primary-foreground hover:bg-primary/70"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="mr-2 size-4" />
                        Carga masiva
                      </Button>
                    </div>
                  </div>

                  </div>

                {/* Values Table */}
                <div className="rounded-lg border-4 border-primary bg-card">
                  <div className="flex items-center justify-between border-b border-border px-4 py-3">
                    <div className="flex items-center gap-2 text-sm">
                      <span>Mostrar</span>
                      <Select defaultValue="10">
                        <SelectTrigger className="w-16">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="25">25</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                      </Select>
                      <span>registros</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Buscar:</span>
                      <Input
                        className="w-48"
                        value={valueSearchTerm}
                        onChange={(e) => setValueSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead>Valor</TableHead>
                        <TableHead className="w-20 text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredValues.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={2}
                            className="h-24 text-center text-primary"
                          >
                            Ningún dato disponible en esta tabla
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredValues.map((val) => (
                          <TableRow key={val.id}>
                            <TableCell>{val.value}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => handleRemoveValue(val.id)}
                                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                title="Eliminar"
                              >
                                <X className="size-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>

                  <div className="flex items-center justify-between border-t border-border px-4 py-3 text-sm">
                    <span className="text-muted-foreground">
                      Mostrando registros del {filteredValues.length > 0 ? 1 : 0} al{" "}
                      {filteredValues.length} de un total de {filteredValues.length} registros
                    </span>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" disabled>
                        Anterior
                      </Button>
                      <Button variant="outline" size="sm" disabled>
                        Siguiente
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Save/Cancel buttons */}
                <div className="mt-6 flex gap-3">
                  <Button
                    type="button"
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                    onClick={handleSave}
                  >
                    Guardar
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleCancel}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Eliminar lista?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Se eliminará permanentemente la lista
                  {listToDelete && <strong> &quot;{listToDelete.name}&quot;</strong>}.
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
      </main>
    </div>
  )
}
