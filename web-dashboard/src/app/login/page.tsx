'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      const response = await api.post('/auth/login', { email, password });
      const { user, tokens } = response.data;

      if (user.role !== 'ADMIN' && user.role !== 'ORGANIZATION') {
        setError('Unauthorized access. Only admins and organizations can sign in here.');
        return;
      }

      localStorage.setItem('@user', JSON.stringify(user));
      localStorage.setItem('@token', tokens.accessToken);
      localStorage.setItem('@refreshToken', tokens.refreshToken);

      router.push('/dashboard');
    } catch (err: any) {
      const errMsg = err.response?.data?.error || 'Sign in failed. Please check your credentials.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <h2 className="mt-8 text-3xl font-extrabold tracking-tight text-[#1E1E2D]">
              Sign in to SafeProtect
            </h2>
            <p className="mt-2 text-sm text-[#75759E]">
              Enter your credentials to access the management platform
            </p>
          </div>

          <div className="mt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error ? (
                <div className="p-3 bg-[#FFE5E9] text-[#FF2E55] rounded-xl text-sm font-semibold border border-[#FF2E55]/10">
                  {error}
                </div>
              ) : null}

              <div>
                <label htmlFor="email" className="block text-sm font-bold leading-6 text-[#1E1E2D]">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="block w-full rounded-xl border border-gray-300 py-3 px-4 shadow-sm focus:border-[#5B3FD3] focus:ring-[#5B3FD3] text-sm text-[#1E1E2D]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-bold leading-6 text-[#1E1E2D]">
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="block w-full rounded-xl border border-gray-300 py-3 px-4 shadow-sm focus:border-[#5B3FD3] focus:ring-[#5B3FD3] text-sm text-[#1E1E2D]"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded-xl bg-[#5B3FD3] px-3 py-3 text-sm font-bold leading-6 text-white shadow-sm hover:bg-[#5B3FD3]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B3FD3] disabled:opacity-50"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block bg-gradient-to-br from-[#5B3FD3] to-[#8B6FF7]">
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-12">
          <h1 className="text-4xl font-extrabold mb-4 text-center">SafeProtect Cameroon</h1>
          <p className="text-lg text-white/80 text-center max-w-md">
            Child Protection & Gender-Based Violence (GBV) Case Management Ecosystem
          </p>
        </div>
      </div>
    </div>
  );
}
