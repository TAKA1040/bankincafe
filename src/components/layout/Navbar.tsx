'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { 
  Car, 
  FileText, 
  Users, 
  Search, 
  BarChart3, 
  Menu, 
  X, 
  LogOut,
  Home,
  Plus,
  List
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'ホーム', href: '/', icon: Home },
  { name: '請求書作成', href: '/invoice-create', icon: Plus },
  { name: '請求書一覧', href: '/invoice-list', icon: List },
  { name: '顧客管理', href: '/customer-list', icon: Users },
  { name: '作業履歴', href: '/work-history', icon: Search },
  { name: '作業検索', href: '/work-search', icon: FileText },
  { name: '売上管理', href: '/sales-management', icon: BarChart3 },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <nav className="bg-white shadow-sm border-b border-secondary-200">
      <div className="container">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="p-2 bg-primary-600 rounded-lg">
              <Car className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-secondary-900">
              鈑金Cafe
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50'
                  )}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Link>
              )
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3">
              <div className="text-sm">
                <div className="font-medium text-secondary-900">
                  {user?.user_metadata?.name || user?.email}
                </div>
                <div className="text-secondary-500">管理者</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                icon={<LogOut className="h-4 w-4" />}
              >
                ログアウト
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-secondary-200">
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50'
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {item.name}
                  </Link>
                )
              })}
              
              <div className="pt-4 mt-4 border-t border-secondary-200">
                <div className="px-3 py-2 text-sm">
                  <div className="font-medium text-secondary-900">
                    {user?.user_metadata?.name || user?.email}
                  </div>
                  <div className="text-secondary-500">管理者</div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center w-full px-3 py-2 text-sm font-medium text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  ログアウト
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}