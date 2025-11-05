// app/conta/page.tsx
"use client";

import { useEffect, useState } from "react";

type UserProfile = { name: string; phone: string };

export default function ContaPage() {
  const [profile, setProfile] = useState<UserProfile>({ name: "", phone: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("userProfile");
      if (raw) setProfile(JSON.parse(raw));
    } catch {}
  }, []);

  const save = () => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  };

  const logout = () => {
    localStorage.removeItem("userProfile");
    setProfile({ name: "", phone: "" });
  };

  return (
    <main className="min-h-screen">
      <div className="max-w-xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Minha Conta</h1>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 space-y-4">
          <div>
            <label className="text-sm text-zinc-400">Nome completo</label>
            <input
              className="mt-1 w-full px-3 py-3 rounded-xl bg-zinc-950 border border-zinc-700"
              value={profile.name}
              onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))}
              placeholder="Seu nome"
            />
          </div>
          <div>
            <label className="text-sm text-zinc-400">WhatsApp</label>
            <input
              className="mt-1 w-full px-3 py-3 rounded-xl bg-zinc-950 border border-zinc-700"
              value={profile.phone}
              onChange={(e) => setProfile(p => ({ ...p, phone: e.target.value }))}
              placeholder="(44) 98860-6483"
              inputMode="tel"
            />
          </div>

          <div className="flex gap-3">
            <button onClick={save} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white">
              Salvar
            </button>
            <button onClick={logout} className="px-4 py-2 rounded-xl border border-zinc-700 hover:bg-zinc-800">
              Sair
            </button>
          </div>

          {saved && (
            <div className="text-emerald-400 text-sm">Dados salvos! O checkout vai preencher seu nome/WhatsApp.</div>
          )}
        </div>
      </div>
    </main>
  );
}
