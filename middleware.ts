import { NextRequest, NextResponse } from 'next/server';

/**
 * Mode maintenance : quand NEXT_PUBLIC_MAINTENANCE_MODE vaut "true",
 * toutes les routes sont redirigées vers la page /maintenance.
 *
 * Le matcher exclut déjà les assets internes Next (_next/*),
 * les fichiers Netlify, le favicon et la page de maintenance elle-même.
 * On laisse aussi passer les fichiers statiques (avec extension) pour
 * que la page de maintenance puisse charger ses images/styles.
 */
export function middleware(request: NextRequest) {
  const maintenance = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';
  const { pathname } = request.nextUrl;

  if (!maintenance) {
    return NextResponse.next();
  }

  // Déjà sur la page de maintenance (avec ou sans préfixe de locale).
  if (/^\/(?:en|fr)?\/?maintenance\/?$/.test(pathname)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = '/maintenance';
  url.search = '';
  return NextResponse.redirect(url, 307);
}

export const config = {
  matcher: [
    // La racine et les racines localisées (la home, non couverte par le pattern ci-dessous).
    '/',
    '/(en|fr)',
    /*
     * On applique le middleware à tout SAUF :
     * - les routes internes Next (_next/static, _next/image, _next/data)
     * - les fonctions Netlify
     * - le favicon et les fichiers avec une extension (assets statiques)
     */
    '/((?!_next/|\\.netlify/|favicon\\.ico|.*\\.[\\w]+$).*)',
  ],
};
