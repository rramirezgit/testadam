'use client';

import { Box, Button } from '@mui/material';

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function TabNavigation({ activeTab, setActiveTab }: TabNavigationProps) {
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Box sx={{ display: 'flex' }}>
        <Button
          variant={activeTab === 'content' ? 'contained' : 'text'}
          onClick={() => setActiveTab('content')}
          sx={{ flex: 1, borderRadius: 0, py: 1 }}
        >
          CONTENIDO
        </Button>
        <Button
          variant={activeTab === 'design' ? 'contained' : 'text'}
          onClick={() => setActiveTab('design')}
          sx={{ flex: 1, borderRadius: 0, py: 1 }}
        >
          DISEÑO
        </Button>
        <Button
          variant={activeTab === 'preview' ? 'contained' : 'text'}
          onClick={() => setActiveTab('preview')}
          sx={{ flex: 1, borderRadius: 0, py: 1 }}
        >
          VISTA PREVIA
        </Button>
      </Box>
    </Box>
  );
}
