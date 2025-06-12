import * as React from 'react';

export const VercelInviteUserEmail = ({
  username = 'zenorocha',
  userImage = '',
  invitedByUsername = 'bukinoshita',
  invitedByEmail = 'bukinoshita@example.com',
  teamName = 'My Project',
  teamImage = '',
  inviteLink = 'https://vercel.com/teams/invite/foo',
}: {
  username?: string;
  userImage?: string;
  invitedByUsername?: string;
  invitedByEmail?: string;
  teamName?: string;
  teamImage?: string;
  inviteLink?: string;
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
    <h1 style={{ color: '#333', fontSize: '24px', marginBottom: '20px' }}>
      Join {teamName} on Vercel
    </h1>
    <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.5' }}>Hello {username},</p>
    <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.5' }}>
      <strong>{invitedByUsername}</strong> ({invitedByEmail}) has invited you to the{' '}
      <strong>{teamName}</strong> team on Vercel.
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
      <a
        href={inviteLink}
        style={{
          backgroundColor: '#000',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '6px',
          textDecoration: 'none',
          display: 'inline-block',
          fontWeight: 'bold',
        }}
      >
        Join the team
      </a>
    </div>
    <p style={{ color: '#666', fontSize: '14px' }}>
      Or copy and paste this URL into your browser:{' '}
      <a href={inviteLink} style={{ color: '#0070f3' }}>
        {inviteLink}
      </a>
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
      This invitation was intended for {username}. If you were not expecting this invitation, you
      can ignore this email.
    </div>
  </div>
);

export default VercelInviteUserEmail;
