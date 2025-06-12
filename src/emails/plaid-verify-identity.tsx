import * as React from 'react';

export const PlaidVerifyIdentityEmail = ({
  validationCode = '144833',
}: {
  validationCode?: string;
}) => (
  <div
    style={{
      backgroundColor: '#ffffff',
      fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
      margin: '0 auto',
      padding: '20px',
      maxWidth: '600px',
    }}
  >
    <h1 style={{ color: '#333', fontSize: '24px', marginBottom: '20px' }}>Verify your identity</h1>
    <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.5' }}>
      Use this verification code to complete your identity verification:
    </p>
    <div
      style={{
        backgroundColor: '#f4f4f4',
        padding: '20px',
        borderRadius: '8px',
        margin: '20px 0',
        textAlign: 'center' as const,
      }}
    >
      <span
        style={{
          fontSize: '32px',
          fontWeight: 'bold',
          letterSpacing: '4px',
          color: '#333',
        }}
      >
        {validationCode}
      </span>
    </div>
    <p style={{ color: '#666', fontSize: '14px' }}>
      This code will expire in 5 minutes for security reasons.
    </p>
  </div>
);

export default PlaidVerifyIdentityEmail;
