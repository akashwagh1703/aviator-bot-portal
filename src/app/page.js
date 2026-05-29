import dynamic from "next/dynamic";

// The assistant is a heavy, browser-API-driven client app — load it lazily so
// it stays out of the initial server render path.
const AssistantApp = dynamic(() => import("@/components/layout/AssistantApp"));

export default function Home() {
  return <AssistantApp />;
}
