import * as React from 'react';

interface EmailTemplateProps {
  name: string;
  qrCodeData: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  name,
  qrCodeData,
}) => (
  <div>
    <p>Halo {name},</p>
    <p>Terima kasih telah mendaftar. Berikut adalah QR Code Anda:</p>
    {/* Gunakan img biasa untuk email */}
    <img 
      src={qrCodeData} 
      alt="QR Code Anda" 
      width="200" 
      height="200"
      style={{ 
        display: 'block',
        margin: '20px auto',
        border: '1px solid #ddd',
        borderRadius: '4px',
        padding: '5px'
      }}
    />
  </div>
);
