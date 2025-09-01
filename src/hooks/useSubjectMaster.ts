'use client'

import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

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

      const { data, error } = await supabase
        .from('task_master')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (error) throw error

      setSubjects(data as SubjectMaster[])
    } catch (err) {
      console.error('Failed to fetch subjects:', err)
      setError(err instanceof Error ? err.message : '件名マスターの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }, [])

  const addSubject = useCallback(async (subject: Omit<SubjectMaster, 'id' | 'created_at' | 'updated_at' | 'is_active'>) => {
    try {
      const { error } = await supabase
        .from('task_master')
        .insert([{ ...subject, is_active: true }])
      if (error) throw error
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
      const { error } = await supabase
        .from('task_master')
        .update(updates)
        .eq('id', id)
      if (error) throw error
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
      const { error } = await supabase
        .from('task_master')
        .update({ is_active: false })
        .eq('id', id)
      if (error) throw error
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
      const updates = orderedSubjects.map((subject, index) => ({
        id: subject.id,
        sort_order: index,
      }))

      const { error } = await supabase.from('task_master').upsert(updates)

      if (error) throw error
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
