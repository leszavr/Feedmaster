
import {
  createLocalizedPathnamesNavigation,
  Pathnames,
} from 'next-intl/navigation';

export const locales = ['ru'] as const;
export const localePrefix = 'never'; // Убираем префиксы полностью

// The `pathnames` object holds pairs of internal
// and external paths, separated by locale.
export const pathnames: Pathnames<typeof locales> = {
  '/': '/',
  '/login': '/login',
  '/dashboard': '/dashboard',
  '/moderation': '/moderation',
  '/sources': '/sources',
  '/bots': '/bots',
  '/users': '/users',
  '/settings': '/settings',
  '/subscription': '/subscription',
  '/onboarding': '/onboarding',
  '/integrations': '/integrations',
  '/system': '/system',
};

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createLocalizedPathnamesNavigation({ locales, localePrefix, pathnames });
