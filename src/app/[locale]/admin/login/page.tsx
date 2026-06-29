'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  AlertCircle,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  Lock,
  LogIn,
  Mail,
} from 'lucide-react';

import { useRouter } from '@/navigation';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';

const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 30;

export default function AdminLoginPage() {
  const t = useTranslations('admin');
  const locale = useLocale();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const [recoveryMode, setRecoveryMode] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    if (lockoutRemaining <= 0) return;
    const interval = setInterval(() => setLockoutRemaining((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(interval);
  }, [lockoutRemaining]);

  useEffect(() => {
    const supabase = createClient();
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setRecoveryMode(true);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (lockoutRemaining > 0) return;

    setError(null);
    setLoading(true);

    const supabase = createClient(rememberMe);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (signInError) {
      const attempts = failedAttempts + 1;
      setFailedAttempts(attempts);
      if (attempts >= MAX_ATTEMPTS) {
        setLockoutRemaining(LOCKOUT_SECONDS);
        setFailedAttempts(0);
      }
      setError(t('wrong_credentials'));
      return;
    }

    router.push('/admin');
    router.refresh();
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setForgotLoading(true);
    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `${window.location.origin}/${locale}/admin/login`,
    });
    setForgotLoading(false);
    setForgotSent(true);
  }

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    setUpdatingPassword(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    setUpdatingPassword(false);
    if (!updateError) {
      router.push('/admin');
      router.refresh();
    } else {
      setError(updateError.message);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left branding panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-ztf-navyDeep via-ztf-navy to-ztf-navyDeep p-12 text-white lg:flex">
        <div className="pointer-events-none absolute -left-10 top-20 h-72 w-72 rounded-full bg-ztf-gold/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 right-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="relative flex items-center gap-3">
          <GraduationCap className="h-9 w-9 text-ztf-gold" />
          <span className="text-xl font-bold">ZTF University Institute</span>
        </div>
        <div className="relative">
          <h1 className="text-3xl font-bold leading-tight">{t('title')}</h1>
          <p className="mt-4 max-w-md text-white/70">
            &ldquo;Empowering World Innovators and Leaders for Global Impact&rdquo;
          </p>
        </div>
        <p className="relative text-xs text-white/40">{t('login_title')} &middot; Supabase Auth</p>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center gap-2 text-center lg:hidden">
            <GraduationCap className="h-10 w-10 text-ztf-navy" />
            <h1 className="text-lg font-bold text-ztf-navy">{t('login_title')}</h1>
          </div>

          {recoveryMode ? (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <h2 className="text-lg font-bold text-ztf-navy">Set a new password</h2>
              <div>
                <Label htmlFor="new_password">{t('password')}</Label>
                <Input
                  id="new_password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={8}
                  required
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full" disabled={updatingPassword}>
                {updatingPassword && <Loader2 className="h-4 w-4 animate-spin" />}
                Update password
              </Button>
            </form>
          ) : showForgot ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <h2 className="hidden text-lg font-bold text-ztf-navy lg:block">{t('forgot_password')}</h2>
              {forgotSent ? (
                <Alert>
                  <AlertDescription>{t('reset_password_sent')}</AlertDescription>
                </Alert>
              ) : (
                <div>
                  <Label htmlFor="forgot_email">{t('email')}</Label>
                  <Input
                    id="forgot_email"
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                </div>
              )}
              <Button type="submit" className="w-full" disabled={forgotLoading || forgotSent}>
                {forgotLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {t('forgot_password')}
              </Button>
              <button
                type="button"
                onClick={() => {
                  setShowForgot(false);
                  setForgotSent(false);
                }}
                className="block w-full text-center text-sm text-gray-500 hover:text-ztf-navy"
              >
                {t('login')}
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <h2 className="hidden text-lg font-bold text-ztf-navy lg:block">{t('login_title')}</h2>
              <div>
                <Label htmlFor="email">{t('email')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className="pl-9"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="password">{t('password')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    className="pl-9 pr-9"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? t('hide_password') : t('show_password')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-ztf-navy"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember_me"
                    checked={rememberMe}
                    onCheckedChange={(v) => setRememberMe(!!v)}
                  />
                  <Label htmlFor="remember_me" className="font-normal">
                    {t('remember_me')}
                  </Label>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-sm text-ztf-navy hover:underline"
                >
                  {t('forgot_password')}
                </button>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {lockoutRemaining > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Too many attempts. Try again in {lockoutRemaining}s.</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading || lockoutRemaining > 0}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
                {t('login')}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
