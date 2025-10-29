import type React from 'react';

import { useState } from 'react';

import { EmailEditorMain } from './email-editor/main';

import type { EmailEditorProps } from './email-editor/types';

const EmailEditor: React.FC<EmailEditorProps> = (props) => {
  // Estado interno para preview si no se proporciona externamente
  const [internalShowPreview, setInternalShowPreview] = useState(false);

  // Usar el prop externo si existe, sino usar el estado interno
  const showPreview = props.showPreview ?? internalShowPreview;
  const onTogglePreview =
    props.onTogglePreview ?? (() => setInternalShowPreview(!internalShowPreview));

  return <EmailEditorMain {...props} showPreview={showPreview} onTogglePreview={onTogglePreview} />;
};

export default EmailEditor;
