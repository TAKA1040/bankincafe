/**
 * manarieDB クライアント
 * SQLクエリを実行するためのクライアント
 */

const MANARIEDB_ENDPOINT = 'https://manariedb.apaf.me'
const MANARIEDB_API_KEY = process.env.MANARIEDB_API_KEY || ''

interface QueryResult<T = Record<string, unknown>> {
  success: boolean
  data?: {
    columns?: string[]
    rows?: T[]
    rowCount?: number
    executionTime?: string
    message?: string
  }
  error?: string
}

/**
 * SQLクエリを実行
 */
export async function executeSQL<T = Record<string, unknown>>(sql: string): Promise<QueryResult<T>> {
  try {
    const body = JSON.stringify({ sql })

    const response = await fetch(`${MANARIEDB_ENDPOINT}/api/external/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${MANARIEDB_API_KEY}`,
      },
      body,
    })

    const result = await response.json()
    return result as QueryResult<T>
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * SELECT クエリを実行してデータを取得
 */
export async function query<T = Record<string, unknown>>(sql: string): Promise<T[]> {
  const result = await executeSQL<T>(sql)
  if (!result.success) {
    throw new Error(result.error || 'Query failed')
  }
  return result.data?.rows || []
}

/**
 * INSERT/UPDATE/DELETE クエリを実行
 */
export async function execute(sql: string): Promise<{ rowCount: number }> {
  const result = await executeSQL(sql)
  if (!result.success) {
    throw new Error(result.error || 'Execute failed')
  }
  return { rowCount: result.data?.rowCount || 0 }
}

/**
 * 値をSQLセーフにエスケープ
 */
