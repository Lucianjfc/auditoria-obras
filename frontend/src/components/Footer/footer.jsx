import React from 'react';

export const Footer = () => (
  <footer
    className="flex align-items-center justify-content-center w-full p-3 mt-auto border-round h-5rem"
    style={{ backgroundColor: '#3f51b5', color: ' #fafafa' }}
  >
    <div className="flex align-items-center justify-content-center">
      <div className="flex gap-8">
        <span>LSI © 2024</span>
        <span>Termos de uso</span>
        <span>Política de privacidade</span>
      </div>
    </div>
  </footer>
);
