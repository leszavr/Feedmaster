
import type { ReactNode } from "react";

// This is the public layout. It does not require authentication.
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      {children}
    </div>
  );
}
