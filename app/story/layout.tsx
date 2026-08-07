import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Parfum du Jour",
    template: "%s | Parfum du Jour",
  },
  description: "Générez vos visuels Story Instagram 9:16 pour votre parfum du jour.",
};

export default function StoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
