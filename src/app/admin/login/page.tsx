import AdminLoginForm from "@/components/AdminLoginForm";

export const metadata = {
  title: "Admin login | The Puja Store (TPS)",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl font-bold text-stone-900">Admin login</h1>
      <p className="mt-2 text-sm text-stone-600">For store staff only.</p>
      <AdminLoginForm />
    </main>
  );
}