'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-zinc-950 gap-8">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-2">
          AI Developer Workspace
        </h1>
        <p className="text-zinc-400 text-lg">
          Collaborative AI development environment
        </p>
      </div>

      <div className="flex gap-4">
        <Link
          href="/login"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className="px-6 py-3 border border-zinc-700 hover:border-zinc-600 rounded-lg font-medium transition-colors"
        >
          Create Account
        </Link>
      </div>
    </div>
  );
}
