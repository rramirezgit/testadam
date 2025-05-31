'use client';

import React from 'react';

import EmailComponentRenderer from './email-components';

import type { EmailComponentProps } from './email-components/types';

export default function EmailComponentWrapper(props: EmailComponentProps) {
  return <EmailComponentRenderer {...props} />;
}
