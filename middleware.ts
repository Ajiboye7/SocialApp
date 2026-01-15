/*import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};*/

import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    // Apply middleware to all routes except /api/webhooks, static files, and _next
    '/((?!api/webhook/clerk|.*\\..*|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
};