'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { ChevronDown, Search, X } from 'lucide-react'

export interface SearchableSelectOption {
  value: string
  label: string
  secondary?: string
  usage_count?: number
}

interface SearchableSelectProps {
  value: string
  onChange: (value: string) => void
  onSearch: (keyword: string) => SearchableSelectOption[]
  placeholder?: string
  label?: string
  required?: boolean
  disabled?: boolean
  allowFreeInput?: boolean
  maxHeight?: string
}

export function SearchableSelect({
  value,
  onChange,
  onSearch,
  placeholder = "検索または選択してください",
  label,
  required = false,
  disabled = false,
  allowFreeInput = true,
  maxHeight = "200px"
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [options, setOptions] = useState<SearchableSelectOption[]>([])
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const optionsRef = useRef<HTMLDivElement>(null)

  // 検索結果を更新
  const updateOptions = useCallback((keyword: string) => {
    const results = onSearch(keyword)
    setOptions(results)
    setHighlightedIndex(-1)
  }, [onSearch])

  // 検索実行
  useEffect(() => {
    updateOptions(searchTerm)
  }, [searchTerm, updateOptions])

  // 外部クリックでドロップダウンを閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // キーボード操作
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
        } else {
          setHighlightedIndex(prev => 
            prev < options.length - 1 ? prev + 1 : prev
          )
        }
        break
      
      case 'ArrowUp':
        event.preventDefault()
        if (isOpen) {
          setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev)
        }
        break
      
      case 'Enter':
        event.preventDefault()
        if (isOpen && highlightedIndex >= 0) {
          handleSelectOption(options[highlightedIndex])
        } else if (allowFreeInput && searchTerm.trim()) {
          handleSelectOption({ value: searchTerm.trim(), label: searchTerm.trim() })
        }
        break
      
      case 'Escape':
        event.preventDefault()
        setIsOpen(false)
        setHighlightedIndex(-1)
        break
      
      case 'Tab':
        setIsOpen(false)
        break
    }
  }

  // オプション選択
  const handleSelectOption = (option: SearchableSelectOption) => {
    onChange(option.value)
    setSearchTerm('')
    setIsOpen(false)
    setHighlightedIndex(-1)
  }

  // 入力フィールドフォーカス
  const handleInputFocus = () => {
    if (!disabled) {
      setIsOpen(true)
      // 現在の値で初期検索
      if (value && !searchTerm) {
        setSearchTerm(value)
      }
    }
  }

  // 入力値変更
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    setSearchTerm(newValue)
    
    if (allowFreeInput) {
      onChange(newValue)
    }
    
    if (!isOpen) {
      setIsOpen(true)
    }
  }

  // クリア
  const handleClear = () => {
    onChange('')
    setSearchTerm('')
    setIsOpen(false)
    inputRef.current?.focus()
  }

  // 表示用の値を決定
  const displayValue = isOpen ? searchTerm : value

  return (
    <div className="relative z-10" ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-3 py-2 pr-20 border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''}
          `}
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 mr-1"
            >
              <X size={16} />
            </button>
          )}
          
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className="text-gray-400 hover:text-gray-600"
          >
            <ChevronDown 
              size={20} 
              className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            />
          </button>
        </div>
      </div>

      {/* ドロップダウンオプション */}
      {isOpen && (
        <div 
          ref={optionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg"
          style={{ maxHeight, top: '100%' }}
        >
          <div className="overflow-y-auto" style={{ maxHeight }}>
            {options.length > 0 ? (
              options.map((option, index) => (
                <div
                  key={`${option.value}-${index}`}
                  onClick={() => handleSelectOption(option)}
                  className={`
                    px-3 py-2 cursor-pointer border-b border-gray-100 last:border-b-0
                    ${index === highlightedIndex ? 'bg-blue-50' : 'hover:bg-gray-50'}
                  `}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {option.label}
                      </div>
                      {option.secondary && (
                        <div className="text-sm text-gray-500 truncate">
                          {option.secondary}
                        </div>
                      )}
                    </div>
                    {option.usage_count && option.usage_count > 1 && (
                      <div className="ml-2 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        {option.usage_count}回
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-500 text-center">
                {searchTerm ? '該当する項目がありません' : '該当する項目がありません'}
                {allowFreeInput && searchTerm && (
                  <div className="mt-1 text-sm">
                    <button
                      type="button"
                      onClick={() => handleSelectOption({ value: searchTerm, label: searchTerm })}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      「{searchTerm}」を新規入力
                    </button>
                  </div>
                )}
                {allowFreeInput && !searchTerm && (
                  <div className="mt-1 text-sm text-gray-400">
                    入力して新規項目を作成できます
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}