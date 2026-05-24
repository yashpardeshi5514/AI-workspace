import './globals.css';
export const metadata = {
    title: 'AI Developer Workspace',
    description: 'Collaborative AI development environment',
};
export default function RootLayout({ children, }) {
    return (<html lang="en">
      <head>
        <meta name="color-scheme" content="dark"/>
      </head>
      <body className="antialiased">{children}</body>
    </html>);
}
//# sourceMappingURL=layout.js.map