
'use client';

import { useAuth } from '@/contexts/auth-context';
import { usePathname, useRouter } from '@/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, onboardingComplete } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    if (!onboardingComplete && pathname !== '/onboarding') {
      router.push('/onboarding');
      return;
    }

    if (onboardingComplete && pathname === '/onboarding') {
        router.push('/dashboard');
    }

  }, [user, loading, onboardingComplete, router, pathname]);

  if (loading) {
    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
      </div>
    );
  }

  if (user) {
    return <>{children}</>;
  }

  return null;
}
