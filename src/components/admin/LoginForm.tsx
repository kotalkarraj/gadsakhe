"use client";

import { useActionState } from "react";
import { sendMagicLink, type FormState } from "@/app/admin/actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(
    sendMagicLink,
    {}
  );

  if (state.message) {
    return (
      <div className="fade-up mt-8 rounded-2xl bg-canopy p-6 text-limestone">
        <p className="font-display text-2xl italic text-brass">Check your inbox</p>
        <p className="mt-2 font-body text-sm text-limestone/75 leading-relaxed">
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="mt-8 flex flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className="font-stat text-[10px] tracking-[0.25em] text-dusk/50">EMAIL</span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="admin-input"
        />
      </label>
      {state.error && <p className="font-body text-sm text-red-700">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="btn-primary rounded-full bg-dusk px-6 py-3.5 font-body text-sm font-medium text-limestone hover:text-dusk disabled:opacity-60"
      >
        {pending ? "Sending…" : "Email me a sign-in link"}
      </button>
    </form>
  );
}
