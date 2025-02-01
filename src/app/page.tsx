import { prisma } from "@/app/lib/prisma";
import Image from "next/image";

export default async function Home() {
  // Fetch the latest guest with a QR code
  const guest = await prisma.guest.findFirst({
    orderBy: { id: "desc" }, // Get the most recent guest
    select: { qrCode: true },
  });

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold">Selamat Datang</h1>
      <p className="mt-2 text-gray-600">QR Code terbaru:</p>

      {guest?.qrCode ? (
        <Image src={guest.qrCode} alt="QR Code" className="mt-4 w-48 h-48 border rounded-lg shadow-lg" width={200} height={200}/>
      ) : (
        <p className="text-gray-500 mt-4">Belum ada QR Code tersedia.</p>
      )}
    </div>
  );
}
