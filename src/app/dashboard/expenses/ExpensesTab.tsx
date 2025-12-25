"use client"

import { motion } from "framer-motion"
import {
  Plus,
  Camera,
  ShoppingCart,
  ChefHat,
  TrendingDown,
  DollarSign,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useExpenses } from "@/hooks/use-expenses"
import { useState } from "react"
import { useHapticFeedback } from "@/lib/haptics"
import { useRouter } from "next/navigation"

const periods = ["This Week", "This Month", "This Year"] as const
type Period = (typeof periods)[number]

export function ExpensesTab() {
  const router = useRouter();
  const haptic = useHapticFeedback();
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("This Month")
  const [openPeriod, setOpenPeriod] = useState(false)
  
  const { expenses, stats, loading, error } = useExpenses()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-purple-500 mx-auto mb-2"></div>
          <p className="text-[10px] sm:text-sm text-muted-foreground">Loading expenses...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 mx-auto mb-2" />
          <p className="text-[10px] sm:text-sm text-muted-foreground">Failed to load expenses</p>
        </div>
      </div>
    )
  }

  const totalExpenses = stats.total || 0
  const rationExpenses = stats.ration || 0
  const foodOrderExpenses = stats.foodOrder || 0
  const avgDailySpend = stats.avgDaily || 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="section-spacing"
    >
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3">
          <div className="flex-1">
            <h2 className="text-mobile-lg sm:text-xl font-bold">Expense Tracker</h2>
            <p className="text-mobile-xs sm:text-sm text-muted-foreground mt-0.5">
              Track your kitchen spending & vendor prices
            </p>
          </div>
        </div>

        <div className="flex gap-2 sm:gap-3 w-full">
          {/* Custom period dropdown */}
          <div className="relative flex-1 sm:flex-none">
            <button
              type="button"
              onClick={() => setOpenPeriod((p) => !p)}
              className="inline-flex items-center justify-between gap-2 h-10 sm:h-11 px-3 sm:px-4 rounded-xl
                         border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-mobile-sm sm:text-sm text-foreground w-full sm:min-w-[9.5rem]
                         hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
            >
              <span className="truncate">{selectedPeriod}</span>
              <span className="inline-flex items-center justify-center">
                <svg
                  className={`w-4 h-4 transition-transform ${openPeriod ? "rotate-180" : ""}`}
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M6 8l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>

            {openPeriod && (
              <div
                className="absolute right-0 mt-2 w-full sm:w-44 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800
                           shadow-lg z-20 overflow-hidden text-mobile-sm sm:text-sm"
              >
                {periods.map((period) => (
                  <button
                    key={period}
                    type="button"
                    onClick={() => {
                      setSelectedPeriod(period)
                      setOpenPeriod(false)
                    }}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-left transition-colors ${
                      selectedPeriod === period
                        ? "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                        : "text-muted-foreground hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Add Expense button */}
          <Button 
            className="flex-1 sm:flex-none h-10 sm:h-11 px-4 sm:px-5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-lg shadow-teal-500/30 text-mobile-sm sm:text-sm font-semibold"
            onClick={() => {
              haptic.medium();
              router.push("/dashboard/expenses/add");
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Add Expense</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="card-premium hover-lift">
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-md shadow-emerald-500/25">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <p className="text-mobile-xs sm:text-xs text-muted-foreground mb-1">Total Spent</p>
            <p className="text-mobile-lg sm:text-xl font-bold">₹{totalExpenses.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="card-premium hover-lift">
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md shadow-amber-500/25">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <p className="text-mobile-xs sm:text-xs text-muted-foreground mb-1">Ration</p>
            <p className="text-mobile-lg sm:text-xl font-bold text-amber-600 dark:text-amber-400">
              ₹{rationExpenses.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="card-premium hover-lift">
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-md shadow-orange-500/25">
              <ChefHat className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <p className="text-mobile-xs sm:text-xs text-muted-foreground mb-1">Food Orders</p>
            <p className="text-mobile-lg sm:text-xl font-bold text-orange-600 dark:text-orange-400">
              ₹{foodOrderExpenses.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="card-premium hover-lift">
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 rounded-xl bg-gradient-to-br from-blue-500 to-sky-600 flex items-center justify-center shadow-md shadow-blue-500/25">
              <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <p className="text-mobile-xs sm:text-xs text-muted-foreground mb-1">Avg Daily</p>
            <p className="text-mobile-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400">
              ₹{avgDailySpend.toFixed(0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Left Column */}
        <div className="lg:col-span-1 section-spacing">
          {/* Bill OCR Scanner */}
          <div 
            className="w-full overflow-hidden relative bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 rounded-xl shadow-xl hover:shadow-emerald-500/40 transition-all cursor-pointer group"
            onClick={() => {
              haptic.medium();
              router.push("/dashboard/expenses/add");
            }}
          >
            <div className="p-4 sm:p-5">
              <div className="flex flex-col items-center justify-center gap-2 sm:gap-3 text-white text-center group-hover:scale-[1.02] transition-transform">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                  <Camera className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base mb-0.5 sm:mb-1">Scan Receipt</h3>
                  <p className="text-emerald-100 text-[10px] sm:text-sm">
                    AI reads bill → auto-adds items & prices
                  </p>
                </div>
                <Badge className="bg-white/30 backdrop-blur-sm text-white border-0 text-[9px] sm:text-xs">
                  OCR Magic ✨
                </Badge>
              </div>
            </div>
          </div>

          {/* Summary Card */}
          <div className="w-full overflow-hidden relative bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full -ml-20 -mb-20 blur-2xl" />
            <div className="relative p-4 sm:p-5 text-white">
                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                  <p className="text-purple-200 text-[9px] sm:text-xs font-medium">{selectedPeriod}</p>
                  <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 text-[8px] sm:text-[10px]">
                    <TrendingDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                    -12% vs last
                  </Badge>
                </div>
                <p className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 drop-shadow-lg">
                  ₹{totalExpenses.toLocaleString()}
                </p>
                <div className="text-[9px] sm:text-xs text-purple-200 space-y-0.5 sm:space-y-1">
                  <div>Ration: ₹{rationExpenses.toLocaleString()}</div>
                  <div>Food Orders: ₹{foodOrderExpenses.toLocaleString()}</div>
                </div>
              </div>
          </div>

          {/* Budget Alert */}
          <Card className="border-l-4 border-amber-500 card-premium">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-start gap-2.5 sm:gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-amber-100 dark:bg-amber-950/30 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-[10px] sm:text-sm mb-0.5 sm:mb-1">Budget Alert</h4>
                  <p className="text-[9px] sm:text-xs text-muted-foreground mb-1.5 sm:mb-2">
                    You&apos;re 15% over monthly budget
                  </p>
                  <div className="flex gap-1.5 sm:gap-2">
                    <Button size="sm" variant="outline" className="h-6 sm:h-7 text-[8px] sm:text-[10px] px-2 sm:px-3">
                      Adjust Budget
                    </Button>
                    <Button size="sm" variant="destructive" className="h-6 sm:h-7 text-[8px] sm:text-[10px] px-2 sm:px-3">
                      Cut Spending
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vendor Comparison */}
          <Card className="card-premium">
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-[10px] sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2">
                <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                Vendor Prices
              </CardTitle>
            </CardHeader>
            <CardContent className="subsection-spacing pt-0">
              <VendorComparison vendor="DMart" price={245} isCheapest />
              <VendorComparison vendor="Local Store" price={280} />
              <VendorComparison vendor="BigBasket" price={265} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 section-spacing">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm sm:text-base">Recent Transactions</h3>
            <Badge variant="outline" className="text-[9px] sm:text-xs">
              4 vendors tracked
            </Badge>
          </div>

          <div className="section-spacing max-h-[600px] overflow-y-auto">
            {expenses.length > 0 ? (
              expenses.map((expense: Expense, index: number) => (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ExpenseCard expense={expense} />
                </motion.div>
              ))
            ) : (
              <div className="text-center py-6 sm:py-8">
                <DollarSign className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-[10px] sm:text-sm text-muted-foreground">No expenses recorded yet</p>
                <Button 
                  className="mt-2" 
                  size="sm"
                  onClick={() => {
                    haptic.medium();
                    router.push("/dashboard/expenses/add");
                  }}
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Add First Expense
                </Button>
              </div>
            )}
          </div>

          {/* Price Trend Placeholder */}
          <Card className="card-premium">
            <CardContent className="p-4 sm:p-5">
              <h4 className="font-semibold mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-sm">
                <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
                Price Trends (Last 30 days)
              </h4>
              <div className="h-40 sm:h-48 bg-gradient-to-r from-muted/50 to-muted rounded-xl sm:rounded-2xl flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <TrendingDown className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 opacity-40" />
                  <p className="text-[10px] sm:text-sm">📈 Charts coming soon</p>
                  <p className="text-[8px] sm:text-xs">Milk: +8% | Rice: -3%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}

interface Expense {
  id: string
  amount: number
  type: string
  category?: string
  vendor?: string
  date: string
  description?: string
}

function ExpenseCard({ expense }: { expense: Expense }) {
  const isRation = expense.type === "GROCERY" || expense.category === "GROCERY"
  return (
    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
      <Card className="card-premium hover:shadow-premium-lg transition-all cursor-pointer group">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div
                className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl shrink-0 shadow-md transition-all group-hover:scale-105 ${
                  isRation
                    ? "bg-emerald-100 dark:bg-emerald-950/30"
                    : "bg-orange-100 dark:bg-orange-950/30"
                }`}
              >
                {isRation ? (
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <ChefHat className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[10px] sm:text-sm truncate">
                  {expense.vendor || expense.type}
                </p>
                <p className="text-[9px] sm:text-xs text-muted-foreground">{expense.date}</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm sm:text-xl font-bold text-foreground">₹{expense.amount}</p>
              <Badge variant="secondary" className="text-[8px] sm:text-[10px] mt-0.5 sm:mt-1">
                {expense.type}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function VendorComparison({
  vendor,
  price,
  isCheapest = false,
}: {
  vendor: string
  price: number
  isCheapest?: boolean
}) {
  return (
    <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl hover:bg-muted/50 transition-colors group cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center text-lg sm:text-xl">
          🏪
        </div>
        <span className="font-medium text-mobile-sm sm:text-sm">{vendor}</span>
      </div>
      <div className="text-right">
        <p className="font-bold text-mobile-sm sm:text-sm">₹{price}</p>
        {isCheapest ? (
          <Badge className="bg-emerald-100 text-emerald-700 text-mobile-xs sm:text-xs mt-1 dark:bg-emerald-950/40 dark:text-emerald-400">
            Cheapest 🥇
          </Badge>
        ) : (
          <span className="text-mobile-xs sm:text-xs text-muted-foreground">Avg price</span>
        )}
      </div>
    </div>
  )
}
