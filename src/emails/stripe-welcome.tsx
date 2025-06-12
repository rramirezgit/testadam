import * as React from 'react';

export const StripeWelcomeEmail = ({ username = 'Zeno' }: { username?: string }) => (
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
    <h1 style={{ color: '#333', fontSize: '24px', marginBottom: '20px' }}>Welcome to Stripe!</h1>
    <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.5' }}>Hey {username},</p>
    <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.5' }}>
      Welcome to Stripe! We&apos;re thrilled to have you on board.
    </p>
    <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.5' }}>
      At Stripe, we&apos;re committed to helping businesses like yours succeed. Whether you&apos;re
      just getting started or already established, we have the tools and expertise to help you grow.
    </p>
    <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.5' }}>
      If you have any questions or need assistance, our team is here to help. Don&apos;t hesitate to
      reach out!
    </p>
    <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.5' }}>
      Best regards,
      <br />
      The Stripe team
    </p>
    <div
      style={{
        marginTop: '30px',
        paddingTop: '20px',
        borderTop: '1px solid #eee',
        color: '#999',
        fontSize: '12px',
      }}
    >
      Stripe, Inc. • 185 Berry Street, Suite 550, San Francisco, CA 94107
    </div>
  </div>
);

export default StripeWelcomeEmail;