export function escapeValue(value: unknown): string {
  if (value === null || value === undefined) return 'NULL'
  if (typeof value === 'number') return String(value)
  if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE'
  if (value instanceof Date) return `'${value.toISOString()}'`
  const escaped = String(value).replace(/'/g, "''")
  return `'${escaped}'`
}

/**
 * テーブル名をエスケープ
 */
export function escapeIdentifier(name: string): string {
  return `"${name.replace(/"/g, '""')}"`
}

// Supabase互換のクエリビルダー
type FilterOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ilike' | 'in' | 'is'

interface Filter {
  column: string
  operator: FilterOperator
  value: unknown
}

interface OrderBy {
  column: string
  ascending: boolean
}

interface Range {
  from: number
  to: number
}

export class QueryBuilder<T = Record<string, unknown>> {
  private tableName: string
  private selectColumns: string = '*'
  private filters: Filter[] = []
  private orderByClause: OrderBy[] = []
  private limitValue?: number
  private offsetValue?: number
  private rangeValue?: Range

  constructor(tableName: string) {
    this.tableName = tableName
  }

  select(columns: string = '*'): this {
    this.selectColumns = columns
    return this
  }

  eq(column: string, value: unknown): this {
    this.filters.push({ column, operator: 'eq', value })
    return this
  }

  neq(column: string, value: unknown): this {
    this.filters.push({ column, operator: 'neq', value })
    return this
  }

  gt(column: string, value: unknown): this {
    this.filters.push({ column, operator: 'gt', value })
    return this
  }

  gte(column: string, value: unknown): this {
    this.filters.push({ column, operator: 'gte', value })
    return this
  }

  lt(column: string, value: unknown): this {
    this.filters.push({ column, operator: 'lt', value })
    return this
  }

  lte(column: string, value: unknown): this {
    this.filters.push({ column, operator: 'lte', value })
    return this
  }

  like(column: string, pattern: string): this {
    this.filters.push({ column, operator: 'like', value: pattern })
    return this
  }

  ilike(column: string, pattern: string): this {
    this.filters.push({ column, operator: 'ilike', value: pattern })
    return this
  }

  in(column: string, values: unknown[]): this {
    this.filters.push({ column, operator: 'in', value: values })
    return this
  }

  is(column: string, value: null | boolean): this {
    this.filters.push({ column, operator: 'is', value })
    return this
  }

  order(column: string, options?: { ascending?: boolean }): this {
    this.orderByClause.push({ column, ascending: options?.ascending ?? true })
    return this
  }

  limit(count: number): this {
    this.limitValue = count
    return this
  }

  range(from: number, to: number): this {
    this.rangeValue = { from, to }
    return this
  }

  private buildWhereClause(): string {
    if (this.filters.length === 0) return ''

    const conditions = this.filters.map(f => {
      const col = escapeIdentifier(f.column)
      switch (f.operator) {
        case 'eq':
          return `${col} = ${escapeValue(f.value)}`
        case 'neq':
          return `${col} != ${escapeValue(f.value)}`
        case 'gt':
          return `${col} > ${escapeValue(f.value)}`
        case 'gte':
          return `${col} >= ${escapeValue(f.value)}`
        case 'lt':
          return `${col} < ${escapeValue(f.value)}`
        case 'lte':
          return `${col} <= ${escapeValue(f.value)}`
        case 'like':
          return `${col} LIKE ${escapeValue(f.value)}`
        case 'ilike':
          return `${col} ILIKE ${escapeValue(f.value)}`
        case 'in':
          const values = (f.value as unknown[]).map(v => escapeValue(v)).join(', ')
          return `${col} IN (${values})`
        case 'is':
          if (f.value === null) return `${col} IS NULL`
          return `${col} IS ${f.value ? 'TRUE' : 'FALSE'}`
        default:
          return ''
      }
    }).filter(Boolean)

    return conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
  }

  private buildOrderClause(): string {
    if (this.orderByClause.length === 0) return ''
    const orders = this.orderByClause.map(o =>
      `${escapeIdentifier(o.column)} ${o.ascending ? 'ASC' : 'DESC'}`
    )
    return `ORDER BY ${orders.join(', ')}`
  }

  private buildLimitClause(): string {
    if (this.rangeValue) {
      const limit = this.rangeValue.to - this.rangeValue.from + 1
      const offset = this.rangeValue.from
      return `LIMIT ${limit} OFFSET ${offset}`
    }
    if (this.limitValue) {
      let clause = `LIMIT ${this.limitValue}`
      if (this.offsetValue) {
        clause += ` OFFSET ${this.offsetValue}`
      }
      return clause
    }
    return ''
  }

  toSQL(): string {
    const parts = [
      `SELECT ${this.selectColumns}`,
      `FROM ${escapeIdentifier(this.tableName)}`,
      this.buildWhereClause(),
      this.buildOrderClause(),
      this.buildLimitClause(),
    ].filter(Boolean)

    return parts.join(' ')
  }

  async execute(): Promise<{ data: T[] | null; error: Error | null }> {
    try {
      const sql = this.toSQL()
      const rows = await query<T>(sql)
      return { data: rows, error: null }
    } catch (error) {
      return { data: null, error: error instanceof Error ? error : new Error('Unknown error') }
    }
  }

  // Supabase互換: single()
  async single(): Promise<{ data: T | null; error: Error | null }> {
    this.limitValue = 1
    const result = await this.execute()
    if (result.error) return { data: null, error: result.error }
    return { data: result.data?.[0] || null, error: null }
  }
}

// Supabase互換のfrom関数
export function from<T = Record<string, unknown>>(tableName: string): QueryBuilder<T> {
  return new QueryBuilder<T>(tableName)
}

// INSERT用ビルダー
export class InsertBuilder<T = Record<string, unknown>> {
  private tableName: string
  private data: Record<string, unknown>[] = []
  private returnData = false

  constructor(tableName: string) {
    this.tableName = tableName
  }

  insert(data: Record<string, unknown> | Record<string, unknown>[]): this {
    this.data = Array.isArray(data) ? data : [data]
    return this
  }

  select(): this {
    this.returnData = true
    return this
  }

  async execute(): Promise<{ data: T[] | null; error: Error | null }> {
    if (this.data.length === 0) {
      return { data: null, error: new Error('No data to insert') }
    }

    try {
      const columns = Object.keys(this.data[0])
      const columnList = columns.map(c => escapeIdentifier(c)).join(', ')
      const valuesList = this.data.map(row => {
        const values = columns.map(c => escapeValue(row[c])).join(', ')
        return `(${values})`
      }).join(', ')

      let sql = `INSERT INTO ${escapeIdentifier(this.tableName)} (${columnList}) VALUES ${valuesList}`

      if (this.returnData) {
        sql += ' RETURNING *'
      }

      const result = await executeSQL<T>(sql)
      if (!result.success) {
        return { data: null, error: new Error(result.error || 'Insert failed') }
      }

      return { data: result.data?.rows || null, error: null }
    } catch (error) {
      return { data: null, error: error instanceof Error ? error : new Error('Unknown error') }
    }
  }
}

// UPDATE用ビルダー
export class UpdateBuilder<T = Record<string, unknown>> {
  private tableName: string
  private updateData: Record<string, unknown> = {}
  private filters: Filter[] = []
  private returnData = false

  constructor(tableName: string) {
    this.tableName = tableName
  }

  update(data: Record<string, unknown>): this {
    this.updateData = data
    return this
  }

  eq(column: string, value: unknown): this {
    this.filters.push({ column, operator: 'eq', value })
    return this
  }

  select(): this {
    this.returnData = true
    return this
  }

  private buildWhereClause(): string {
    if (this.filters.length === 0) return ''
    const conditions = this.filters.map(f => {
      const col = escapeIdentifier(f.column)
      return `${col} = ${escapeValue(f.value)}`
    })
    return `WHERE ${conditions.join(' AND ')}`
  }

  async execute(): Promise<{ data: T[] | null; error: Error | null }> {
    try {
      const setClause = Object.entries(this.updateData)
        .map(([k, v]) => `${escapeIdentifier(k)} = ${escapeValue(v)}`)
        .join(', ')

      let sql = `UPDATE ${escapeIdentifier(this.tableName)} SET ${setClause} ${this.buildWhereClause()}`

      if (this.returnData) {
        sql += ' RETURNING *'
      }

      const result = await executeSQL<T>(sql)
      if (!result.success) {
        return { data: null, error: new Error(result.error || 'Update failed') }
      }

      return { data: result.data?.rows || null, error: null }
    } catch (error) {
      return { data: null, error: error instanceof Error ? error : new Error('Unknown error') }
    }
  }
}

// DELETE用ビルダー
export class DeleteBuilder {
  private tableName: string
  private filters: Filter[] = []

  constructor(tableName: string) {
    this.tableName = tableName
  }

  eq(column: string, value: unknown): this {
    this.filters.push({ column, operator: 'eq', value })
    return this
  }

  private buildWhereClause(): string {
    if (this.filters.length === 0) return ''
    const conditions = this.filters.map(f => {
      const col = escapeIdentifier(f.column)
      return `${col} = ${escapeValue(f.value)}`
    })
    return `WHERE ${conditions.join(' AND ')}`
  }

  async execute(): Promise<{ error: Error | null }> {
    try {
      const sql = `DELETE FROM ${escapeIdentifier(this.tableName)} ${this.buildWhereClause()}`
      const result = await executeSQL(sql)
      if (!result.success) {
        return { error: new Error(result.error || 'Delete failed') }
      }
      return { error: null }
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Unknown error') }
    }
  }
}

// manarieDBクライアント（Supabase互換インターフェース）
export const manariedb = {
  from: <T = Record<string, unknown>>(tableName: string) => {
    const builder = new QueryBuilder<T>(tableName)
    return {
      select: (columns?: string) => builder.select(columns || '*'),
      insert: (data: Record<string, unknown> | Record<string, unknown>[]) => {
        const ib = new InsertBuilder<T>(tableName)
        return ib.insert(data)
      },
      update: (data: Record<string, unknown>) => {
        const ub = new UpdateBuilder<T>(tableName)
        return ub.update(data)
      },
      delete: () => new DeleteBuilder(tableName),
    }
  },
  // 生SQLを実行
  query,
  execute,
  executeSQL,
}

export default manariedb
