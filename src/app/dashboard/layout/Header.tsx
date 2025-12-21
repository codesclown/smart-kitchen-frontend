"use client"

import { Bell, Settings, ChefHat, Moon, Sun, X, LogOut, User } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useEffect, useState } from 'react'
import { clearAuthState, getCurrentUser } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export function Header() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    const currentUser = getCurrentUser()
    setUser(currentUser)
  }, [])

  const handleLogout = () => {
    clearAuthState()
    router.push('/login')
  }

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 sm:h-16 max-w-screen-2xl items-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-2.5 bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-600 rounded-xl shadow-lg shadow-purple-500/20">
              <ChefHat className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Smart Kitchen
              </h1>
              <p className="text-xs text-muted-foreground font-medium">AI-Powered</p>
            </div>
            <h1 className="text-base font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent sm:hidden">
              Kitchen
            </h1>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 sm:h-16 max-w-screen-2xl items-center px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-2 sm:p-2.5 bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-600 rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-shadow cursor-pointer">
            <ChefHat className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          
          {/* Desktop Logo */}
          <div className="hidden sm:block">
            <h1 className="text-sm sm:text-base font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
              Smart Kitchen
            </h1>
            <p className="text-[9px] sm:text-xs text-muted-foreground font-medium">
              AI-Powered Management
            </p>
          </div>

          {/* Mobile Logo */}
          <h1 className="text-xs sm:hidden font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Kitchen
          </h1>
        </div>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-amber-500" />
            ) : (
              <Moon className="h-5 w-5 text-purple-600" />
            )}
          </Button>

          {/* Notifications */}
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-xl hover:bg-muted transition-colors"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs border-2 border-background shadow-lg">
                  3
                </Badge>
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:w-[400px] p-0">
              {/* Header */}
              <SheetHeader className="p-6 pb-4 border-b">
                <div className="flex items-center justify-between">
                  <SheetTitle className="text-sm sm:text-base font-bold">
                    Notifications
                  </SheetTitle>
                  <Badge className="bg-muted text-muted-foreground border-0 text-[9px] sm:text-xs">
                    3 new
                  </Badge>
                </div>
              </SheetHeader>
              
              {/* Notifications List */}
              <div className="p-4 space-y-3 max-h-[calc(100vh-8rem)] overflow-y-auto">
                <NotificationItem
                  title="Low Stock Alert"
                  description="Milk is running low (0.5L remaining)"
                  time="2 hours ago"
                  type="warning"
                />
                <NotificationItem
                  title="Expiry Warning"
                  description="Tomatoes will expire in 2 days"
                  time="5 hours ago"
                  type="error"
                />
                <NotificationItem
                  title="Shopping Reminder"
                  description="Monthly shopping due tomorrow"
                  time="1 day ago"
                  type="info"
                />
              </div>

              {/* Footer */}
              <div className="p-4 border-t mt-auto">
                <Button variant="outline" className="w-full">
                  View All Notifications
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* Settings */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl hover:bg-muted transition-colors"
            aria-label="Settings"
            onClick={() => router.push('/dashboard/settings')}
          >
            <Settings className="h-5 w-5" />
          </Button>

          {/* User Menu - Desktop Only */}
          <div className="hidden sm:block">
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl hover:bg-muted transition-colors"
                  aria-label="User menu"
                >
                  <User className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader className="pb-4">
                  <SheetTitle>Account</SheetTitle>
                </SheetHeader>
                
                {/* User Info */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 rounded-lg bg-muted/50">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white font-bold">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] sm:text-sm font-medium truncate">{user?.name || 'User'}</p>
                      <p className="text-[9px] sm:text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Menu Items */}
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => router.push('/dashboard/settings')}
                    >
                      <Settings className="mr-3 h-4 w-4" />
                      Settings
                    </Button>
                    
                    <Separator />
                    
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Sign out
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

function NotificationItem({ 
  title, 
  description, 
  time, 
  type 
}: { 
  title: string
  description: string
  time: string
  type: 'info' | 'warning' | 'error' 
}) {
  const config = {
    info: {
      bg: 'bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-950/30',
      border: 'border-blue-200 dark:border-blue-900',
      dot: 'bg-blue-500',
      icon: '💡'
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-950/20 hover:bg-amber-100 dark:hover:bg-amber-950/30',
      border: 'border-amber-200 dark:border-amber-900',
      dot: 'bg-amber-500',
      icon: '⚠️'
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/30',
      border: 'border-red-200 dark:border-red-900',
      dot: 'bg-red-500',
      icon: '🔴'
    },
  }

  const style = config[type]

  return (
    <div className={`p-4 rounded-xl border ${style.bg} ${style.border} transition-all cursor-pointer group`}>
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="text-xl shrink-0">{style.icon}</div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-semibold text-[10px] sm:text-sm text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              {title}
            </h4>
            <div className={`shrink-0 w-2 h-2 rounded-full mt-1.5 ${style.dot} animate-pulse`} />
          </div>
          <p className="text-[9px] sm:text-xs text-muted-foreground line-clamp-2 mb-2">
            {description}
          </p>
          <p className="text-[8px] sm:text-[10px] text-muted-foreground font-medium">
            {time}
          </p>
        </div>
      </div>
    </div>
  )
}
