/**
 * データベースクライアント（クライアントサイド用）
 * API Route経由でmanarieDBにアクセス
 */

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
 * SQLクエリを実行（API Route経由）
 */
export async function executeSQL<T = Record<string, unknown>>(sql: string): Promise<QueryResult<T>> {
  try {
    const response = await fetch('/api/db/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql }),
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
  private orFilters: string[] = []
  private orderByClause: OrderBy[] = []
  private limitValue?: number
  private offsetValue?: number
  private rangeValue?: Range
  private selectOptions?: { count?: 'exact'; head?: boolean }

  constructor(tableName: string) {
    this.tableName = tableName
  }

  select(columns: string = '*', options?: { count?: 'exact'; head?: boolean }): this {
    this.selectColumns = columns
    this.selectOptions = options
    return this
  }

  or(condition: string): this {
    this.orFilters.push(condition)
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
    const conditions: string[] = []

    // 通常のフィルター
    for (const f of this.filters) {
      const col = escapeIdentifier(f.column)
      switch (f.operator) {
        case 'eq':
          conditions.push(`${col} = ${escapeValue(f.value)}`)
          break
        case 'neq':
          conditions.push(`${col} != ${escapeValue(f.value)}`)
          break
        case 'gt':
          conditions.push(`${col} > ${escapeValue(f.value)}`)
          break
        case 'gte':
          conditions.push(`${col} >= ${escapeValue(f.value)}`)
          break
        case 'lt':
          conditions.push(`${col} < ${escapeValue(f.value)}`)
          break
        case 'lte':
          conditions.push(`${col} <= ${escapeValue(f.value)}`)
          break
        case 'like':
          conditions.push(`${col} LIKE ${escapeValue(f.value)}`)
          break
        case 'ilike':
          conditions.push(`${col} ILIKE ${escapeValue(f.value)}`)
          break
        case 'in':
          const values = (f.value as unknown[]).map(v => escapeValue(v)).join(', ')
          conditions.push(`${col} IN (${values})`)
          break
        case 'is':
          if (f.value === null) conditions.push(`${col} IS NULL`)
          else conditions.push(`${col} IS ${f.value ? 'TRUE' : 'FALSE'}`)
          break
      }
    }

    // ORフィルター（Supabase互換形式: "column.op.value,column.op.value"）
    for (const orFilter of this.orFilters) {
      const orConditions = orFilter.split(',').map(part => {
        const match = part.match(/^(\w+)\.(eq|ilike|like)\.(.+)$/)
        if (match) {
          const [, col, op, val] = match
          if (op === 'ilike') return `"${col}" ILIKE '${val}'`
          if (op === 'like') return `"${col}" LIKE '${val}'`
          return `"${col}" = '${val}'`
        }
        return null
      }).filter(Boolean)
      if (orConditions.length > 0) {
        conditions.push(`(${orConditions.join(' OR ')})`)
      }
    }

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

  async execute(): Promise<{ data: T[] | null; error: Error | null; count?: number | null }> {
    try {
      // countオプションがある場合はカウントを取得
      let count: number | null = null
      if (this.selectOptions?.count === 'exact') {
        const countSql = `SELECT COUNT(*) as count FROM ${escapeIdentifier(this.tableName)} ${this.buildWhereClause()}`
        const countResult = await query<{ count: string | number }>(countSql)
        count = Number(countResult[0]?.count) || null
      }

      // head: true の場合はデータを取得しない（カウントのみ）
      if (this.selectOptions?.head) {
        return { data: null, error: null, count }
      }

      const sql = this.toSQL()
      const rows = await query<T>(sql)

      return { data: rows, error: null, count }
    } catch (error) {
      return { data: null, error: error instanceof Error ? error : new Error('Unknown error') }
    }
  }

  async single(): Promise<{ data: T | null; error: Error | null }> {
    this.limitValue = 1
    const result = await this.execute()
    if (result.error) return { data: null, error: result.error }
    return { data: result.data?.[0] || null, error: null }
  }

  maybeSingle(): Promise<{ data: T | null; error: Error | null }> {
    return this.single()
  }

  // Promiseライクなインターフェース（Supabase互換）
  then<TResult1 = { data: T[] | null; error: Error | null; count?: number | null }, TResult2 = never>(
    onfulfilled?: ((value: { data: T[] | null; error: Error | null; count?: number | null }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected)
  }
}

// INSERT用ビルダー
export class InsertBuilder<T = Record<string, unknown>> {
  private tableName: string
  private insertData: Record<string, unknown>[] = []
  private returnData = false

  constructor(tableName: string) {
    this.tableName = tableName
  }

  insert(data: Record<string, unknown> | Record<string, unknown>[]): this {
    this.insertData = Array.isArray(data) ? data : [data]
    return this
  }

  select(): this {
    this.returnData = true
    return this
  }

  async execute(): Promise<{ data: T[] | null; error: Error | null }> {
    if (this.insertData.length === 0) {
      return { data: null, error: new Error('No data to insert') }
    }

    try {
      const columns = Object.keys(this.insertData[0])
      const columnList = columns.map(c => escapeIdentifier(c)).join(', ')
      const valuesList = this.insertData.map(row => {
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

  // Promiseライクなインターフェース（Supabase互換）
  then<TResult1 = { data: T[] | null; error: Error | null }, TResult2 = never>(
    onfulfilled?: ((value: { data: T[] | null; error: Error | null }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected)
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

  // Promiseライクなインターフェース（Supabase互換）
  then<TResult1 = { data: T[] | null; error: Error | null }, TResult2 = never>(
    onfulfilled?: ((value: { data: T[] | null; error: Error | null }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected)
  }
}

// DELETE用ビルダー（経理データ保護のため使用注意）
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

  // Promiseライクなインターフェース（Supabase互換）
  then<TResult1 = { error: Error | null }, TResult2 = never>(
    onfulfilled?: ((value: { error: Error | null }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected)
  }
}

// UPSERT用ビルダー
export class UpsertBuilder<T = Record<string, unknown>> {
  private tableName: string
  private upsertData: Record<string, unknown>[] = []
  private conflictColumns: string[] = []
  private returnData = false
  private doNothing = false

  constructor(tableName: string) {
    this.tableName = tableName
  }

  upsert(data: Record<string, unknown> | Record<string, unknown>[], options?: { onConflict?: string; ignoreDuplicates?: boolean }): this {
    this.upsertData = Array.isArray(data) ? data : [data]
    if (options?.onConflict) {
      this.conflictColumns = options.onConflict.split(',').map(c => c.trim())
    }
    if (options?.ignoreDuplicates) {
      this.doNothing = true
    }
    return this
  }

  select(): this {
    this.returnData = true
    return this
  }

  async execute(): Promise<{ data: T[] | null; error: Error | null }> {
    if (this.upsertData.length === 0) {
      return { data: null, error: new Error('No data to upsert') }
    }

    try {
      const columns = Object.keys(this.upsertData[0])
      const columnList = columns.map(c => escapeIdentifier(c)).join(', ')
      const valuesList = this.upsertData.map(row => {
        const values = columns.map(c => escapeValue(row[c])).join(', ')
        return `(${values})`
      }).join(', ')

      const conflictTarget = this.conflictColumns.length > 0
        ? `(${this.conflictColumns.map(c => escapeIdentifier(c)).join(', ')})`
        : `(${escapeIdentifier(columns[0])})`

      let sql = `INSERT INTO ${escapeIdentifier(this.tableName)} (${columnList}) VALUES ${valuesList}`

      if (this.doNothing) {
        sql += ` ON CONFLICT ${conflictTarget} DO NOTHING`
      } else {
        const updateList = columns
          .filter(c => !this.conflictColumns.includes(c))
          .map(c => `${escapeIdentifier(c)} = EXCLUDED.${escapeIdentifier(c)}`)
          .join(', ')
        sql += ` ON CONFLICT ${conflictTarget} DO UPDATE SET ${updateList}`
      }

      if (this.returnData) {
        sql += ' RETURNING *'
      }

      const result = await executeSQL<T>(sql)
      if (!result.success) {
        return { data: null, error: new Error(result.error || 'Upsert failed') }
      }

      return { data: result.data?.rows || null, error: null }
    } catch (error) {
      return { data: null, error: error instanceof Error ? error : new Error('Unknown error') }
    }
  }

  then<TResult1 = { data: T[] | null; error: Error | null }, TResult2 = never>(
    onfulfilled?: ((value: { data: T[] | null; error: Error | null }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected)
  }
}

// DBクライアント（Supabase互換インターフェース）
export const dbClient = {
  from: <T = Record<string, unknown>>(tableName: string) => {
    const builder = new QueryBuilder<T>(tableName)
    return {
      select: (columns?: string, options?: { count?: 'exact'; head?: boolean }) => builder.select(columns || '*', options),
      insert: (data: Record<string, unknown> | Record<string, unknown>[]) => {
        const ib = new InsertBuilder<T>(tableName)
        return ib.insert(data)
      },
      update: (data: Record<string, unknown>) => {
        const ub = new UpdateBuilder<T>(tableName)
        return ub.update(data)
      },
      delete: () => new DeleteBuilder(tableName),
      upsert: (data: Record<string, unknown> | Record<string, unknown>[], options?: { onConflict?: string; ignoreDuplicates?: boolean }) => {
        const ub = new UpsertBuilder<T>(tableName)
        return ub.upsert(data, options)
      },
    }
  },
  query,
  execute,
  executeSQL,
}

export default dbClient
