export default function AuthRouteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-page-bg flex min-h-screen items-center justify-center px-4 py-10">
      {children}
    </div>
  );
}
