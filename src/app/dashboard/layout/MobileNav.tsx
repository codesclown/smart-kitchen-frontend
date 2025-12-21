"use client"

import { Home, Package, ShoppingCart, Receipt, ChefHat } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useHapticFeedback } from '@/lib/haptics'

export type TabType = 'home' | 'inventory' | 'shopping' | 'expenses' | 'recipes'

interface MobileNavProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

const navItems = [
  { id: 'home' as const, icon: Home, label: 'Home' },
  { id: 'inventory' as const, icon: Package, label: 'Inventory' },
  { id: 'shopping' as const, icon: ShoppingCart, label: 'Shop' },
  { id: 'expenses' as const, icon: Receipt, label: 'Money' },
  { id: 'recipes' as const, icon: ChefHat, label: 'Recipes' },
]

export function MobileNav({ activeTab, onTabChange }: MobileNavProps) {
  const haptic = useHapticFeedback()
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden">
      <div className="flex h-16 items-center justify-around px-1 sm:px-2 pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <button
              key={item.id}
              onClick={() => {
                haptic.selection()
                onTabChange(item.id)
              }}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 px-1.5 py-1.5 min-w-[3rem] sm:min-w-[3.5rem] rounded-xl transition-all duration-200 touch-manipulation",
                "active:scale-95",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                <Icon 
                  className={cn(
                    "w-5 h-5 sm:w-6 sm:h-6 transition-all duration-200",
                    isActive && "scale-110"
                  )} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {isActive && (
                  <motion.div
                    layoutId="activeTabBg"
                    className="absolute -inset-2 sm:-inset-2.5 bg-primary/10 dark:bg-primary/20 rounded-xl -z-10"
                    transition={{ 
                      type: "spring", 
                      bounce: 0.2, 
                      duration: 0.6 
                    }}
                  />
                )}
              </div>
              
              <span 
                className={cn(
                  "text-[9px] sm:text-xs font-semibold transition-all duration-200 truncate max-w-full leading-tight",
                  isActive && "text-primary"
                )}
              >
                {item.label}
              </span>

              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                  transition={{ 
                    type: "spring", 
                    bounce: 0.2, 
                    duration: 0.6 
                  }}
                />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
