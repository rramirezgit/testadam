'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import EmailEditor from 'src/components/newsletter-note/email-editor';

export default function NewNotePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAIMode = searchParams.get('mode') === 'ai';
  const fromAI = searchParams.get('fromAI') === 'true';
  const taskId = searchParams.get('taskId');

  return (
    <EmailEditor
      onClose={() => router.push('/dashboard/notes')}
      initialNote={null}
      excludeTemplates={['newsletter']}
      isAICreation={isAIMode}
      fromAI={fromAI}
      aiTaskId={taskId || undefined}
    />
  );
}
