import CheckoutForm from "@/components/CheckoutForm";

export const metadata = {
  title: "Checkout | The Puja Store (TPS)",
};

export default function CheckoutPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold text-stone-900">Checkout</h1>
      <CheckoutForm />
    </main>
  );
}