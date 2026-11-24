import { getStore } from '@netlify/blobs';
import { createDiscoveryHandler } from '../../scripts/fold-ai-lib.mjs';

const storeName = () => `fold-art-v1-${process.env.CONTEXT === 'production' ? 'production' : 'preview'}`;
export default request => createDiscoveryHandler({ env: process.env, getStore: () => getStore(storeName()) })(request);
export const config = {
  path: '/api/fold/discovery',
  rateLimit: { action: 'rate_limit', aggregateBy: 'domain', windowSize: 3600, windowLimit: 120 },
};
