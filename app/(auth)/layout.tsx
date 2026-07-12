import { Navbar } from '@/components/layout/Navbar';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center pt-[var(--header-height)] px-6 relative z-10 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-violet/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="w-full max-w-md relative z-10">
          {children}
        </div>
      </div>
    </>
  );
}
