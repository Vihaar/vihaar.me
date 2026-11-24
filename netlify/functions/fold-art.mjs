import { getStore } from '@netlify/blobs';

export default async (request, context) => {
  if (request.method !== 'GET') return new Response('Use GET.', { status: 405, headers: { Allow: 'GET' } });
  const key = context.params.key;
  if (!/^[a-f0-9]{64}$/.test(key)) return new Response('Not found.', { status: 404 });
  const store = getStore(`fold-art-v1-${process.env.CONTEXT === 'production' ? 'production' : 'preview'}`);
  const entry = await store.getWithMetadata(`${key}.image`, { type: 'arrayBuffer' });
  if (!entry || !['image/jpeg', 'image/png'].includes(entry.metadata?.contentType)) return new Response('Not found.', { status: 404 });
  return new Response(entry.data, { headers: { 'Content-Type': entry.metadata.contentType, 'Cache-Control': 'public, max-age=31536000, immutable', 'X-Content-Type-Options': 'nosniff' } });
};
export const config = { path: '/api/fold/art/:key' };
