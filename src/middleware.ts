import createMiddleware from 'next-intl/middleware';
import {NextRequest} from 'next/server';

export default async function middleware(request: NextRequest) {
  // Your custom middleware logic goes here

  const handleI18nRouting = createMiddleware({
    locales: ['en', 'ru'],
    defaultLocale: 'ru',
  });
  const response = handleI18nRouting(request);

  // Your custom middleware logic for after `next-intl` goes here

  return response;
}


export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
