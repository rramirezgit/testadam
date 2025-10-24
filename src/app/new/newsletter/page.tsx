'use client';

import { useRouter } from 'next/navigation';

import NewsletterEditor from 'src/components/newsletter-note/newsletter-editor';

export default function NewNewsletterPage() {
  const router = useRouter();

  return (
    <NewsletterEditor
      onClose={() => router.push('/dashboard/newsletter')}
      initialNewsletter={null}
      defaultTemplate="newsletter"
      onSaveRedirect={(id) => router.push(`/edit/newsletter/${id}`)}
    />
  );
}
