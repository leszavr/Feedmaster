
"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

type ObfuscatedTokenProps = {
  token: string;
};

export function ObfuscatedToken({ token }: ObfuscatedTokenProps) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className="flex items-center gap-2 font-mono text-sm">
      <span>{isVisible ? token : "•".repeat(20)}</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={toggleVisibility}
      >
        {isVisible ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
        <span className="sr-only">
          {isVisible ? "Hide token" : "Show token"}
        </span>
      </Button>
    </div>
  );
}
