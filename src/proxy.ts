import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // '/' est la page de présentation (non-localisée) : on l'exclut du proxy.
  matcher: ['/(fr|en)/:path*']
};
