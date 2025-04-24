import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import NewsletterView from 'src/sections/newsletter/newsleter-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Newsletter - ${CONFIG.appName}` };

export default function Page() {
  return <NewsletterView />;
}
