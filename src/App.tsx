/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ClosedBook } from './components/ClosedBook';
import { OpenBook } from './components/OpenBook';
import { MemoryModal } from './components/MemoryModal';
import { Alumnus, MemoryPhoto, SignatureEntry, MarginComment } from './types';
import {
  INITIAL_ALUMNI,
  INITIAL_MEMORY_PHOTOS,
  INITIAL_SIGNATURES,
} from './data/mockData';
import { playBookOpenSound } from './utils/audio';

const STORAGE_KEYS = {
  ALUMNI: 'gontor_2008_alumni_v5',
  PHOTOS: 'gontor_2008_photos_v5',
  SIGNATURES: 'gontor_2008_signatures_v5',
};

// Ensure all regions strictly conform to: Bandung Raya, Sumedang, Garut, Tasik, Ciamis
const normalizePrianganRegion = (r?: string): string => {
  if (!r) return 'Bandung Raya';
  const lower = r.toLowerCase();
  if (lower.includes('tasik')) return 'Tasik';
  if (lower.includes('ciamis') || lower.includes('banjar') || lower.includes('pangandaran')) return 'Ciamis';
  if (lower.includes('garut')) return 'Garut';
  if (lower.includes('sumedang')) return 'Sumedang';
  return 'Bandung Raya';
};

export default function App() {
  const [isOpen, setIsOpen] = useState(true);
  const [isOpening, setIsOpening] = useState(false);
  const [closedCoverSide, setClosedCoverSide] = useState<'front' | 'back'>('front');
  const openTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (openTimerRef.current) window.clearTimeout(openTimerRef.current);
    };
  }, []);

  // Data state with localStorage persistence and alphabetical sorting (A-Z)
  const [alumniList, setAlumniList] = useState<Alumnus[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ALUMNI);
      if (saved) {
        const parsed: Alumnus[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
            .map((alm) => ({
              ...alm,
              prianganRegion: normalizePrianganRegion(alm.prianganRegion),
            }))
            .sort((a, b) =>
              a.fullName.trim().localeCompare(b.fullName.trim(), 'id', { sensitivity: 'base' })
            );
        }
      }
    } catch {}
    return [...INITIAL_ALUMNI].sort((a, b) =>
      a.fullName.trim().localeCompare(b.fullName.trim(), 'id', { sensitivity: 'base' })
    );
  });

  const [photos, setPhotos] = useState<MemoryPhoto[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PHOTOS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_MEMORY_PHOTOS;
  });

  const [signatures, setSignatures] = useState<SignatureEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SIGNATURES);
      if (saved) {
        const parsed: SignatureEntry[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((sig) => ({
            ...sig,
            consulat: normalizePrianganRegion(sig.consulat),
          }));
        }
      }
    } catch {}
    return INITIAL_SIGNATURES;
  });

  // Modal inspection states
  const [selectedAlumnus, setSelectedAlumnus] = useState<Alumnus | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<MemoryPhoto | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ALUMNI, JSON.stringify(alumniList));
    } catch {}
  }, [alumniList]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photos));
    } catch {}
  }, [photos]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SIGNATURES, JSON.stringify(signatures));
    } catch {}
  }, [signatures]);

  // Open book handler with physical audio and easing
  const handleOpenBook = useCallback(() => {
    if (isOpen || isOpening) return;
    if (openTimerRef.current) window.clearTimeout(openTimerRef.current);
    setIsOpening(true);
    playBookOpenSound();

    openTimerRef.current = window.setTimeout(() => {
      setIsOpen(true);
      setIsOpening(false);
    }, 900);
  }, [isOpen, isOpening]);

  const handleCloseBook = useCallback((targetSide: 'front' | 'back' = 'front') => {
    setClosedCoverSide(targetSide);
    setIsOpen(false);
  }, []);

  const handleAddAlumnus = useCallback((newAlumnus: Alumnus) => {
    setAlumniList((prev) => {
      const safeNewAlumnus: Alumnus = {
        ...newAlumnus,
        id: newAlumnus.id || `alm-priangan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      };

      const existingIdx = prev.findIndex(
        (a) =>
          a.id === safeNewAlumnus.id ||
          a.fullName.trim().toLowerCase() === safeNewAlumnus.fullName.trim().toLowerCase()
      );

      let updatedList: Alumnus[];
      if (existingIdx >= 0) {
        updatedList = prev.map((item, idx) =>
          idx === existingIdx ? { ...item, ...safeNewAlumnus } : item
        );
      } else {
        updatedList = [...prev, safeNewAlumnus];
      }

      return [...updatedList].sort((a, b) =>
        a.fullName.trim().localeCompare(b.fullName.trim(), 'id', { sensitivity: 'base' })
      );
    });
  }, []);

  const handleAddMemoryPhoto = useCallback((newPhoto: MemoryPhoto) => {
    setPhotos((prev) => [newPhoto, ...prev]);
  }, []);

  const handleAddSignature = useCallback((entry: Omit<SignatureEntry, 'id' | 'date'>) => {
    const newEntry: SignatureEntry = {
      ...entry,
      id: `sig-${Date.now()}`,
      date: new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date()),
    };
    setSignatures((prev) => [newEntry, ...prev]);
  }, []);

  const handleAddMarginComment = useCallback((
    photoId: string,
    comment: Omit<MarginComment, 'id' | 'date'>
  ) => {
    const newComment: MarginComment = {
      ...comment,
      id: `c-${Date.now()}`,
      date: new Intl.DateTimeFormat('id-ID', {
        month: 'short',
        year: 'numeric',
      }).format(new Date()),
    };

    setPhotos((prev) =>
      prev.map((p) => {
        if (p.id === photoId) {
          const updated = {
            ...p,
            marginNotes: [newComment, ...p.marginNotes],
          };
          setSelectedPhoto((curr) => (curr && curr.id === photoId ? updated : curr));
          return updated;
        }
        return p;
      })
    );
  }, []);

  const handleSelectAlumnus = useCallback((alm: Alumnus) => {
    setSelectedAlumnus(alm);
  }, []);

  const handleSelectPhoto = useCallback((photo: MemoryPhoto) => {
    setSelectedPhoto(photo);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedAlumnus(null);
    setSelectedPhoto(null);
  }, []);

  return (
    <main className="w-full min-h-screen bg-[#0e0704] text-[#2c1d11] overflow-x-hidden">
      {!isOpen ? (
        <ClosedBook
          onOpen={handleOpenBook}
          isOpening={isOpening}
          initialCoverSide={closedCoverSide}
        />
      ) : (
        <OpenBook
          onCloseBook={handleCloseBook}
          alumniList={alumniList}
          photos={photos}
          signatures={signatures}
          onSelectAlumnus={handleSelectAlumnus}
          onSelectPhoto={handleSelectPhoto}
          onAddSignature={handleAddSignature}
          onAddAlumnus={handleAddAlumnus}
          onAddMemoryPhoto={handleAddMemoryPhoto}
        />
      )}

      {/* Illuminated Detail View Modal */}
      {(selectedAlumnus || selectedPhoto) && (
        <MemoryModal
          selectedAlumnus={selectedAlumnus}
          selectedPhoto={selectedPhoto}
          onClose={handleCloseModal}
          onAddMarginComment={handleAddMarginComment}
        />
      )}
    </main>
  );
}
