import type React from 'react';

import { EmailEditorMain } from './email-editor/main';

import type { EmailEditorProps } from './email-editor/types';

const EmailEditor: React.FC<EmailEditorProps> = (props) => <EmailEditorMain {...props} />;

export default EmailEditor;
