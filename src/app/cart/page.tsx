import CartView from "@/components/CartView";

export const metadata = {
  title: "Your cart | The Puja Store (TPS)",
};

export default function CartPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-bold text-stone-900">Your cart</h1>
      <CartView />
    </main>
  );
}
