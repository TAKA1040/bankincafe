'use client'

import { useState, useCallback } from 'react'
import { dbClient, escapeValue } from '@/lib/db-client'

export interface SubjectMaster {
  id: string
  canonical_name: string
  category?: string
  usage_count: number
  last_used_at?: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export function useSubjectMaster() {
  const [subjects, setSubjects] = useState<SubjectMaster[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSubjects = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const sql = `
        SELECT * FROM task_master
        WHERE is_active = TRUE
        ORDER BY sort_order ASC
      `
      const result = await dbClient.executeSQL<SubjectMaster>(sql)

      if (!result.success) {
        throw new Error(result.error || 'データ取得に失敗しました')
      }

      setSubjects(result.data?.rows || [])
    } catch (err) {
      console.error('Failed to fetch subjects:', err)
      setError(err instanceof Error ? err.message : '件名マスターの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }, [])

  const addSubject = useCallback(async (subject: Omit<SubjectMaster, 'id' | 'created_at' | 'updated_at' | 'is_active'>) => {
    try {
      const sql = `
        INSERT INTO task_master (canonical_name, category, usage_count, last_used_at, sort_order, is_active)
        VALUES (${escapeValue(subject.canonical_name)}, ${escapeValue(subject.category || null)},
                ${subject.usage_count || 0}, ${escapeValue(subject.last_used_at || null)},
                ${subject.sort_order || 0}, TRUE)
      `
      const result = await dbClient.executeSQL(sql)
      if (!result.success) throw new Error(result.error)
      await fetchSubjects()
      return true
    } catch (err) {
      console.error('Failed to add subject:', err)
      setError(err instanceof Error ? err.message : '件名の追加に失敗しました')
      return false
    }
  }, [fetchSubjects])

  const updateSubject = useCallback(async (id: string, updates: Partial<SubjectMaster>) => {
    try {
      const setClauses: string[] = []
      if (updates.canonical_name !== undefined) {
        setClauses.push(`canonical_name = ${escapeValue(updates.canonical_name)}`)
      }
      if (updates.category !== undefined) {
        setClauses.push(`category = ${escapeValue(updates.category)}`)
      }
      if (updates.usage_count !== undefined) {
        setClauses.push(`usage_count = ${updates.usage_count}`)
      }
      if (updates.last_used_at !== undefined) {
        setClauses.push(`last_used_at = ${escapeValue(updates.last_used_at)}`)
      }
      if (updates.sort_order !== undefined) {
        setClauses.push(`sort_order = ${updates.sort_order}`)
      }
      if (updates.is_active !== undefined) {
        setClauses.push(`is_active = ${updates.is_active}`)
      }
      setClauses.push(`updated_at = ${escapeValue(new Date().toISOString())}`)

      if (setClauses.length > 0) {
        const sql = `UPDATE task_master SET ${setClauses.join(', ')} WHERE id = ${escapeValue(id)}`
        const result = await dbClient.executeSQL(sql)
        if (!result.success) throw new Error(result.error)
      }

      await fetchSubjects()
      return true
    } catch (err) {
      console.error('Failed to update subject:', err)
      setError(err instanceof Error ? err.message : '件名の更新に失敗しました')
      return false
    }
  }, [fetchSubjects])

  const deleteSubject = useCallback(async (id: string) => {
    try {
      // 論理削除
      const sql = `UPDATE task_master SET is_active = FALSE WHERE id = ${escapeValue(id)}`
      const result = await dbClient.executeSQL(sql)
      if (!result.success) throw new Error(result.error)
      await fetchSubjects()
      return true
    } catch (err) {
      console.error('Failed to delete subject:', err)
      setError(err instanceof Error ? err.message : '件名の削除に失敗しました')
      return false
    }
  }, [fetchSubjects])

  const reorderSubjects = useCallback(async (orderedSubjects: SubjectMaster[]) => {
    try {
      for (let i = 0; i < orderedSubjects.length; i++) {
        const subject = orderedSubjects[i]
        const sql = `UPDATE task_master SET sort_order = ${i} WHERE id = ${escapeValue(subject.id)}`
        await dbClient.executeSQL(sql)
      }

      await fetchSubjects()
      return true
    } catch (err) {
      console.error('Failed to reorder subjects:', err)
      setError(err instanceof Error ? err.message : '並び替えに失敗しました')
      return false
    }
  }, [fetchSubjects])

  return {
    subjects,
    loading,
    error,
    fetchSubjects,
    addSubject,
    updateSubject,
    deleteSubject,
    reorderSubjects,
  }
}
