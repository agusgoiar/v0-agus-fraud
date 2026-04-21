export type RuleType = "operacion" | "evento"

export type LogicalOperator = "AND" | "OR"

export type ComparisonOperator = "=" | "!=" | ">" | "<" | ">=" | "<=" | "LIKE" | "IN"

export type ConditionScope = "misma_transaccion" | "misma_sesion" | "mismo_usuario" | "historico"

export type ActionType = "AUTENTICAR" | "BLOQUEAR" | "PERMITIR" | "REVISAR" | "NOTIFICAR"

export type CriticalityLevel = "bajo" | "medio" | "alto" | "critico"

export interface RuleCondition {
  id: string
  logicalOperator?: LogicalOperator
  field: string
  operator: ComparisonOperator
  value: string
  scope: ConditionScope
}

export interface ConditionGroup {
  id: string
  type: "standard" | "geoip"
  conditions: RuleCondition[]
}

export interface FraudRule {
  id: string
  name: string
  type: RuleType
  groups: ConditionGroup[]
  action: ActionType
  criticalityLevel: CriticalityLevel
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export const FIELD_OPTIONS = [
  { value: "idCanal", label: "ID Canal" },
  { value: "idTipoOperacion", label: "ID Tipo Operación" },
  { value: "monto", label: "Monto" },
  { value: "moneda", label: "Moneda" },
  { value: "pais", label: "País" },
  { value: "ip", label: "Dirección IP" },
  { value: "dispositivo", label: "Dispositivo" },
  { value: "horario", label: "Horario" },
  { value: "cantidadTransacciones", label: "Cantidad de Transacciones" },
  { value: "montoAcumulado", label: "Monto Acumulado" },
]

export const OPERATOR_OPTIONS: { value: ComparisonOperator; label: string }[] = [
  { value: "=", label: "=" },
  { value: "!=", label: "!=" },
  { value: ">", label: ">" },
  { value: "<", label: "<" },
  { value: ">=", label: ">=" },
  { value: "<=", label: "<=" },
  { value: "LIKE", label: "LIKE" },
  { value: "IN", label: "IN" },
]

export const SCOPE_OPTIONS: { value: ConditionScope; label: string }[] = [
  { value: "misma_transaccion", label: "Misma transacción" },
  { value: "misma_sesion", label: "Misma sesión" },
  { value: "mismo_usuario", label: "Mismo usuario" },
  { value: "historico", label: "Histórico" },
]

export const ACTION_OPTIONS: { value: ActionType; label: string }[] = [
  { value: "AUTENTICAR", label: "Autenticar" },
  { value: "BLOQUEAR", label: "Bloquear" },
  { value: "PERMITIR", label: "Permitir" },
  { value: "REVISAR", label: "Revisar" },
  { value: "NOTIFICAR", label: "Notificar" },
]

export const CRITICALITY_OPTIONS: { value: CriticalityLevel; label: string }[] = [
  { value: "bajo", label: "Bajo" },
  { value: "medio", label: "Medio" },
  { value: "alto", label: "Alto" },
  { value: "critico", label: "Crítico" },
]

// Operation Types
export type OperationType = "evento" | "transaccion"

export type ParameterDataType = "DATE" | "DOUBLE" | "INT" | "STRING" | "BOOLEAN"

export interface OperationParameter {
  id: string
  name: string
  dataType: ParameterDataType
  enabled: boolean
}

export interface Operation {
  id: string
  name: string
  type: OperationType
  parameters: OperationParameter[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export const DEFAULT_PARAMETERS: Omit<OperationParameter, "id">[] = [
  { name: "fechaHora", dataType: "DATE", enabled: true },
  { name: "monto", dataType: "DOUBLE", enabled: true },
  { name: "idCanal", dataType: "INT", enabled: true },
  { name: "idTipoOperacion", dataType: "INT", enabled: true },
  { name: "idUsuario", dataType: "STRING", enabled: true },
  { name: "cuentaDebito", dataType: "STRING", enabled: true },
  { name: "cuentaCredito", dataType: "STRING", enabled: true },
  { name: "Estado", dataType: "STRING", enabled: true },
  { name: "currency", dataType: "STRING", enabled: true },
]

export const OPERATION_TYPE_OPTIONS: { value: OperationType; label: string }[] = [
  { value: "evento", label: "Evento" },
  { value: "transaccion", label: "Transacción" },
]

export const PARAMETER_DATA_TYPE_OPTIONS: { value: ParameterDataType; label: string }[] = [
  { value: "DATE", label: "DATE" },
  { value: "DOUBLE", label: "DOUBLE" },
  { value: "INT", label: "INT" },
  { value: "STRING", label: "STRING" },
  { value: "BOOLEAN", label: "BOOLEAN" },
]

// Risk List Types
export interface RiskListValue {
  id: string
  value: string
}

export interface RiskList {
  id: string
  name: string
  description: string
  values: RiskListValue[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
