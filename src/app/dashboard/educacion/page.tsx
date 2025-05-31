import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import EducacionView from 'src/sections/educacion/educacion-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Educación - ${CONFIG.appName}` };

export default function Page() {
  return <EducacionView />;
}
