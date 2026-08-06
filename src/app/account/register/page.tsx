"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) router.push("/account/login");
    else setError((await res.json()).error ?? "Something went wrong");
  }

  return (
    <div className="container flex min-h-[80vh] items-center justify-center pt-24">
      <div className="glass-light w-full max-w-sm rounded-lg p-8">
        <h1 className="mb-6 text-center font-display text-2xl">Create Account</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            placeholder="Full name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="glass-light rounded-md px-3 py-2"
          />
          <input
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="glass-light rounded-md px-3 py-2"
          />
          <input
            type="password"
            placeholder="Password"
            required
            minLength={8}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="glass-light rounded-md px-3 py-2"
          />
          {error && <p className="text-xs text-bordeaux">{error}</p>}
          <button type="submit" className="rounded-full bg-gold py-3 eyebrow text-noir">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
