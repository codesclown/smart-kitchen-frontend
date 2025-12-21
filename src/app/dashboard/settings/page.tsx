"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Database, 
  Download, 
  Upload, 
  Trash2, 
  LogOut, 
  Camera, 
  Edit3, 
  Moon,
  Sun,
  Monitor,
  Crown,
  Settings as SettingsIcon,
  Check,
  X,
  Key,
  HelpCircle,
  MessageSquare,
  Star,
  AlertCircle
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useTheme } from 'next-themes'
import { useHapticFeedback } from '@/lib/haptics'
import { clearAuthState } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { SettingsSkeleton } from '@/components/skeleton-loaders'
import { useSettings } from '@/hooks/use-settings'
import { useAvatarUpload } from '@/hooks/use-avatar-upload'

export default function SettingsPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const haptic = useHapticFeedback()
  
  // Use the settings hook for API integration
  const {
    user,
    notifications,
    privacy,
    appSettings,
    security,
    support,
    loading,
    saving,
    error,
    updateProfile,
    autoSave,
    saveSettings,
    setUser,
    setNotifications,
    setPrivacy,
    setAppSettings,
    setSecurity,
    setSupport,
    setError,
  } = useSettings()
  
  const [editingProfile, setEditingProfile] = useState(false)
  
  // Avatar upload hook
  const { selectAndUploadAvatar, uploading: avatarUploading, progress: avatarProgress } = useAvatarUpload()
  
  // Track changes for input fields that need submit buttons
  const [tempLowStockThreshold, setTempLowStockThreshold] = useState(appSettings.lowStockThreshold)
  const [tempExpiryWarningDays, setTempExpiryWarningDays] = useState(appSettings.expiryWarningDays)
  const [hasUnsavedThresholds, setHasUnsavedThresholds] = useState(false)
  
  const [tempSessionTimeout, setTempSessionTimeout] = useState(security.sessionTimeout)
  const [hasUnsavedSecurity, setHasUnsavedSecurity] = useState(false)

  const saveSecuritySettings = async () => {
    haptic.light()
    
    try {
      const newSecurity = { 
        ...security, 
        sessionTimeout: tempSessionTimeout
      }
      
      const result = await saveSettings({ security: newSecurity })
      
      if (result.success) {
        setSecurity(newSecurity)
        setHasUnsavedSecurity(false)
        haptic.success()
      } else {
        haptic.error()
        setError(result.error || 'Failed to save security settings')
      }
    } catch (err) {
      console.error('Failed to save security settings:', err)
      haptic.error()
      setError('Failed to save security settings')
    }
  }

  const saveThresholdSettings = async () => {
    haptic.light()
    
    try {
      const newAppSettings = { 
        ...appSettings, 
        lowStockThreshold: tempLowStockThreshold,
        expiryWarningDays: tempExpiryWarningDays
      }
      
      const result = await saveSettings({ appSettings: newAppSettings })
      
      if (result.success) {
        setAppSettings(newAppSettings)
        setHasUnsavedThresholds(false)
        haptic.success()
      } else {
        haptic.error()
        setError(result.error || 'Failed to save threshold settings')
      }
    } catch (err) {
      console.error('Failed to save threshold settings:', err)
      haptic.error()
      setError('Failed to save threshold settings')
    }
  }

  const handleLogout = () => {
    haptic.impact()
    clearAuthState()
    router.push('/login')
  }

  const handleDeleteAccount = () => {
    haptic.error()
    // Show confirmation dialog
    const confirmed = confirm(
      'Are you sure you want to delete your account?\n\n' +
      'This will permanently delete:\n' +
      '• All your inventory data\n' +
      '• Shopping lists and expenses\n' +
      '• Account settings and preferences\n\n' +
      'This action cannot be undone.'
    )
    
    if (confirmed) {
      const doubleConfirm = confirm(
        'This is your final warning!\n\n' +
        'Type "DELETE" in the next prompt to confirm account deletion.'
      )
      
      if (doubleConfirm) {
        const deleteConfirmation = prompt('Type "DELETE" to confirm:')
        if (deleteConfirmation === 'DELETE') {
          // Clear all local data
          localStorage.clear()
          clearAuthState()
          alert('Account deleted successfully. You will be redirected to the login page.')
          router.push('/login')
        } else {
          alert('Account deletion cancelled - confirmation text did not match.')
        }
      }
    }
  }

  if (loading) {
    return <SettingsSkeleton />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 sm:space-y-6"
    >
      {/* Premium Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900/50 dark:via-slate-800/30 dark:to-slate-900/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/40 backdrop-blur-xl shadow-xl shadow-slate-900/5 dark:shadow-slate-900/20">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5" />
        <div className="relative p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl shadow-lg shadow-emerald-500/25">
              <SettingsIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent leading-tight">
                Settings
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
                Manage your account and app preferences
              </p>
            </div>
          </div>
          
          {saving && (
            <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/30 rounded-xl">
              <div className="w-4 h-4 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                Saving changes...
              </span>
            </div>
          )}
          
          {error && (
            <Alert className="border-red-200 dark:border-red-800/30 bg-red-50 dark:bg-red-950/20">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <AlertDescription className="text-red-700 dark:text-red-300 text-sm font-medium">
                {error}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Premium Profile Section */}
        <div className="lg:col-span-1">
          <Card className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50/50 to-white dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-900 border-slate-200/60 dark:border-slate-700/40 shadow-xl shadow-slate-900/5 dark:shadow-slate-900/20 backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/3 via-transparent to-blue-500/3" />
            <CardContent className="relative p-6 sm:p-8">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="p-1 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full shadow-lg shadow-emerald-500/25">
                    <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-white dark:border-slate-800">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="text-xl sm:text-2xl bg-gradient-to-br from-emerald-500 to-blue-600 text-white font-bold">
                        {user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white dark:bg-slate-800 shadow-lg border-2 border-white dark:border-slate-700 hover:scale-110 transition-transform"
                    onClick={async () => {
                      haptic.light()
                      const result = await selectAndUploadAvatar()
                      if (result.success && result.url && user) {
                        // Update user avatar in local state
                        setUser({ ...user, avatar: result.url })
                        // Update profile with new avatar URL
                        await updateProfile({ ...user, avatar: result.url })
                        haptic.success()
                      } else if (result.error) {
                        setError(result.error)
                        haptic.error()
                      }
                    }}
                    disabled={avatarUploading}
                  >
                    {avatarUploading ? (
                      <div className="w-4 h-4 border-2 border-slate-400/30 border-t-slate-600 rounded-full animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                  </Button>
                  
                  {avatarUploading && avatarProgress > 0 && (
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-1 overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 transition-all duration-300 ease-out"
                        style={{ width: `${avatarProgress}%` }}
                      />
                    </div>
                  )}
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{user?.name}</h3>
                    {user?.isPremium && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 text-xs font-semibold px-2 py-1 shadow-lg shadow-yellow-500/25">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{user?.email}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 font-medium">
                    Member since {new Date(user?.joinedAt || '').toLocaleDateString()}
                  </p>
                </div>

                {!user?.isPremium && (
                  <Button 
                    className="w-full h-11 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 hover:from-yellow-500 hover:via-orange-600 hover:to-yellow-500 text-white text-sm font-semibold shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-all duration-300 hover:scale-[1.02]"
                    onClick={() => {
                      haptic.medium()
                      // Show premium features info
                      alert(
                        '🌟 Premium Features:\n\n' +
                        '• Unlimited inventory items\n' +
                        '• Advanced analytics & insights\n' +
                        '• AI-powered recipe suggestions\n' +
                        '• Priority customer support\n' +
                        '• Export to multiple formats\n' +
                        '• Custom themes & layouts\n\n' +
                        'Coming soon! Stay tuned for the premium launch.'
                      )
                    }}
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Premium
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Sections */}
        <div className="lg:col-span-2 space-y-6">
          {/* Premium Profile Settings */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50/30 to-white dark:from-slate-900 dark:via-slate-800/30 dark:to-slate-900 border-slate-200/60 dark:border-slate-700/40 shadow-xl shadow-slate-900/5 dark:shadow-slate-900/20 backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/2 via-transparent to-purple-500/2" />
            <CardHeader className="relative pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg shadow-blue-500/25 shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base font-bold text-slate-900 dark:text-white truncate">
                      Profile Information
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
                      Update your personal information
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0 self-start sm:self-center">
                  {editingProfile && (
                    <Button
                      variant="default"
                      size="sm"
                      className="h-8 px-2 sm:px-3 text-xs bg-emerald-500 hover:bg-emerald-600 text-white"
                      onClick={async () => {
                        if (user) {
                          const result = await updateProfile(user)
                          if (result.success) {
                            setEditingProfile(false)
                            haptic.success()
                          } else {
                            haptic.error()
                          }
                        }
                      }}
                    >
                      <Check className="w-3 h-3 sm:mr-1" />
                      <span className="hidden sm:inline">Save</span>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    onClick={() => {
                      if (editingProfile) {
                        // Cancel editing - reset to original user data
                        // The useSettings hook will handle reloading from API
                        setError(null)
                      }
                      setEditingProfile(!editingProfile)
                      haptic.light()
                    }}
                  >
                    {editingProfile ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative space-y-4 px-6 pb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Name</Label>
                  <Input
                    id="name"
                    value={user?.name || ''}
                    disabled={!editingProfile}
                    onChange={(e) => {
                      if (editingProfile && user) {
                        setUser({ ...user, name: e.target.value })
                      }
                    }}
                    className={`h-10 text-sm ${editingProfile ? 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'}`}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email</Label>
                  <Input
                    id="email"
                    value={user?.email || ''}
                    disabled={!editingProfile}
                    onChange={(e) => {
                      if (editingProfile && user) {
                        setUser({ ...user, email: e.target.value })
                      }
                    }}
                    className={`h-10 text-sm ${editingProfile ? 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'}`}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Phone</Label>
                  <Input
                    id="phone"
                    value={user?.phone || ''}
                    disabled={!editingProfile}
                    onChange={(e) => {
                      if (editingProfile && user) {
                        setUser({ ...user, phone: e.target.value })
                      }
                    }}
                    className={`h-10 text-sm ${editingProfile ? 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'}`}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Location</Label>
                  <Input
                    id="location"
                    value={user?.location || ''}
                    disabled={!editingProfile}
                    onChange={(e) => {
                      if (editingProfile && user) {
                        setUser({ ...user, location: e.target.value })
                      }
                    }}
                    className={`h-10 text-sm ${editingProfile ? 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'}`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Premium Appearance Settings */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50/30 to-white dark:from-slate-900 dark:via-slate-800/30 dark:to-slate-900 border-slate-200/60 dark:border-slate-700/40 shadow-xl shadow-slate-900/5 dark:shadow-slate-900/20 backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/2 via-transparent to-pink-500/2" />
            <CardHeader className="relative pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg shadow-lg shadow-purple-500/25">
                  <Palette className="w-4 h-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                    Appearance
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
                    Customize how the app looks and feels
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative space-y-6 px-6 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-semibold text-slate-900 dark:text-white">Theme</Label>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">Choose your preferred theme</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    size="sm"
                    className="h-9 w-9 rounded-lg shadow-sm hover:shadow-md transition-all"
                    onClick={() => {
                      setTheme('light')
                      haptic.selection()
                    }}
                  >
                    <Sun className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    className="h-9 w-9 rounded-lg shadow-sm hover:shadow-md transition-all"
                    onClick={() => {
                      setTheme('dark')
                      haptic.selection()
                    }}
                  >
                    <Moon className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={theme === 'system' ? 'default' : 'outline'}
                    size="sm"
                    className="h-9 w-9 rounded-lg shadow-sm hover:shadow-md transition-all"
                    onClick={() => {
                      setTheme('system')
                      haptic.selection()
                    }}
                  >
                    <Monitor className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <Separator className="bg-slate-200 dark:bg-slate-700" />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-semibold text-slate-900 dark:text-white">Animations</Label>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">Enable smooth animations</p>
                </div>
                <Switch
                  checked={appSettings.animations}
                  onCheckedChange={(checked) => {
                    const newAppSettings = { ...appSettings, animations: checked }
                    setAppSettings(newAppSettings)
                    autoSave({ appSettings: newAppSettings })
                    haptic.light()
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Premium Notification Settings */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50/30 to-white dark:from-slate-900 dark:via-slate-800/30 dark:to-slate-900 border-slate-200/60 dark:border-slate-700/40 shadow-xl shadow-slate-900/5 dark:shadow-slate-900/20 backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/2 via-transparent to-orange-500/2" />
            <CardHeader className="relative pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg shadow-lg shadow-amber-500/25">
                  <Bell className="w-4 h-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                    Notifications
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
                    Control when and how you receive notifications
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative space-y-5 px-6 pb-6">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-semibold text-slate-900 dark:text-white">Low Stock Alerts</Label>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">Get notified when items are running low</p>
                  </div>
                  <Switch
                    checked={notifications.lowStock}
                    onCheckedChange={(checked) => {
                      const newNotifications = { ...notifications, lowStock: checked }
                      setNotifications(newNotifications)
                      autoSave({ notifications: newNotifications })
                      haptic.light()
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-semibold text-slate-900 dark:text-white">Expiring Items</Label>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">Alerts for items nearing expiry</p>
                  </div>
                  <Switch
                    checked={notifications.expiring}
                    onCheckedChange={(checked) => {
                      const newNotifications = { ...notifications, expiring: checked }
                      setNotifications(newNotifications)
                      autoSave({ notifications: newNotifications })
                      haptic.light()
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-semibold text-slate-900 dark:text-white">Shopping Reminders</Label>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">Reminders for shopping lists</p>
                  </div>
                  <Switch
                    checked={notifications.shopping}
                    onCheckedChange={(checked) => {
                      const newNotifications = { ...notifications, shopping: checked }
                      setNotifications(newNotifications)
                      autoSave({ notifications: newNotifications })
                      haptic.light()
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-semibold text-slate-900 dark:text-white">Email Notifications</Label>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => {
                      const newNotifications = { ...notifications, email: checked }
                      setNotifications(newNotifications)
                      autoSave({ notifications: newNotifications })
                      haptic.light()
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-semibold text-slate-900 dark:text-white">Push Notifications</Label>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">Browser push notifications</p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) => {
                      const newNotifications = { ...notifications, push: checked }
                      setNotifications(newNotifications)
                      autoSave({ notifications: newNotifications })
                      haptic.light()
                    }}
                  />
                </div>
                
                <Separator className="bg-slate-200 dark:bg-slate-700" />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-semibold text-slate-900 dark:text-white">Sound</Label>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">Play notification sounds</p>
                  </div>
                  <Switch
                    checked={notifications.sound}
                    onCheckedChange={(checked) => {
                      const newNotifications = { ...notifications, sound: checked }
                      setNotifications(newNotifications)
                      autoSave({ notifications: newNotifications })
                      haptic.light()
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-semibold text-slate-900 dark:text-white">Vibration</Label>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">Haptic feedback for notifications</p>
                  </div>
                  <Switch
                    checked={notifications.vibration}
                    onCheckedChange={(checked) => {
                      const newNotifications = { ...notifications, vibration: checked }
                      setNotifications(newNotifications)
                      autoSave({ notifications: newNotifications })
                      haptic.light()
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Premium App Settings */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50/30 to-white dark:from-slate-900 dark:via-slate-800/30 dark:to-slate-900 border-slate-200/60 dark:border-slate-700/40 shadow-xl shadow-slate-900/5 dark:shadow-slate-900/20 backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/2 via-transparent to-teal-500/2" />
            <CardHeader className="relative pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg shadow-lg shadow-emerald-500/25">
                  <SettingsIcon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                    App Settings
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
                    Configure app behavior and preferences
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative space-y-5 px-6 pb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Language</Label>
                  <Select value={appSettings.language} onValueChange={(value) => {
                    const newAppSettings = { ...appSettings, language: value }
                    setAppSettings(newAppSettings)
                    autoSave({ appSettings: newAppSettings })
                    haptic.selection()
                  }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">हिंदी</SelectItem>
                      <SelectItem value="mr">मराठी</SelectItem>
                      <SelectItem value="gu">ગુજરાતી</SelectItem>
                      <SelectItem value="ta">தமிழ்</SelectItem>
                      <SelectItem value="te">తెలుగు</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Currency</Label>
                  <Select value={appSettings.currency} onValueChange={(value) => {
                    const newAppSettings = { ...appSettings, currency: value }
                    setAppSettings(newAppSettings)
                    autoSave({ appSettings: newAppSettings })
                    haptic.selection()
                  }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">₹ Indian Rupee</SelectItem>
                      <SelectItem value="USD">$ US Dollar</SelectItem>
                      <SelectItem value="EUR">€ Euro</SelectItem>
                      <SelectItem value="GBP">£ British Pound</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Date Format</Label>
                  <Select value={appSettings.dateFormat} onValueChange={(value) => {
                    const newAppSettings = { ...appSettings, dateFormat: value }
                    setAppSettings(newAppSettings)
                    autoSave({ appSettings: newAppSettings })
                    haptic.selection()
                  }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      <SelectItem value="DD-MM-YYYY">DD-MM-YYYY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Time Format</Label>
                  <Select value={appSettings.timeFormat} onValueChange={(value) => {
                    const newAppSettings = { ...appSettings, timeFormat: value }
                    setAppSettings(newAppSettings)
                    autoSave({ appSettings: newAppSettings })
                    haptic.selection()
                  }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">24 Hour (14:30)</SelectItem>
                      <SelectItem value="12h">12 Hour (2:30 PM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator className="bg-slate-200 dark:bg-slate-700" />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-semibold text-slate-900 dark:text-white">Auto Backup</Label>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">Automatically backup your data</p>
                </div>
                <Switch
                  checked={appSettings.autoBackup}
                  onCheckedChange={(checked) => {
                    const newAppSettings = { ...appSettings, autoBackup: checked }
                    setAppSettings(newAppSettings)
                    autoSave({ appSettings: newAppSettings })
                    haptic.light()
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-semibold text-slate-900 dark:text-white">Haptic Feedback</Label>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">Vibration feedback for interactions</p>
                </div>
                <Switch
                  checked={appSettings.hapticFeedback}
                  onCheckedChange={(checked) => {
                    const newAppSettings = { ...appSettings, hapticFeedback: checked }
                    setAppSettings(newAppSettings)
                    autoSave({ appSettings: newAppSettings })
                    haptic.light()
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-semibold text-slate-900 dark:text-white">Offline Mode</Label>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">Enable offline functionality</p>
                </div>
                <Switch
                  checked={appSettings.offlineMode}
                  onCheckedChange={(checked) => {
                    const newAppSettings = { ...appSettings, offlineMode: checked }
                    setAppSettings(newAppSettings)
                    autoSave({ appSettings: newAppSettings })
                    haptic.light()
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-semibold text-slate-900 dark:text-white">Auto Sync</Label>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">Automatically sync data across devices</p>
                </div>
                <Switch
                  checked={appSettings.autoSync}
                  onCheckedChange={(checked) => {
                    const newAppSettings = { ...appSettings, autoSync: checked }
                    setAppSettings(newAppSettings)
                    autoSave({ appSettings: newAppSettings })
                    haptic.light()
                  }}
                />
              </div>
              
              <Separator className="bg-slate-200 dark:bg-slate-700" />
              
              <div className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-semibold text-slate-900 dark:text-white">Inventory Thresholds</Label>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">Configure alert thresholds for your inventory</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Low Stock Threshold</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="1"
                          max="50"
                          value={tempLowStockThreshold}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 1
                            setTempLowStockThreshold(value)
                            setHasUnsavedThresholds(
                              value !== appSettings.lowStockThreshold || 
                              tempExpiryWarningDays !== appSettings.expiryWarningDays
                            )
                          }}
                          className="w-20 h-9 text-sm"
                          placeholder="5"
                        />
                        <span className="text-xs text-slate-600 dark:text-slate-400">items</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Expiry Warning</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="1"
                          max="30"
                          value={tempExpiryWarningDays}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 1
                            setTempExpiryWarningDays(value)
                            setHasUnsavedThresholds(
                              tempLowStockThreshold !== appSettings.lowStockThreshold || 
                              value !== appSettings.expiryWarningDays
                            )
                          }}
                          className="w-20 h-9 text-sm"
                          placeholder="3"
                        />
                        <span className="text-xs text-slate-600 dark:text-slate-400">days</span>
                      </div>
                    </div>
                  </div>
                  
                  {hasUnsavedThresholds && (
                    <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                        <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                          You have unsaved changes
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-3 text-xs border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/30"
                          onClick={() => {
                            setTempLowStockThreshold(appSettings.lowStockThreshold)
                            setTempExpiryWarningDays(appSettings.expiryWarningDays)
                            setHasUnsavedThresholds(false)
                            haptic.light()
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          className="h-8 px-3 text-xs bg-emerald-500 hover:bg-emerald-600 text-white"
                          onClick={saveThresholdSettings}
                          disabled={saving}
                        >
                          {saving ? (
                            <>
                              <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin mr-1" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Check className="w-3 h-3 mr-1" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Premium Privacy & Security */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50/30 to-white dark:from-slate-900 dark:via-slate-800/30 dark:to-slate-900 border-slate-200/60 dark:border-slate-700/40 shadow-xl shadow-slate-900/5 dark:shadow-slate-900/20 backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/2 via-transparent to-pink-500/2" />
            <CardHeader className="relative pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg shadow-lg shadow-red-500/25">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                    Privacy & Security
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
                    Control your data and privacy settings
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative space-y-5 px-6 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-semibold text-slate-900 dark:text-white">Data Collection</Label>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">Allow app to collect usage data</p>
                </div>
                <Switch
                  checked={privacy.dataCollection}
                  onCheckedChange={(checked) => {
                    const newPrivacy = { ...privacy, dataCollection: checked }
                    setPrivacy(newPrivacy)
                    autoSave({ privacy: newPrivacy })
                    haptic.light()
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-semibold text-slate-900 dark:text-white">Analytics</Label>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">Help improve the app with analytics</p>
                </div>
                <Switch
                  checked={privacy.analytics}
                  onCheckedChange={(checked) => {
                    const newPrivacy = { ...privacy, analytics: checked }
                    setPrivacy(newPrivacy)
                    autoSave({ privacy: newPrivacy })
                    haptic.light()
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-semibold text-slate-900 dark:text-white">Marketing Communications</Label>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">Receive promotional emails</p>
                </div>
                <Switch
                  checked={privacy.marketing}
                  onCheckedChange={(checked) => {
                    const newPrivacy = { ...privacy, marketing: checked }
                    setPrivacy(newPrivacy)
                    autoSave({ privacy: newPrivacy })
                    haptic.light()
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Premium Security & Authentication */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50/30 to-white dark:from-slate-900 dark:via-slate-800/30 dark:to-slate-900 border-slate-200/60 dark:border-slate-700/40 shadow-xl shadow-slate-900/5 dark:shadow-slate-900/20 backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/2 via-transparent to-red-500/2" />
            <CardHeader className="relative pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg shadow-lg shadow-orange-500/25">
                  <Key className="w-4 h-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                    Security & Authentication
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
                    Manage your account security settings
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative space-y-5 px-6 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-semibold text-slate-900 dark:text-white">Two-Factor Authentication</Label>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">Add an extra layer of security</p>
                </div>
                <Switch
                  checked={security.twoFactorAuth}
                  onCheckedChange={(checked) => {
                    const newSecurity = { ...security, twoFactorAuth: checked }
                    setSecurity(newSecurity)
                    autoSave({ security: newSecurity })
                    haptic.light()
                    if (checked) {
                      alert('Two-factor authentication setup will be available in the next update!')
                    }
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-semibold text-slate-900 dark:text-white">Biometric Authentication</Label>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">Use fingerprint or face unlock</p>
                </div>
                <Switch
                  checked={security.biometricAuth}
                  onCheckedChange={(checked) => {
                    const newSecurity = { ...security, biometricAuth: checked }
                    setSecurity(newSecurity)
                    autoSave({ security: newSecurity })
                    haptic.light()
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-semibold text-slate-900 dark:text-white">Login Notifications</Label>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">Get notified of new logins</p>
                </div>
                <Switch
                  checked={security.loginNotifications}
                  onCheckedChange={(checked) => {
                    const newSecurity = { ...security, loginNotifications: checked }
                    setSecurity(newSecurity)
                    autoSave({ security: newSecurity })
                    haptic.light()
                  }}
                />
              </div>
              
              <Separator className="bg-slate-200 dark:bg-slate-700" />
              
              <div className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-semibold text-slate-900 dark:text-white">Session Timeout</Label>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">Auto-logout after inactivity</p>
                  </div>
                  <Select value={tempSessionTimeout} onValueChange={(value) => {
                    setTempSessionTimeout(value)
                    setHasUnsavedSecurity(value !== security.sessionTimeout)
                    haptic.selection()
                  }}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15m">15 minutes</SelectItem>
                      <SelectItem value="30m">30 minutes</SelectItem>
                      <SelectItem value="1h">1 hour</SelectItem>
                      <SelectItem value="4h">4 hours</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {hasUnsavedSecurity && (
                    <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                        <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                          Session timeout changed
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-3 text-xs border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/30"
                          onClick={() => {
                            setTempSessionTimeout(security.sessionTimeout)
                            setHasUnsavedSecurity(false)
                            haptic.light()
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          className="h-8 px-3 text-xs bg-emerald-500 hover:bg-emerald-600 text-white"
                          onClick={saveSecuritySettings}
                          disabled={saving}
                        >
                          {saving ? (
                            <>
                              <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin mr-1" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Check className="w-3 h-3 mr-1" />
                              Apply
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <div>
                    <Label className="text-sm font-semibold text-slate-900 dark:text-white">Password</Label>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
                      Last changed: {new Date(security.passwordLastChanged).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => {
                      haptic.light()
                      alert('Password change functionality will be available in the next update!')
                    }}
                  >
                    Change
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Premium Support & Help */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50/30 to-white dark:from-slate-900 dark:via-slate-800/30 dark:to-slate-900 border-slate-200/60 dark:border-slate-700/40 shadow-xl shadow-slate-900/5 dark:shadow-slate-900/20 backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/2 via-transparent to-emerald-500/2" />
            <CardHeader className="relative pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-lg shadow-green-500/25">
                  <HelpCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                    Support & Help
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
                    Get help and provide feedback
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative space-y-5 px-6 pb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="justify-start h-11 text-sm font-medium shadow-sm hover:shadow-md transition-all border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                  onClick={() => {
                    haptic.light()
                    alert('Help Center will open in the next update!')
                  }}
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Help Center
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start h-11 text-sm font-medium shadow-sm hover:shadow-md transition-all border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                  onClick={() => {
                    haptic.light()
                    alert('Feedback form will be available in the next update!')
                  }}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Feedback
                </Button>
              </div>
              
              <Separator className="bg-slate-200 dark:bg-slate-700" />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-semibold text-slate-900 dark:text-white">Crash Reports</Label>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">Help improve the app by sending crash reports</p>
                </div>
                <Switch
                  checked={support.crashReports}
                  onCheckedChange={(checked) => {
                    const newSupport = { ...support, crashReports: checked }
                    setSupport(newSupport)
                    autoSave({ support: newSupport })
                    haptic.light()
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-semibold text-slate-900 dark:text-white">Beta Features</Label>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">Get early access to new features</p>
                </div>
                <Switch
                  checked={support.betaFeatures}
                  onCheckedChange={(checked) => {
                    const newSupport = { ...support, betaFeatures: checked }
                    setSupport(newSupport)
                    autoSave({ support: newSupport })
                    haptic.light()
                    if (checked) {
                      alert('🎉 Welcome to the beta program! You\'ll get early access to new features.')
                    }
                  }}
                />
              </div>
              
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <Label className="text-sm font-semibold text-blue-900 dark:text-blue-100">Rate Our App</Label>
                </div>
                <p className="text-xs text-blue-700 dark:text-blue-300 mb-3">
                  Love using Smart Kitchen? Help others discover it by leaving a review!
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                  onClick={() => {
                    haptic.light()
                    alert('Thank you! App store rating will be available in the next update.')
                  }}
                >
                  <Star className="w-3 h-3 mr-1" />
                  Rate App
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Premium Data Management */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50/30 to-white dark:from-slate-900 dark:via-slate-800/30 dark:to-slate-900 border-slate-200/60 dark:border-slate-700/40 shadow-xl shadow-slate-900/5 dark:shadow-slate-900/20 backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/2 via-transparent to-cyan-500/2" />
            <CardHeader className="relative pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-cyan-600 rounded-lg shadow-lg shadow-indigo-500/25">
                  <Database className="w-4 h-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                    Data Management
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
                    Backup, export, or delete your data
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative space-y-5 px-6 pb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="justify-start h-11 text-sm font-medium shadow-sm hover:shadow-md transition-all border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600" 
                  onClick={() => {
                    haptic.light()
                    // Export all settings as JSON
                    const exportData = {
                      user: user,
                      notifications: notifications,
                      privacy: privacy,
                      appSettings: appSettings,
                      security: security,
                      support: support,
                      exportDate: new Date().toISOString(),
                      version: '1.0.0'
                    }
                    const dataStr = JSON.stringify(exportData, null, 2)
                    const dataBlob = new Blob([dataStr], { type: 'application/json' })
                    const url = URL.createObjectURL(dataBlob)
                    const link = document.createElement('a')
                    link.href = url
                    link.download = `smart-kitchen-settings-${new Date().toISOString().slice(0, 10)}.json`
                    link.click()
                    URL.revokeObjectURL(url)
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start h-11 text-sm font-medium shadow-sm hover:shadow-md transition-all border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600" 
                  onClick={() => {
                    haptic.light()
                    // Create file input for import
                    const input = document.createElement('input')
                    input.type = 'file'
                    input.accept = '.json'
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onload = (e) => {
                          try {
                            const importData = JSON.parse(e.target?.result as string)
                            if (importData.notifications) setNotifications(importData.notifications)
                            if (importData.privacy) setPrivacy(importData.privacy)
                            if (importData.appSettings) setAppSettings(importData.appSettings)
                            if (importData.security) setSecurity(importData.security)
                            if (importData.support) setSupport(importData.support)
                            if (importData.user) setUser(prev => ({ ...prev, ...importData.user }))
                            
                            // Save imported settings
                            autoSave({
                              notifications: importData.notifications,
                              privacy: importData.privacy,
                              appSettings: importData.appSettings,
                              security: importData.security,
                              support: importData.support
                            })
                            
                            alert('Settings imported successfully!')
                          } catch {
                            alert('Failed to import settings. Please check the file format.')
                          }
                        }
                        reader.readAsText(file)
                      }
                    }
                    input.click()
                  }}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import Data
                </Button>
              </div>
              
              <Separator className="bg-slate-200 dark:bg-slate-700" />
              
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-11 text-sm font-medium text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950/20 border-orange-200 dark:border-orange-800 hover:border-orange-300 dark:hover:border-orange-700 shadow-sm hover:shadow-md transition-all"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-11 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700 shadow-sm hover:shadow-md transition-all"
                  onClick={handleDeleteAccount}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}