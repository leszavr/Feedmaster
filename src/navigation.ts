import {
  createLocalizedPathnamesNavigation,
  Pathnames,
} from 'next-intl/navigation';

export const locales = ['en', 'ru'] as const;
export const localePrefix = 'as-needed';

// The `pathnames` object holds pairs of internal
// and external paths, separated by locale.
export const pathnames: Pathnames<typeof locales> = {
  '/': '/',
  '/login': {
    en: '/login',
    ru: '/login',
  },
  '/dashboard': {
    en: '/dashboard',
    ru: '/dashboard',
  },
  '/moderation': {
    en: '/moderation',
    ru: '/moderation',
  },
  '/sources': {
    en: '/sources',
    ru: '/sources',
  },
  '/bots': {
    en: '/bots',
    ru: '/bots',
  },
  '/users': {
    en: '/users',
    ru: '/users',
  },
  '/settings': {
    en: '/settings',
    ru: '/settings',
  },
};

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createLocalizedPathnamesNavigation({ locales, localePrefix, pathnames });
