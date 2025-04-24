import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import NotesView from 'src/sections/notes/notes-view';

// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Notas - ${CONFIG.appName}` };

export default function Page() {
  return <NotesView />;
}
