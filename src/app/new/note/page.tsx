'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import EmailEditor from 'src/components/newsletter-note/email-editor';

export default function NewNotePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAIMode = searchParams.get('mode') === 'ai';

  return (
    <EmailEditor
      onClose={() => router.push('/dashboard/notes')}
      initialNote={null}
      excludeTemplates={['newsletter']}
      isAICreation={isAIMode}
    />
  );
}
