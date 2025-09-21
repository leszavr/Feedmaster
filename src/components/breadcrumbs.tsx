
"use client";

import { usePathname, Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { Fragment } from "react";
import { ChevronRight } from "lucide-react";

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function Breadcrumbs() {
  const pathname = usePathname();
  const t = useTranslations();

  // Don't show breadcrumbs on the root dashboard page
  if (pathname === '/dashboard') {
    return null;
  }

  const pathSegments = pathname.split("/").filter((segment) => segment);

  return (
    <nav aria-label="Breadcrumb" className="hidden md:flex">
      <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <li>
          <Link href="/dashboard" className="hover:text-foreground">
            {t("Breadcrumbs.home")}
          </Link>
        </li>
        {pathSegments.map((segment, index) => {
          const isLast = index === pathSegments.length - 1;
          const href = `/${pathSegments.slice(0, index + 1).join("/")}`;

          // Try to translate the segment, fallback to capitalized version
          let segmentTranslation;
          try {
            // e.g. Sidebar.dashboard
            segmentTranslation = t(`Sidebar.${segment}`);
          } catch (e) {
            // Fallback for untranslated segments like dynamic IDs
            segmentTranslation = capitalize(segment);
          }

          return (
            <Fragment key={segment}>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4" />
              </li>
              <li>
                {isLast ? (
                  <span className="font-medium text-foreground">
                    {segmentTranslation}
                  </span>
                ) : (
                  <Link href={href} className="hover:text-foreground">
                    {segmentTranslation}
                  </Link>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
