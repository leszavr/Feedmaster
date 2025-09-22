import createMiddleware from 'next-intl/middleware';
import { locales, localePrefix, pathnames } from './navigation';

export default createMiddleware({
  defaultLocale: 'ru',
  locales,
  localePrefix: 'never',
  pathnames,
});

export const config = {
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    '/(ru)/:path*',

    // Enable redirects that add a locale prefix
    // (e.g. `/pathnames` -> `/ru/pathnames`)
    '/((?!_next|_vercel|.*\\..*).*)',
  ],
};
