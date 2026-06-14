'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PersonaCard } from '@/components/PersonaCard';
import { Persona } from '@/types';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function PersonaCardPage() {
  const router = useRouter();
  const [persona, setPersona] = useState<Persona | null>(null);

  useEffect(() => {
    Promise.resolve().then(() => {
      const stored = sessionStorage.getItem('persona');
      if (!stored) {
        router.push('/');
      } else {
        try {
          setPersona(JSON.parse(stored));
        } catch {
          router.push('/');
        }
      }
    });
  }, [router]);

  if (!persona) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0f19]">
        <LoadingSpinner />
      </div>
    );
  }

  return <PersonaCard persona={persona} />;
}
