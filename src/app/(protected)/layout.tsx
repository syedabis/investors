import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import { Sidebar } from "@/components/Sidebar";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) redirect("/login");

  const session = await verifyToken(token);
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-screen bg-background text-on-surface overflow-x-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-secondary-container/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[150px]" />
        <div className="absolute inset-0 bg-grid-pattern" />
      </div>

      <Sidebar username={session.username} name={session.name} />

      <main className="flex-1 md:ml-64 pt-16 md:pt-0 min-h-screen relative z-10">
        {children}
      </main>

      {/* Mobile bottom nav spacing */}
      <div className="h-20 md:hidden" />
    </div>
  );
}
