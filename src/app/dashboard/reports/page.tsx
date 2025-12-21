"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft,
  FileText,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  DollarSign,
  Package,
  ShoppingCart,
  Trash2,
  Target,
  Award,
  Filter
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { useRouter } from 'next/navigation'
import { useHapticFeedback } from '@/lib/haptics'

interface ReportData {
  period: string
  inventory: {
    totalItems: number
    totalValue: number
    lowStockItems: number
    expiringItems: number
    categories: { name: string; count: number; value: number }[]
  }
  expenses: {
    totalSpent: number
    avgDaily: number
    topCategories: { name: string; amount: number; percentage: number }[]
    monthlyTrend: { month: string; amount: number }[]
  }
  waste: {
    totalWaste: number
    wasteValue: number
    preventableWaste: number
    wasteReduction: number
  }
  shopping: {
    listsCreated: number
    itemsPurchased: number
    avgListSize: number
    completionRate: number
  }
  efficiency: {
    inventoryTurnover: number
    wastePercentage: number
    budgetUtilization: number
    planningAccuracy: number
  }
}

const mockReportData: ReportData = {
  period: 'January 2024',
  inventory: {
    totalItems: 156,
    totalValue: 12450,
    lowStockItems: 8,
    expiringItems: 12,
    categories: [
      { name: 'Vegetables & Fruits', count: 45, value: 3200 },
      { name: 'Grains & Cereals', count: 28, value: 2800 },
      { name: 'Dairy & Eggs', count: 18, value: 1800 },
      { name: 'Meat & Fish', count: 15, value: 2400 },
      { name: 'Spices & Condiments', count: 32, value: 1600 }
    ]
  },
  expenses: {
    totalSpent: 8750,
    avgDaily: 282,
    topCategories: [
      { name: 'Groceries', amount: 5200, percentage: 59.4 },
      { name: 'Food Delivery', amount: 2100, percentage: 24.0 },
      { name: 'Dining Out', amount: 950, percentage: 10.9 },
      { name: 'Kitchen Supplies', amount: 500, percentage: 5.7 }
    ],
    monthlyTrend: [
      { month: 'Oct', amount: 7200 },
      { month: 'Nov', amount: 8100 },
      { month: 'Dec', amount: 8900 },
      { month: 'Jan', amount: 8750 }
    ]
  },
  waste: {
    totalWaste: 2.8,
    wasteValue: 420,
    preventableWaste: 2.1,
    wasteReduction: -15
  },
  shopping: {
    listsCreated: 12,
    itemsPurchased: 184,
    avgListSize: 15.3,
    completionRate: 87
  },
  efficiency: {
    inventoryTurnover: 4.2,
    wastePercentage: 4.8,
    budgetUtilization: 92,
    planningAccuracy: 78
  }
}

const reportTypes = [
  { id: 'summary', name: 'Executive Summary', icon: FileText },
  { id: 'inventory', name: 'Inventory Report', icon: Package },
  { id: 'expenses', name: 'Expense Analysis', icon: DollarSign },
  { id: 'waste', name: 'Waste Report', icon: Trash2 },
  { id: 'efficiency', name: 'Efficiency Metrics', icon: Target }
]

