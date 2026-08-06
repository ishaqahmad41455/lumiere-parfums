"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="container flex min-h-[80vh] items-center justify-center pt-24">
      <div className="glass-light w-full max-w-sm rounded-lg p-8">
        <h1 className="mb-6 text-center font-display text-2xl">Sign In</h1>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            signIn("credentials", { email, password, callbackUrl: "/account" });
          }}
        >
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="glass-light rounded-md px-3 py-2"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="glass-light rounded-md px-3 py-2"
          />
          <button type="submit" className="rounded-full bg-gold py-3 eyebrow text-noir">
            Sign In
          </button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs text-noir/40 dark:text-cream/40">
          <div className="h-px flex-1 bg-noir/10 dark:bg-cream/10" />
          OR
          <div className="h-px flex-1 bg-noir/10 dark:bg-cream/10" />
        </div>

        <div className="flex flex-col gap-3">
          <button onClick={() => signIn("google", { callbackUrl: "/account" })} className="rounded-full border border-noir/20 py-2 text-sm dark:border-cream/20">
            Continue with Google
          </button>
          <button onClick={() => signIn("github", { callbackUrl: "/account" })} className="rounded-full border border-noir/20 py-2 text-sm dark:border-cream/20">
            Continue with GitHub
          </button>
        </div>

        <p className="mt-6 text-center text-sm">
          New here? <Link href="/account/register" className="text-gold underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
