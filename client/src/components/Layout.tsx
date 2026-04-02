import Header from './Header';
import AIChatbot from './AIChatbot';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <AIChatbot />
      {/* Footer can be added here later */}
    </div>
  );
}
