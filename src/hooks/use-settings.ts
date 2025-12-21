import { useState, useEffect } from 'react';
import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { ME_QUERY } from '@/lib/graphql/queries';
import { 
  UPDATE_USER_PROFILE_MUTATION,
  UPDATE_USER_SETTINGS_MUTATION
} from '@/lib/graphql/mutations';
import { toast } from 'sonner';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  phone?: string;
  location?: string;
  emailVerified: boolean;
  settings?: any;
  isPremium?: boolean;
  joinedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NotificationSettings {
  lowStock: boolean;
  expiring: boolean;
  shopping: boolean;
  email: boolean;
  push: boolean;
  sound: boolean;
  vibration: boolean;
}

export interface PrivacySettings {
  dataCollection: boolean;
  analytics: boolean;
  marketing: boolean;
}

export interface AppSettings {
  language: string;
  currency: string;
  dateFormat: string;
  timeFormat: string;
  animations: boolean;
  autoBackup: boolean;
  hapticFeedback: boolean;
  offlineMode: boolean;
  autoSync: boolean;
  lowStockThreshold: number;
  expiryWarningDays: number;
}

export interface SecuritySettings {
  twoFactorAuth: boolean;
  biometricAuth: boolean;
  loginNotifications: boolean;
  sessionTimeout: string;
  passwordLastChanged: string;
}

export interface SupportSettings {
  crashReports: boolean;
  betaFeatures: boolean;
}

export interface SettingsData {
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  appSettings: AppSettings;
  security: SecuritySettings;
  support: SupportSettings;
}

const defaultNotifications: NotificationSettings = {
  lowStock: true,
  expiring: true,
  shopping: true,
  email: true,
  push: true,
  sound: true,
  vibration: true
};

const defaultPrivacy: PrivacySettings = {
  dataCollection: true,
  analytics: true,
  marketing: false
};

const defaultAppSettings: AppSettings = {
  language: 'en',
  currency: 'INR',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h',
  animations: true,
  autoBackup: true,
  hapticFeedback: true,
  offlineMode: false,
  autoSync: true,
  lowStockThreshold: 5,
  expiryWarningDays: 3
};

const defaultSecurity: SecuritySettings = {
  twoFactorAuth: false,
  biometricAuth: false,
  loginNotifications: true,
  sessionTimeout: '1h',
  passwordLastChanged: new Date().toISOString()
};

const defaultSupport: SupportSettings = {
  crashReports: true,
  betaFeatures: false
};

