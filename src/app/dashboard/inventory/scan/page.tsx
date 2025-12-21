"use client"

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Camera, Upload, X, Zap, Sparkles, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { useHapticFeedback } from '@/lib/haptics'

export default function ScanPage() {
  const router = useRouter()
  const haptic = useHapticFeedback()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scannedImage, setScannedImage] = useState<string | null>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      haptic.light()
      const reader = new FileReader()
      reader.onload = (e) => {
        setScannedImage(e.target?.result as string)
        simulateScan()
      }
      reader.readAsDataURL(file)
    }
  }

  const simulateScan = () => {
    setIsScanning(true)
    haptic.medium()
    
    // Simulate AI processing
    setTimeout(() => {
      setIsScanning(false)
      haptic.success()
      // Navigate to add item with scanned data
      router.push('/dashboard/inventory/add?scanned=true')
    }, 3000)
  }

  const handleCameraCapture = () => {
    haptic.light()
    fileInputRef.current?.click()
  }

  const handleUpload = () => {
    haptic.light()
    fileInputRef.current?.click()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            haptic.light()
            router.back()
          }}
          className="shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Scan Item</h1>
          <p className="text-muted-foreground">Add items to inventory using AI</p>
        </div>
      </div>

      {/* Scan Interface */}
      <div className="mobile-container sm:max-w-2xl sm:mx-auto">
        {!scannedImage ? (
          <Card className="card-premium">
            <CardHeader className="text-center">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4">
                <Camera className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-xl">Scan Your Items</CardTitle>
              <p className="text-muted-foreground">
                Take a photo or upload an image of your grocery items, receipts, or product labels
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  onClick={handleCameraCapture}
                  className="h-24 bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white flex-col gap-2"
                >
                  <Camera className="w-8 h-8" />
                  <span>Take Photo</span>
                </Button>
                
                <Button
                  onClick={handleUpload}
                  variant="outline"
                  className="h-24 flex-col gap-2 border-2 border-dashed hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                >
                  <Upload className="w-8 h-8" />
                  <span>Upload Image</span>
                </Button>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Supported formats: JPG, PNG, HEIC
                </p>
                
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span>AI Powered</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <span>Smart Recognition</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="card-premium">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Processing Image</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  haptic.light()
                  setScannedImage(null)
                  setIsScanning(false)
                }}
              >
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Image Preview */}
              <div className="relative rounded-xl overflow-hidden">
                <img
                  src={scannedImage}
                  alt="Scanned item"
                  className="w-full h-64 object-cover"
                />
                {isScanning && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
                      <p className="font-medium">Analyzing image...</p>
                      <p className="text-sm opacity-80">AI is identifying items</p>
                    </div>
                  </div>
                )}
              </div>
              
              {isScanning && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-blue-900 dark:text-blue-100">AI Processing</p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">Extracting item information...</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl">
                      <div className="w-8 h-8 bg-emerald-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                        <span className="text-white text-sm font-bold">1</span>
                      </div>
                      <p className="text-xs font-medium">Detecting Items</p>
                    </div>
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-xl">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                        <span className="text-white text-sm font-bold">2</span>
                      </div>
                      <p className="text-xs font-medium">Reading Labels</p>
                    </div>
                    <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-xl">
                      <div className="w-8 h-8 bg-purple-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                        <span className="text-white text-sm font-bold">3</span>
                      </div>
                      <p className="text-xs font-medium">Organizing Data</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />
    </motion.div>
  )
}