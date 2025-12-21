'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, ChefHat, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useMutation } from '@apollo/client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { FORGOT_PASSWORD_MUTATION } from '@/lib/graphql/mutations';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [forgotPassword, { loading, error, data }] = useMutation(FORGOT_PASSWORD_MUTATION);

  useEffect(() => {
    if (data?.forgotPassword?.success) {
      setIsSubmitted(true);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      console.error('Forgot password error:', error);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      return;
    }

    try {
      await forgotPassword({
        variables: { email },
      });
    } catch (err) {
      console.error('Forgot password failed:', err);
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-4 sm:space-y-8"
        >
          {/* Success Header */}
          <div className="text-center space-y-4 sm:space-y-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-blue-600 shadow-xl shadow-emerald-500/25 dark:shadow-emerald-500/10"
            >
              <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </motion.div>
            
            <div className="space-y-1 sm:space-y-2">
              <h1 className="text-xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 via-emerald-700 to-blue-600 dark:from-emerald-400 dark:via-emerald-500 dark:to-blue-400 bg-clip-text text-transparent">
                Check Your Email
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                We've sent password reset instructions to your email
              </p>
            </div>
          </div>

          {/* Success Card */}
          <Card className="border-0 shadow-xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
            <CardContent className="p-4 sm:p-8 text-center space-y-4 sm:space-y-6">
              <div className="space-y-3 sm:space-y-4">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  We've sent a password reset link to:
                </p>
                <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 px-3 sm:px-4 py-2 rounded-lg">
                  {email}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <Button
                  onClick={() => setIsSubmitted(false)}
                  variant="outline"
                  className="w-full h-9 sm:h-10 text-xs sm:text-sm"
                >
                  Try Different Email
                </Button>
                
                <Link href="/login">
                  <Button className="w-full h-9 sm:h-10 text-xs sm:text-sm bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700">
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="space-y-4 sm:space-y-8"
      >
        {/* Header Section */}
        <div className="text-center space-y-4 sm:space-y-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-blue-600 shadow-xl shadow-emerald-500/25 dark:shadow-emerald-500/10"
          >
            <ChefHat className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
          </motion.div>
          
          <div className="space-y-1 sm:space-y-2">
            <h1 className="text-xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 via-emerald-700 to-blue-600 dark:from-emerald-400 dark:via-emerald-500 dark:to-blue-400 bg-clip-text text-transparent">
              Forgot Password?
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
              Enter your email to reset your password
            </p>
          </div>
        </div>

        {/* Reset Card */}
        <Card className="border-0 shadow-xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
          <CardContent className="p-4 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 text-xs sm:text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg sm:rounded-xl"
                >
                  <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span>{error.message}</span>
                </motion.div>
              )}

              {/* Email Field */}
              <div className="space-y-2 sm:space-y-3">
                <Label htmlFor="email" className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200">
                  Email Address
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-3 sm:left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500 transition-colors group-focus-within:text-emerald-500" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 sm:pl-12 h-10 sm:h-12 text-sm sm:text-base border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg sm:rounded-xl focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full h-10 sm:h-12 text-sm sm:text-base bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-medium rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                disabled={loading || !email}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="text-xs sm:text-sm">Sending Reset Link...</span>
                  </div>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}