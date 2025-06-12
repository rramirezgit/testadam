// src/components/newsletter-note/email-editor/TemplateCard.tsx

import React from 'react';
import Image from 'next/image';

import { Box, Card, Typography, CardContent } from '@mui/material';

interface TemplateCardProps {
  template: {
    id: string;
    name: string;
    image: string;
  };
  activeTemplate: string;
  setActiveTemplate: (templateId: string) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  activeTemplate,
  setActiveTemplate,
}) => (
  <Card
    variant={activeTemplate === template.id ? 'outlined' : 'elevation'}
    sx={{
      mb: 1,
      cursor: 'pointer',
      borderRadius: '8px',
      backgroundColor: activeTemplate === template.id ? 'primary.light' : 'grey.200',
    }}
    onClick={() => {
      console.log('🔄 TemplateCard clicked - Setting activeTemplate to:', template.id);
      setActiveTemplate(template.id);
    }}
  >
    <CardContent sx={{ padding: '10px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Image src={template.image} alt={template.name} width={90} height={60} />
      </Box>
      <Typography component="div" sx={{ fontSize: '13px', mt: 1, textAlign: 'center' }}>
        {template.name}
      </Typography>
    </CardContent>
  </Card>
);

export default TemplateCard;
