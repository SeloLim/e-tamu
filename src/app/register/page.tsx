"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [message, setMessage] = useState("");
  const [qrCode, setQrCode] = useState<string | null>(null); // ✅ Added missing state

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Mendaftarkan...");
    setQrCode(null); // ✅ Reset QR code on new registration attempt

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Registrasi berhasil! QR Code Anda ada di bawah.");
        setQrCode(data.qrCode);
      } else {
        setMessage(data.error || "Terjadi kesalahan saat registrasi.");
      }
    } catch (error) {
      setMessage("Gagal menghubungi server. Coba lagi.");
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold">Form Registrasi</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80 mt-4">
        <input className="p-2 border rounded" name="name" placeholder="Nama" onChange={handleChange} required />
        <input className="p-2 border rounded" name="email" placeholder="Email" type="email" onChange={handleChange} required />
        <input className="p-2 border rounded" name="phone" placeholder="Nomor HP" onChange={handleChange} required />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">Daftar</button>
      </form>
      {message && <p className="mt-4 text-red-500">{message}</p>}
      {qrCode && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold">QR Code Anda:</h2>
          <img src={qrCode} alt="QR Code" className="mt-2 w-48 h-48" />
        </div>
      )}
    </div>
  );
}
