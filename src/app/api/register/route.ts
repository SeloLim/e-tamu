import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

import { Resend } from "resend";
import QRCode from "qrcode";
import { uploadToCloudinary } from "@/app/lib/cloudinary";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, phone } = await req.json();

    // Cek jika email sudah terdaftar
    const existingGuest = await prisma.guest.findUnique({ where: { email } });
    if (existingGuest) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 });
    }

    // Simpan tamu ke database
    const guest = await prisma.guest.create({
      data: { name, email, phone, qrCode:"null" },
    });

    // Generate QR Code as Buffer
    const qrCodeBuffer = await QRCode.toBuffer(guest.id);

    // Upload to Cloudinary (or any storage service)
    const qrCodeUrl = await uploadToCloudinary(qrCodeBuffer);

    // Simpan QR Code ke database
    await prisma.guest.update({
      where: { id: guest.id },
      data: { qrCode: qrCodeUrl as string },
    });

    // Kirim email dengan QR Code
    await resend.emails.send({
      from: "E-tamu <onboarding@resend.dev>",
      to: email,
      subject: "Registrasi Berhasil - QR Code Anda",
      html: `<p>Halo ${name},</p>
             <p>Terima kasih telah mendaftar. Berikut adalah QR Code Anda:</p>
             <img src="${qrCodeUrl}" alt="QR Code Anda" />`,
    });

    return NextResponse.json({ message: "Registrasi berhasil, QR Code dikirim ke email!", qrCode: qrCodeUrl});
  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan saat registrasi" }, { status: 500 });
  }
}
