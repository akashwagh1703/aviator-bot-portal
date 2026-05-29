"use client";

/**
 * ClientRoot — client-only entry point.
 *
 * The assistant relies on browser-only state (localStorage-persisted store,
 * Speech APIs, theme applied to <html>). Rendering it on the server would
 * produce HTML that can't match the client, so we load it with `ssr: false`.
 * `ssr: false` is only permitted inside a Client Component, which is why this
 * wrapper exists between the server `page.js` and `AssistantApp`.
 */

import dynamic from "next/dynamic";

function Loader() {
  return (
    <div className="grid min-h-[100svh] place-items-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-accent" />
    </div>
  );
}

const AssistantApp = dynamic(() => import("./AssistantApp"), {
  ssr: false,
  loading: Loader,
});

export default function ClientRoot() {
  return <AssistantApp />;
}
