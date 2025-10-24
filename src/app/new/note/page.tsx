'use client';

import { useRouter } from 'next/navigation';

import EmailEditor from 'src/components/newsletter-note/email-editor';

export default function NewNotePage() {
  const router = useRouter();

  return (
    <EmailEditor
      onClose={() => router.push('/dashboard/notes')}
      initialNote={null}
      excludeTemplates={['newsletter']}
    />
  );
}
