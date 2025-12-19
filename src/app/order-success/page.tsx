'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const status = searchParams.get('status');
  
  const isPending = status === 'pending';

  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      {isPending ? (
        <ClockIcon className="mx-auto h-24 w-24 text-yellow-500" />
      ) : (
        <CheckCircleIcon className="mx-auto h-24 w-24 text-green-500" />
      )}
      
      <h1 className="mt-6 text-3xl font-bold">
        {isPending ? 'Pesanan Menunggu Pembayaran' : 'Pesanan Berhasil!'}
      </h1>
      
      <p className="mt-4 text-gray-600">
        {isPending
          ? 'Silakan selesaikan pembayaran Anda untuk memproses pesanan.'
          : 'Terima kasih atas pembelian Anda. Kami akan mengirimkan konfirmasi email dengan detail pesanan Anda.'}
      </p>
      
      {orderId && (
        <div className="mt-6 bg-gray-50 rounded-lg p-4 inline-block">
          <p className="text-sm text-gray-600">ID Pesanan</p>
          <p className="font-mono font-semibold text-lg">{orderId}</p>
        </div>
      )}

      <div className="mt-8 flex gap-4 justify-center">
        <Link
          href="/account"
          className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          Lihat Pesanan
        </Link>
        <Link
          href="/products"
          className="px-6 py-3 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 transition-colors"
        >
          Lanjut Belanja
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}