export default function ReportsPage() {
  const router = useRouter()
  const haptic = useHapticFeedback()
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedReport, setSelectedReport] = useState('summary')

  const downloadReport = (format: 'pdf' | 'excel' | 'csv') => {
    haptic.medium()
    // In real app, this would generate and download the report
    console.log(`Downloading ${selectedReport} report as ${format}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="section-spacing page-container page-padding mobile-bottom-safe"
    >
      {/* Header */}
      <div className="flex items-center gap-3 sm:gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            haptic.light()
            router.back()
          }}
          className="h-8 w-8 sm:h-10 sm:w-10"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-sm sm:text-2xl font-bold flex items-center gap-1.5 sm:gap-2">
            <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
            Reports & Analytics
          </h1>
          <p className="text-[10px] sm:text-sm text-muted-foreground">Comprehensive insights and detailed reports</p>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-24 sm:w-32 mobile-input">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button
            size="sm"
            className="mobile-btn-sm bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            onClick={() => downloadReport('pdf')}
          >
            <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
        {reportTypes.map((report) => {
          const Icon = report.icon
          const isSelected = selectedReport === report.id
          
          return (
            <motion.div
              key={report.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant={isSelected ? 'default' : 'outline'}
                className="w-full h-auto p-2 sm:p-3 flex flex-col items-center gap-1 sm:gap-2"
                onClick={() => {
                  haptic.selection()
                  setSelectedReport(report.id)
                }}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-[9px] sm:text-xs font-medium text-center">{report.name}</span>
              </Button>
            </motion.div>
          )
        })}
      </div>

      {/* Executive Summary */}
      {selectedReport === 'summary' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="subsection-spacing"
        >
          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <MetricCard
              icon={<Package className="w-4 h-4 sm:w-5 sm:h-5" />}
              title="Inventory Value"
              value={`₹${mockReportData.inventory.totalValue.toLocaleString()}`}
              change={+8.5}
              color="bg-blue-500"
            />
            <MetricCard
              icon={<DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />}
              title="Total Expenses"
              value={`₹${mockReportData.expenses.totalSpent.toLocaleString()}`}
              change={-3.2}
              color="bg-green-500"
            />
            <MetricCard
              icon={<Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />}
              title="Food Waste"
              value={`${mockReportData.waste.totalWaste}kg`}
              change={mockReportData.waste.wasteReduction}
              color="bg-red-500"
            />
            <MetricCard
              icon={<Target className="w-4 h-4 sm:w-5 sm:h-5" />}
              title="Efficiency Score"
              value={`${mockReportData.efficiency.planningAccuracy}%`}
              change={+5.8}
              color="bg-purple-500"
            />
          </div>

          {/* Performance Overview */}
          <Card className="card-premium">
            <CardHeader className="card-header-padding">
              <CardTitle className="text-sm sm:text-lg">Performance Overview</CardTitle>
            </CardHeader>
            <CardContent className="card-content-padding">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="subsection-spacing">
                  <h4 className="font-semibold text-xs sm:text-sm mb-2 sm:mb-3">Efficiency Metrics</h4>
                  <ProgressMetric
                    label="Budget Utilization"
                    value={mockReportData.efficiency.budgetUtilization}
                    target={100}
                    color="bg-blue-500"
                  />
                  <ProgressMetric
                    label="Planning Accuracy"
                    value={mockReportData.efficiency.planningAccuracy}
                    target={90}
                    color="bg-green-500"
                  />
                  <ProgressMetric
                    label="Waste Reduction"
                    value={100 - mockReportData.efficiency.wastePercentage}
                    target={95}
                    color="bg-purple-500"
                  />
                </div>

                <div className="subsection-spacing">
                  <h4 className="font-semibold text-xs sm:text-sm mb-2 sm:mb-3">Monthly Trends</h4>
                  <div className="space-y-2">
                    {mockReportData.expenses.monthlyTrend.map((month, index) => (
                      <div key={month.month} className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm">{month.month}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 sm:w-20 bg-muted rounded-full h-1.5 sm:h-2">
                            <div 
                              className="bg-blue-500 h-full rounded-full transition-all"
                              style={{ width: `${(month.amount / 10000) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs sm:text-sm font-medium">₹{month.amount.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Inventory Report */}
      {selectedReport === 'inventory' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="subsection-spacing"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card className="card-premium">
              <CardHeader className="card-header-padding">
                <CardTitle className="text-sm sm:text-lg">Inventory Summary</CardTitle>
              </CardHeader>
              <CardContent className="card-content-padding">
                <div className="subsection-spacing">
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm">Total Items</span>
                    <span className="font-bold">{mockReportData.inventory.totalItems}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm">Total Value</span>
                    <span className="font-bold">₹{mockReportData.inventory.totalValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-red-600">Low Stock Items</span>
                    <Badge variant="destructive" className="text-[8px] sm:text-[9px]">
                      {mockReportData.inventory.lowStockItems}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-orange-600">Expiring Soon</span>
                    <Badge className="bg-orange-500 text-white text-[8px] sm:text-[9px]">
                      {mockReportData.inventory.expiringItems}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-premium">
              <CardHeader className="card-header-padding">
                <CardTitle className="text-sm sm:text-lg">Category Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="card-content-padding">
                <div className="subsection-spacing">
                  {mockReportData.inventory.categories.map((category, index) => (
                    <div key={category.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full bg-blue-${(index + 1) * 100}`} />
                        <span className="text-xs sm:text-sm">{category.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs sm:text-sm font-medium">{category.count} items</p>
                        <p className="text-[9px] sm:text-xs text-muted-foreground">₹{category.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}

      {/* Expense Analysis */}
      {selectedReport === 'expenses' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="subsection-spacing"
        >
          <Card className="card-premium">
            <CardHeader className="card-header-padding">
              <CardTitle className="text-sm sm:text-lg">Expense Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="card-content-padding">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="subsection-spacing">
                  <h4 className="font-semibold text-xs sm:text-sm mb-2 sm:mb-3">Spending Categories</h4>
                  {mockReportData.expenses.topCategories.map((category, index) => (
                    <div key={category.name} className="subsection-spacing">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs sm:text-sm">{category.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-medium">₹{category.amount.toLocaleString()}</span>
                          <Badge variant="secondary" className="text-[8px] sm:text-[9px]">
                            {category.percentage}%
                          </Badge>
                        </div>
                      </div>
                      <Progress value={category.percentage} className="h-1.5 sm:h-2" />
                    </div>
                  ))}
                </div>

                <div className="subsection-spacing">
                  <h4 className="font-semibold text-xs sm:text-sm mb-2 sm:mb-3">Key Metrics</h4>
                  <div className="subsection-spacing">
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm">Total Spent</span>
                      <span className="font-bold">₹{mockReportData.expenses.totalSpent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm">Daily Average</span>
                      <span className="font-bold">₹{mockReportData.expenses.avgDaily}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm">Budget Utilization</span>
                      <Badge className="bg-green-500 text-white text-[8px] sm:text-[9px]">
                        {mockReportData.efficiency.budgetUtilization}%
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Waste Report */}
      {selectedReport === 'waste' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="subsection-spacing"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card className="card-premium">
              <CardHeader className="card-header-padding">
                <CardTitle className="text-sm sm:text-lg">Waste Summary</CardTitle>
              </CardHeader>
              <CardContent className="card-content-padding">
                <div className="subsection-spacing">
                  <div className="text-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                    <Trash2 className="w-8 h-8 sm:w-10 sm:h-10 text-red-500 mx-auto mb-2" />
                    <p className="text-lg sm:text-2xl font-bold text-red-600">{mockReportData.waste.totalWaste}kg</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Total Food Waste</p>
                  </div>
                  
                  <div className="subsection-spacing">
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm">Waste Value</span>
                      <span className="font-bold text-red-600">₹{mockReportData.waste.wasteValue}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm">Preventable Waste</span>
                      <span className="font-bold text-orange-600">{mockReportData.waste.preventableWaste}kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm">Waste Reduction</span>
                      <Badge className="bg-green-500 text-white text-[8px] sm:text-[9px]">
                        {Math.abs(mockReportData.waste.wasteReduction)}% ↓
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-premium">
              <CardHeader className="card-header-padding">
                <CardTitle className="text-sm sm:text-lg">Waste Impact</CardTitle>
              </CardHeader>
              <CardContent className="card-content-padding">
                <div className="subsection-spacing">
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <h4 className="font-semibold text-xs sm:text-sm text-green-700 dark:text-green-400 mb-2">
                      Environmental Impact Saved
                    </h4>
                    <div className="subsection-spacing text-xs sm:text-sm">
                      <div className="flex justify-between">
                        <span>CO₂ Reduction</span>
                        <span className="font-medium">2.1kg CO₂</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Water Saved</span>
                        <span className="font-medium">45L</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Money Saved</span>
                        <span className="font-medium">₹{mockReportData.waste.wasteValue}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}

      {/* Efficiency Metrics */}
      {selectedReport === 'efficiency' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="subsection-spacing"
        >
          <Card className="card-premium">
            <CardHeader className="card-header-padding">
              <CardTitle className="text-sm sm:text-lg">Kitchen Efficiency Metrics</CardTitle>
            </CardHeader>
            <CardContent className="card-content-padding">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="subsection-spacing">
                  <h4 className="font-semibold text-xs sm:text-sm mb-3">Performance Indicators</h4>
                  <ProgressMetric
                    label="Inventory Turnover"
                    value={mockReportData.efficiency.inventoryTurnover * 20}
                    target={100}
                    color="bg-blue-500"
                    suffix="x per month"
                  />
                  <ProgressMetric
                    label="Waste Percentage"
                    value={100 - mockReportData.efficiency.wastePercentage}
                    target={95}
                    color="bg-green-500"
                    suffix="% efficiency"
                  />
                  <ProgressMetric
                    label="Budget Utilization"
                    value={mockReportData.efficiency.budgetUtilization}
                    target={100}
                    color="bg-purple-500"
                    suffix="% of budget"
                  />
                  <ProgressMetric
                    label="Planning Accuracy"
                    value={mockReportData.efficiency.planningAccuracy}
                    target={90}
                    color="bg-orange-500"
                    suffix="% accurate"
                  />
                </div>

                <div className="subsection-spacing">
                  <h4 className="font-semibold text-xs sm:text-sm mb-3">Achievements</h4>
                  <div className="subsection-spacing">
                    <AchievementItem
                      icon="🎯"
                      title="Budget Master"
                      description="Stayed within budget for 3 months"
                      achieved={true}
                    />
                    <AchievementItem
                      icon="♻️"
                      title="Waste Warrior"
                      description="Reduced waste by 15% this month"
                      achieved={true}
                    />
                    <AchievementItem
                      icon="📊"
                      title="Planning Pro"
                      description="78% planning accuracy"
                      achieved={true}
                    />
                    <AchievementItem
                      icon="💰"
                      title="Money Saver"
                      description="Saved ₹500 through smart shopping"
                      achieved={false}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Export Options */}
      <Card className="card-premium">
        <CardHeader className="card-header-padding">
          <CardTitle className="text-sm sm:text-lg">Export Report</CardTitle>
        </CardHeader>
        <CardContent className="card-content-padding">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              variant="outline"
              onClick={() => downloadReport('pdf')}
              className="flex-1 mobile-btn"
            >
              <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              Download PDF
            </Button>
            <Button
              variant="outline"
              onClick={() => downloadReport('excel')}
              className="flex-1 mobile-btn"
            >
              <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              Export Excel
            </Button>
            <Button
              variant="outline"
              onClick={() => downloadReport('csv')}
              className="flex-1 mobile-btn"
            >
              <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function MetricCard({ 
  icon, 
  title, 
  value, 
  change, 
  color 
}: {
  icon: React.ReactNode
  title: string
  value: string
  change: number
  color: string
}) {
  return (
    <Card className="card-premium hover:shadow-md transition-all">
      <CardContent className="card-content-padding text-center">
        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${color} flex items-center justify-center mx-auto mb-2 text-white`}>
          {icon}
        </div>
        <p className="text-[9px] sm:text-xs text-muted-foreground mb-1">{title}</p>
        <p className="text-sm sm:text-lg font-bold mb-1">{value}</p>
        <div className="flex items-center justify-center gap-1">
          {change > 0 ? (
            <TrendingUp className="w-3 h-3 text-green-500" />
          ) : (
            <TrendingDown className="w-3 h-3 text-red-500" />
          )}
          <span className={`text-[8px] sm:text-[10px] ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {Math.abs(change)}%
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

function ProgressMetric({ 
  label, 
  value, 
  target, 
  color, 
  suffix = '' 
}: {
  label: string
  value: number
  target: number
  color: string
  suffix?: string
}) {
  const percentage = Math.min((value / target) * 100, 100)
  
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs sm:text-sm">{label}</span>
        <span className="text-xs sm:text-sm font-medium">{value.toFixed(1)}{suffix}</span>
      </div>
      <Progress value={percentage} className="h-1.5 sm:h-2" />
      <p className="text-[8px] sm:text-[10px] text-muted-foreground mt-1">
        Target: {target}{suffix}
      </p>
    </div>
  )
}

function AchievementItem({ 
  icon, 
  title, 
  description, 
  achieved 
}: {
  icon: string
  title: string
  description: string
  achieved: boolean
}) {
  return (
    <div className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg ${
      achieved ? 'bg-green-50 dark:bg-green-950/20' : 'bg-muted/50'
    }`}>
      <span className="text-lg sm:text-xl">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-medium">{title}</p>
        <p className="text-[9px] sm:text-xs text-muted-foreground">{description}</p>
      </div>
      {achieved && (
        <Badge className="bg-green-500 text-white text-[7px] sm:text-[8px]">
          ✓
        </Badge>
      )}
    </div>
  )
}