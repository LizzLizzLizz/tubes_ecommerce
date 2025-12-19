'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (orderId) {
      // Clear cart from localStorage for both logged-in and guest users
      // Check for user-specific cart keys
      const allKeys = Object.keys(localStorage);
      allKeys.forEach(key => {
        if (key.startsWith('cart_') || key === 'cart') {
          localStorage.removeItem(key);
        }
      });
      setLoading(false);
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Processing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircleIcon className="h-20 w-20 text-green-500 mx-auto mb-6" />
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Pembayaran Berhasil!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Terima kasih atas pembelian Anda. Pesanan Anda sedang diproses.
          </p>

          {orderId && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <p className="text-sm text-gray-500 mb-2">Order ID</p>
              <p className="text-lg font-mono font-medium text-gray-900">
                {orderId}
              </p>
            </div>
          )}

          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Pembayaran Berhasil</span>
              </div>
              <span>→</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>Sedang Dikemas</span>
              </div>
              <span>→</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                <span>Dalam Pengiriman</span>
              </div>
              <span>→</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                <span>Selesai</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-gray-900 mb-3">Langkah Selanjutnya:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Anda akan menerima email konfirmasi pembayaran</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Pesanan akan dikemas dalam 1-2 hari kerja</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Lacak status pesanan Anda di halaman "Pesanan Saya"</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Hubungi customer service jika ada pertanyaan</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-4 justify-center">
            <Link
              href="/orders"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Lihat Pesanan Saya
            </Link>
            <Link
              href="/"
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Butuh bantuan? Hubungi kami di admin@peron.id</p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
