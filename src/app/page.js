import ClientRoot from "@/components/layout/ClientRoot";

// The assistant is a browser-API-driven client app. It is mounted client-only
// (see ClientRoot) to avoid any SSR/client hydration mismatch.
export default function Home() {
  return <ClientRoot />;
}
