import "./globals.css";

export const metadata = {
  title: "JTBD 3: Light and Dark modes",
  description: "Prototype deployed via VibeSharing",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script src="https://vibesharing.app/vs-sdk.js" defer></script>
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
