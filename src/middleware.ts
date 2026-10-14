import { defineMiddleware } from 'astro:middleware';
import { emphasizeHtml } from './lib/emphasis.mjs';

// Lets *word* in the copy document render as italics on every page.
export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();
  if (!response.headers.get('content-type')?.includes('text/html')) return response;
  return new Response(emphasizeHtml(await response.text()), { status: response.status, headers: response.headers });
});
