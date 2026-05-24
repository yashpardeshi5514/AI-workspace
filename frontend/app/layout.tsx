import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Developer Workspace',
  description: 'Collaborative AI development environment',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="color-scheme" content="dark" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
