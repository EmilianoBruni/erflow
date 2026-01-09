'use client';

// Card management system with drag-and-drop support
import type React from 'react';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search } from 'lucide-react';
import { Github } from '@/components/icons/github';
import { DraggableCard } from '@/components/draggable-card';
import { Input } from '@/components/ui/input';
import { ActionButtons } from '@/components/action-buttons';

export interface CardData {
    id: string;
    color: 'rosso' | 'giallo' | 'blu' | 'verde' | 'bianco';
    patientName: string;
    patology: string;
    location:
        | 'OT1'
        | 'OT2'
        | 'COR'
        | 'ACQ'
        | 'TRI'
        | 'OBI1'
        | 'OBI2'
        | 'OBI3'
        | ' ';
    moved: 'R' | 'D' | ' ';
    movedTo: string;
    content: string;
    collapsed?: boolean;
}

function createDefaultCard(): CardData {
    return {
        id: `card-${Date.now()}-${Math.random()}`,
        color: 'bianco',
        patientName: '',
        patology: '',
        location: ' ',
        moved: ' ',
        movedTo: '',
        content: '',
        collapsed: false
    };
}

export default function Page() {
    const isClientRef = useRef(false);

    // Initialize state from localStorage on first render
    const [cards, setCards] = useState<CardData[]>(() => {
        if (typeof window === 'undefined') return [];
        const saved = localStorage.getItem('draggable-cards');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Failed to parse saved cards:', e);
                return [createDefaultCard()];
            }
        }
        return [createDefaultCard()];
    });

    const [isDark, setIsDark] = useState(() => {
        if (typeof window === 'undefined') return false;
        return localStorage.getItem('dark-mode') === 'true';
    });

    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const addCard = useCallback(() => {
        setCards(prevCards => [...prevCards, createDefaultCard()]);
    }, []);

    function removeCard(id: string) {
        setCards(cards.filter(card => card.id !== id));
    }

    function updateCard(id: string, updates: Partial<CardData>) {
        setCards(
            cards.map(card => (card.id === id ? { ...card, ...updates } : card))
        );
    }

    const collapseAll = useCallback(() => {
        setCards(prevCards =>
            prevCards.map(card => ({ ...card, collapsed: true }))
        );
    }, []);

    const expandAll = useCallback(() => {
        setCards(prevCards =>
            prevCards.map(card => ({ ...card, collapsed: false }))
        );
    }, []);

    useEffect(() => {
        isClientRef.current = true;
        // Apply dark mode class on mount
        if (isDark) {
            document.documentElement.classList.add('dark');
        }
    }, [isDark]);

    useEffect(() => {
        if (!isClientRef.current) return;

        function handleKeydown(e: KeyboardEvent) {
            if (!e.ctrlKey || !e.altKey) return;
            const key = e.key.toLowerCase();

            if (key === 'p') {
                e.preventDefault();
                addCard();
            } else if (key === 'c') {
                e.preventDefault();
                collapseAll();
            } else if (key === 'u') {
                e.preventDefault();
                expandAll();
            }
        }

        window.addEventListener('keydown', handleKeydown);
        return () => window.removeEventListener('keydown', handleKeydown);
    }, [addCard, collapseAll, expandAll]);

    useEffect(() => {
        if (isClientRef.current) {
            localStorage.setItem('dark-mode', isDark.toString());
            if (isDark) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    }, [isDark]);

    useEffect(() => {
        if (isClientRef.current && cards.length > 0) {
            localStorage.setItem('draggable-cards', JSON.stringify(cards));
        }
    }, [cards]);

    function handleDragStart(index: number) {
        setDraggedIndex(index);
    }

    function handleDragOver(e: React.DragEvent, index: number) {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newCards = [...cards];
        const draggedCard = newCards[draggedIndex];
        newCards.splice(draggedIndex, 1);
        newCards.splice(index, 0, draggedCard);
        setCards(newCards);
        setDraggedIndex(index);
    }

    function handleDragEnd() {
        setDraggedIndex(null);
    }

    function deleteAll() {
        if (confirm('Sei sicuro di voler eliminare tutti i pazienti?')) {
            setCards([]);
            localStorage.removeItem('draggable-cards');
        }
    }

    function moveCardUp(id: string) {
        const index = cards.findIndex(c => c.id === id);
        if (index > 0) {
            const newCards = [...cards];
            const temp = newCards[index];
            newCards[index] = newCards[index - 1];
            newCards[index - 1] = temp;
            setCards(newCards);
        }
    }

    function moveCardDown(id: string) {
        const index = cards.findIndex(c => c.id === id);
        if (index < cards.length - 1) {
            const newCards = [...cards];
            const temp = newCards[index];
            newCards[index] = newCards[index + 1];
            newCards[index + 1] = temp;
            setCards(newCards);
        }
    }

    function exportCardsJson() {
        try {
            const dataStr = JSON.stringify(cards, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const date = new Date().toISOString().slice(0, 10);
            a.href = url;
            a.download = `erflow-cards-${date}.json`;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (e) {
            alert('Errore durante esportazione JSON');
        }
    }

    function importCardsFromJson(text: string) {
        try {
            const parsed = JSON.parse(text);
            if (!Array.isArray(parsed)) {
                alert('Formato JSON non valido: attesa una lista di pazienti');
                return;
            }
            const restored = parsed.map((c: Partial<CardData>) => {
                const base = createDefaultCard();
                return {
                    ...base,
                    ...c,
                    id:
                        typeof c.id === 'string' && c.id.trim()
                            ? c.id
                            : base.id,
                    color:
                        c.color === 'rosso' ||
                        c.color === 'giallo' ||
                        c.color === 'blu' ||
                        c.color === 'verde' ||
                        c.color === 'bianco'
                            ? c.color
                            : base.color,
                    moved:
                        c.moved === 'R' || c.moved === 'D' || c.moved === ' '
                            ? c.moved
                            : base.moved,
                    location:
                        c.location === 'OT1' ||
                        c.location === 'OT2' ||
                        c.location === 'COR' ||
                        c.location === 'ACQ' ||
                        c.location === 'TRI' ||
                        c.location === 'OBI1' ||
                        c.location === 'OBI2' ||
                        c.location === 'OBI3' ||
                        c.location === ' '
                            ? (c.location as CardData['location'])
                            : base.location,
                    collapsed: !!c.collapsed
                } as CardData;
            });
            setCards(restored);
        } catch (e) {
            alert('JSON non valido');
        }
    }

    async function importCardsFromClipboard() {
        try {
            const text = await navigator.clipboard.readText();
            // Fake parser: each non-empty line becomes a basic card
            const lines = text
                .split(/\r?\n/)
                .map(l => l.trim())
                .filter(Boolean);
            if (lines.length === 0) {
                alert('Appunti vuoti o non parsabili');
                return;
            }
            const newCards = lines.map(line => {
                const base = createDefaultCard();
                return {
                    ...base,
                    patientName: line,
                    patology: '',
                    content: line
                } as CardData;
            });
            setCards(prev => [...prev, ...newCards]);
        } catch (e) {
            alert('Impossibile leggere dagli appunti');
        }
    }

    const filteredCards = cards.filter(card =>
        card.patientName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const colorCounts = {
        rosso: cards.filter(c => c.color === 'rosso').length,
        giallo: cards.filter(c => c.color === 'giallo').length,
        blu: cards.filter(c => c.color === 'blu').length,
        verde: cards.filter(c => c.color === 'verde').length,
        bianco: cards.filter(c => c.color === 'bianco').length,
        total: cards.length
    };

    return (
        <div
            className="min-h-screen p-6 print:bg-white print:p-0"
            style={{ backgroundColor: isDark ? 'black' : 'white' }}
        >
            <div className="max-w-full mx-auto space-y-6">
                <div className="flex items-center justify-between print:hidden gap-4">
                    <div className="flex items-center gap-3">
                        <h1
                            className="text-3xl font-bold"
                            style={{ color: isDark ? 'white' : 'black' }}
                        >
                            E.R. Flow
                        </h1>
                        <a
                            href="https://github.com/emilianobruni/erflow"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:opacity-70 transition-opacity"
                            aria-label="GitHub Repository"
                        >
                            <Github
                                className="w-6 h-6"
                                style={{ color: isDark ? 'white' : 'black' }}
                            />
                        </a>
                    </div>

                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Cerca per nome paziente..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="pl-10 bg-white! text-black! border-gray-300"
                            style={{
                                backgroundColor: 'white',
                                color: 'black'
                            }}
                        />
                    </div>

                    <ActionButtons
                        isDark={isDark}
                        onToggleDark={() => setIsDark(!isDark)}
                        onCollapseAll={collapseAll}
                        onExpandAll={expandAll}
                        onDeleteAll={deleteAll}
                        onAddCard={addCard}
                        onExportJson={exportCardsJson}
                        onImportJson={importCardsFromJson}
                        onImportClipboard={importCardsFromClipboard}
                        colorCounts={colorCounts}
                    />
                </div>

                <div className="space-y-4">
                    {filteredCards.map((card, index) => (
                        <div
                            key={card.id}
                            onDragOver={e => handleDragOver(e, index)}
                        >
                            <DraggableCard
                                card={card}
                                onUpdate={updates =>
                                    updateCard(card.id, updates)
                                }
                                onRemove={() => removeCard(card.id)}
                                onMoveUp={() => moveCardUp(card.id)}
                                onMoveDown={() => moveCardDown(card.id)}
                                canMoveUp={index > 0}
                                canMoveDown={index < filteredCards.length - 1}
                                onDragStart={() => handleDragStart(index)}
                                onDragEnd={handleDragEnd}
                            />
                        </div>
                    ))}
                </div>

                {filteredCards.length === 0 && cards.length > 0 && (
                    <div
                        className="text-center py-12 print:hidden"
                        style={{ color: isDark ? '#94a3b8' : '#64748b' }}
                    >
                        Nessun paziente trovato con il nome &quot;{searchQuery}
                        &quot;.
                    </div>
                )}

                {cards.length === 0 && (
                    <div
                        className="text-center py-12 print:hidden"
                        style={{ color: isDark ? '#94a3b8' : '#64748b' }}
                    >
                        Ancora nessun paziente. Premi su &quot;Aggiungi
                        paziente&quot; per crearne uno.
                    </div>
                )}

                <div className="flex items-center justify-between print:hidden gap-4">
                    <div className="flex items-center gap-4">
                        <a
                            href="https://github.com/emilianobruni/erflow"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:opacity-70 transition-opacity"
                            aria-label="GitHub Repository"
                        >
                            <Github
                                className="w-5 h-5"
                                style={{ color: isDark ? 'white' : 'black' }}
                            />
                        </a>
                        <span
                            className="text-sm"
                            style={{ color: isDark ? '#94a3b8' : '#64748b' }}
                        >
                            © 2025-{new Date().getFullYear()} - Emiliano Bruni
                        </span>
                    </div>
                    <ActionButtons
                        isDark={isDark}
                        onToggleDark={() => setIsDark(!isDark)}
                        onCollapseAll={collapseAll}
                        onExpandAll={expandAll}
                        onDeleteAll={deleteAll}
                        onAddCard={addCard}
                        onExportJson={exportCardsJson}
                        onImportJson={importCardsFromJson}
                        onImportClipboard={importCardsFromClipboard}
                    />
                </div>
            </div>
        </div>
    );
}
