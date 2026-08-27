'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { useStore } from '@/store/useStore';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

function VerificationContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');
  const clearCart = useStore((state) => state.clearCart);

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'SUCCESS' | 'FAILED' | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!reference) {
      setLoading(false);
      setStatus('FAILED');
      setMessage('No payment reference found.');
      return;
    }

    const verify = async () => {
      try {
        const res = await fetchApi('/api/payments/verify/', {
          method: 'POST',
          body: JSON.stringify({ reference }),
        });

        if (res.status === 'SUCCESS') {
          setStatus('SUCCESS');
          clearCart(); // Clear local state only after valid backend verification
        } else {
          setStatus('FAILED');
          setMessage(res.message || 'Payment verification failed.');
        }
      } catch (err: any) {
        setStatus('FAILED');
        setMessage(err.message || 'An error occurred during verification.');
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [reference, clearCart]);

  if (loading) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center">
        <Loader2 className="w-12 h-12 animate-spin text-red-600 mx-auto mb-4" />
        <h1 className="text-xl font-bold uppercase text-zinc-900 dark:text-zinc-100">
          Verifying Payment...
        </h1>
        <p className="text-zinc-500 text-sm mt-2">Please do not refresh or leave this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-20 px-4 text-center">
      {status === 'SUCCESS' ? (
        <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h1 className="text-2xl font-black uppercase text-zinc-900 dark:text-zinc-100">
            Payment Successful!
          </h1>
          <p className="text-zinc-500 text-sm mt-2 mb-6">
            Reference: <span className="font-mono text-zinc-800 dark:text-zinc-200">{reference}</span>
          </p>
          <Link
            href="/"
            className="inline-block w-full bg-red-600 hover:bg-red-700 text-white font-black py-3 rounded-xl uppercase transition"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-black uppercase text-zinc-900 dark:text-zinc-100">
            Payment Failed
          </h1>
          <p className="text-zinc-500 text-sm mt-2 mb-6">{message}</p>
          <Link
            href="/checkout"
            className="inline-block w-full bg-red-600 hover:bg-red-700 text-white font-black py-3 rounded-xl uppercase transition text-center"
          >
            Try Again
          </Link>
        </div>
      )}
    </div>
  );
}

export default function VerifyPaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto py-24 px-4 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-red-600 mx-auto mb-4" />
          <h1 className="text-xl font-bold uppercase">Loading...</h1>
        </div>
      }
    >
      <VerificationContent />
    </Suspense>
  );
}