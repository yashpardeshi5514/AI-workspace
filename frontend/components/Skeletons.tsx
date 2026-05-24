'use client';

import React from 'react';

export const Skeleton = ({ className = '' }: { className?: string }) => (
  <div
    className={`bg-zinc-800 animate-pulse rounded ${className}`}
    aria-hidden="true"
  />
);

export function ChatSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-20 w-full" />
        </div>
      ))}
    </div>
  );
}

export function FileSkeleton() {
  return (
    <div className="space-y-2 p-2">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-8 w-full" />
      ))}
    </div>
  );
}

export function EditorSkeleton() {
  return (
    <div className="space-y-3 p-4">
      <Skeleton className="h-10 w-1/3" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

export function WorkspaceSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-24 w-full" />
      ))}
    </div>
  );
}
