export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-page p-4">
      <main id="main" className="w-full max-w-md flex flex-col justify-center animate-in fade-in zoom-in-95 duration-300">
        {children}
      </main>
    </div>
  );
}
