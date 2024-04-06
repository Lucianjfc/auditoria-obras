import { Github, Linkedin } from 'lucide-react';
import React from 'react';

export const Footer = () => (
  <footer
    className="flex align-items-center justify-content-center w-full h-full p-3 mt-auto"
    style={{ backgroundColor: '#3f51b5', color: ' #fafafa' }}
  >
    <div className="grid gap-4">
      <div className="flex flex-column gap-4 col">
        <div className="flex align-items-center gap-2">
          <div className="flex flex-column gap-0">
            <span className="text-sm">LSI</span>
            <span className="text-xl font-bold">Banco de Preços de Obras</span>
          </div>
        </div>
        <span>© 2024 LSI</span>
      </div>
      <div className="flex flex-col col justify-content-end gap-2">
        <div className="flex gap-8">
          <Linkedin size={18} />
          <Github size={18} />
        </div>

        <div className="flex gap-8 text-sm">
          <span>Termos de uso</span>
          <span>Política de privacidade</span>
        </div>
      </div>
    </div>
  </footer>
);
