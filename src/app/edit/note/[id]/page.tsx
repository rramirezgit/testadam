'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { Box, CircularProgress } from '@mui/material';

import usePostStore from 'src/store/PostStore';

import EmailEditor from 'src/components/newsletter-note/email-editor';

export default function EditNotePage() {
  const params = useParams();
  const router = useRouter();
  const { findById } = usePostStore();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNote = async () => {
      const id = params.id as string;
      const data = await findById(id);
      setNote(data);
      setLoading(false);
    };
    loadNote();
  }, [params.id, findById]);

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
    <EmailEditor
      onClose={() => router.push('/dashboard/notes')}
      initialNote={note}
      excludeTemplates={['newsletter']}
    />
  );
}