export function useSettings() {
  const apolloClient = useApolloClient();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Local state for settings
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<NotificationSettings>(defaultNotifications);
  const [privacy, setPrivacy] = useState<PrivacySettings>(defaultPrivacy);
  const [appSettings, setAppSettings] = useState<AppSettings>(defaultAppSettings);
  const [security, setSecurity] = useState<SecuritySettings>(defaultSecurity);
  const [support, setSupport] = useState<SupportSettings>(defaultSupport);

  // Query current user and settings
  const { 
    data: userData, 
    loading, 
    error: queryError,
    refetch: refetchUser
  } = useQuery(ME_QUERY, {
    errorPolicy: 'all',
    onCompleted: (data) => {
      if (data?.me) {
        setUser(data.me);
        
        // Parse settings from user.settings JSON field
        if (data.me.settings) {
          const userSettings = data.me.settings;
          
          if (userSettings.notifications) {
            setNotifications({ ...defaultNotifications, ...userSettings.notifications });
          }
          
          if (userSettings.privacy) {
            setPrivacy({ ...defaultPrivacy, ...userSettings.privacy });
          }
          
          if (userSettings.appSettings || userSettings.app) {
            setAppSettings({ ...defaultAppSettings, ...(userSettings.appSettings || userSettings.app) });
          }
          
          if (userSettings.security) {
            setSecurity({ ...defaultSecurity, ...userSettings.security });
          }
          
          if (userSettings.support) {
            setSupport({ ...defaultSupport, ...userSettings.support });
          }
        }
      }
    }
  });

  // Mutations
  const [updateProfileMutation] = useMutation(UPDATE_USER_PROFILE_MUTATION, {
    onCompleted: () => {
      toast.success('Profile updated successfully');
      refetchUser();
    },
    onError: (error) => {
      toast.error(`Failed to update profile: ${error.message}`);
      setError(error.message);
    }
  });

  const [updateSettingsMutation] = useMutation(UPDATE_USER_SETTINGS_MUTATION, {
    onCompleted: () => {
      refetchUser();
    },
    onError: (error) => {
      toast.error(`Failed to save settings: ${error.message}`);
      setError(error.message);
    }
  });

  // Auto-save function with debouncing
  const autoSave = async (partialSettings: Partial<SettingsData>) => {
    try {
      const currentSettings = user?.settings || {};
      const updatedSettings = {
        ...currentSettings,
        ...partialSettings
      };

      await updateSettingsMutation({
        variables: {
          input: updatedSettings
        }
      });
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  // Manual save function
  const saveSettings = async (partialSettings: Partial<SettingsData>) => {
    setSaving(true);
    setError(null);

    try {
      const currentSettings = user?.settings || {};
      const updatedSettings = {
        ...currentSettings,
        ...partialSettings
      };

      await updateSettingsMutation({
        variables: {
          input: updatedSettings
        }
      });

      setSaving(false);
      return { success: true };
    } catch (error: any) {
      setSaving(false);
      const errorMessage = error.message || 'Failed to save settings';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Update profile function
  const updateProfile = async (profileData: Partial<User>) => {
    setSaving(true);
    setError(null);

    try {
      await updateProfileMutation({
        variables: {
          input: {
            name: profileData.name,
            phone: profileData.phone,
            avatar: profileData.avatar
          }
        }
      });

      setSaving(false);
      return { success: true };
    } catch (error: any) {
      setSaving(false);
      const errorMessage = error.message || 'Failed to update profile';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Reset settings to defaults
  const resetSettings = async () => {
    setSaving(true);
    setError(null);

    try {
      const defaultSettings = {
        notifications: defaultNotifications,
        privacy: defaultPrivacy,
        appSettings: defaultAppSettings,
        security: defaultSecurity,
        support: defaultSupport
      };

      await updateSettingsMutation({
        variables: {
          input: defaultSettings
        }
      });

      // Update local state
      setNotifications(defaultNotifications);
      setPrivacy(defaultPrivacy);
      setAppSettings(defaultAppSettings);
      setSecurity(defaultSecurity);
      setSupport(defaultSupport);

      setSaving(false);
      toast.success('Settings reset to defaults');
      return { success: true };
    } catch (error: any) {
      setSaving(false);
      const errorMessage = error.message || 'Failed to reset settings';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Export settings
  const exportSettings = () => {
    const exportData = {
      user: {
        name: user?.name,
        email: user?.email,
        phone: user?.phone
      },
      notifications,
      privacy,
      appSettings,
      security: {
        ...security,
        // Don't export sensitive security data
        passwordLastChanged: undefined
      },
      support,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `smart-kitchen-settings-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast.success('Settings exported successfully');
  };

  // Import settings
  const importSettings = async (file: File) => {
    try {
      const text = await file.text();
      const importData = JSON.parse(text);

      if (!importData.notifications || !importData.appSettings) {
        throw new Error('Invalid settings file format');
      }

      // Validate and merge settings
      const newSettings = {
        notifications: { ...defaultNotifications, ...importData.notifications },
        privacy: { ...defaultPrivacy, ...importData.privacy },
        appSettings: { ...defaultAppSettings, ...importData.appSettings },
        security: { ...defaultSecurity, ...importData.security },
        support: { ...defaultSupport, ...importData.support }
      };

      const result = await saveSettings(newSettings);
      
      if (result.success) {
        // Update local state
        setNotifications(newSettings.notifications);
        setPrivacy(newSettings.privacy);
        setAppSettings(newSettings.appSettings);
        setSecurity(newSettings.security);
        setSupport(newSettings.support);
        
        toast.success('Settings imported successfully');
        return { success: true };
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to import settings';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Get settings summary for display
  const getSettingsSummary = () => {
    return {
      totalNotifications: Object.values(notifications).filter(Boolean).length,
      privacyLevel: Object.values(privacy).filter(Boolean).length,
      securityFeatures: Object.values(security).filter(Boolean).length,
      lastUpdated: user?.updatedAt || new Date().toISOString()
    };
  };

  return {
    // Data
    user,
    notifications,
    privacy,
    appSettings,
    security,
    support,
    
    // Loading and error states
    loading,
    saving,
    error: error || queryError?.message,
    
    // Actions
    updateProfile,
    autoSave,
    saveSettings,
    resetSettings,
    exportSettings,
    importSettings,
    
    // Setters for local state
    setUser,
    setNotifications,
    setPrivacy,
    setAppSettings,
    setSecurity,
    setSupport,
    setError,
    
    // Utilities
    getSettingsSummary,
    refetchUser
  };
}