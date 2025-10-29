'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import NewsletterEditor from 'src/components/newsletter-note/newsletter-editor';

export default function NewNewsletterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [aiGeneratedData, setAiGeneratedData] = useState<any>(null);

  // Detectar si viene de generación con IA
  useEffect(() => {
    const isAIGenerated = searchParams.get('aiGenerated') === 'true';
    if (isAIGenerated) {
      // Leer datos de sessionStorage
      const savedData = sessionStorage.getItem('ai-newsletter-data');
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setAiGeneratedData(parsedData);
          // Limpiar sessionStorage después de leer
          sessionStorage.removeItem('ai-newsletter-data');
        } catch (error) {
          console.error('Error parsing AI newsletter data:', error);
        }
      }
    }
  }, [searchParams]);

  return (
    <NewsletterEditor
      onClose={() => router.push('/dashboard/newsletter')}
      initialNewsletter={null}
      defaultTemplate="newsletter"
      onSaveRedirect={(id) => router.push(`/edit/newsletter/${id}`)}
      aiGeneratedData={aiGeneratedData}
    />
  );
}
