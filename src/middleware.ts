// import { NextRequest, NextResponse } from 'next/server';
// import { getToken } from 'next-auth/jwt';
// export { default } from 'next-auth/middleware';

// export const config = {
//   matcher: ['/dashboard/:path*',
//      '/sign-in',
//      '/sign-up',
//      '/',
//      '/verify/:path*',
//      '/My_space'
    
//     ],
// };

// export async function middleware(request: NextRequest) {
//   const token = await getToken({ req: request });
//   const url = request.nextUrl;

//   // Redirect to dashboard if the user is already authenticated
//   // and trying to access sign-in, sign-up, or home page
//   if (
//     token &&
//     (url.pathname.startsWith('/sign-in') ||
//       url.pathname.startsWith('/sign-up') ||
//       url.pathname.startsWith('/verify') ||
//       url.pathname === '/')
//   ) {
//     return NextResponse.redirect(new URL('/dashboard', request.url));
//   }

//   if (!token && url.pathname.startsWith('/dashboard')) {
//     return NextResponse.redirect(new URL('/', request.url));
//   }

//   return NextResponse.next();
// }



import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/',
    '/sign-in',
    '/sign-up',
    '/verify/:path*',
    '/dashboard/:path*',
    '/My_space',
    '/workproject',
    '/profile-page',
    '/post-profile',
    '/post_work',
    '/jobpost',
    '/joblist',
    '/dev_listing_project',
    '/accepthing_project_list',
    '/review_applications',
    '/chat',
    '/ClientOngoingProject',
    '/OngoingProjects',
    '/profile_edit',
    '/project_verse',
  ],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // If user is authenticated and tries to access sign-in, sign-up, verify, or home, redirect to dashboard
  if (
    token &&
    (url.pathname === '/' ||
      url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/sign-up') ||
      url.pathname.startsWith('/verify'))
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Routes that require authentication
  const protectedRoutes = [
    '/dashboard',
    '/My_space',
    '/workproject',
    '/profile-page',
    '/post-profile',
    '/post_work',
    '/jobpost',
    '/joblist',
    '/dev_listing_project',
    '/review_applications',
    '/chat',
    '/ClientOngoingProject',
    '/OngoingProjects',
    '/profile_edit',
    '/project_verse',
  ];

  // If user is not authenticated and tries to access protected routes, redirect to sign-in
  if (
    !token &&
    protectedRoutes.some(route => url.pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}
