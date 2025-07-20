import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {currentYear} Aryan Khatri. All rights reserved.</p>
        <p>Built with React, Tailwind CSS, and Gemini API.</p>
      </div>
    </footer>
  );
};

export default Footer;