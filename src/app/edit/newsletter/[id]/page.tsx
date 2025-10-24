'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { Box, CircularProgress } from '@mui/material';

import usePostStore from 'src/store/PostStore';

import NewsletterEditor from 'src/components/newsletter-note/newsletter-editor';

export default function EditNewsletterPage() {
  const params = useParams();
  const router = useRouter();
  const { findNewsletterById } = usePostStore();
  const [newsletter, setNewsletter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNewsletter = async () => {
      const id = params.id as string;
      const data = await findNewsletterById(id);
      setNewsletter(data);
      setLoading(false);
    };
    loadNewsletter();
  }, [params.id, findNewsletterById]);

  if (loading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <NewsletterEditor
      onClose={() => router.push('/dashboard/newsletter')}
      initialNewsletter={newsletter}
      defaultTemplate="newsletter"
    />
  );
}
