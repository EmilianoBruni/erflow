'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
    Plus,
    ChevronsDown,
    ChevronsUp,
    Trash2,
    Download,
    Upload
} from 'lucide-react';

interface ActionButtonsProps {
    isDark: boolean;
    onToggleDark: () => void;
    onCollapseAll: () => void;
    onExpandAll: () => void;
    onDeleteAll: () => void;
    onAddCard: () => void;
    onExportJson?: () => void;
    onImportJson?: (text: string) => void;
    onImportClipboard?: (text: string) => void;
    colorCounts?: {
        rosso: number;
        giallo: number;
        blu: number;
        verde: number;
        bianco: number;
        total: number;
    };
}

export function ActionButtons({
    isDark,
    onToggleDark,
    onCollapseAll,
    onExpandAll,
    onDeleteAll,
    onAddCard,
    onExportJson,
    onImportJson,
    onImportClipboard,
    colorCounts
}: ActionButtonsProps) {
    const baseCardStyles = {
        backgroundColor: isDark ? '#1e293b' : 'white',
        color: isDark ? 'white' : 'black',
        borderColor: isDark ? '#475569' : '#cbd5e1',
        cursor: 'pointer'
    };

    const fileInputRef = React.useRef<HTMLInputElement | null>(null);
    const menuRef = React.useRef<HTMLDivElement | null>(null);
    const pasteTextareaRef = React.useRef<HTMLTextAreaElement | null>(null);
    const [showPasteModal, setShowPasteModal] = React.useState(false);
    const [showImportMenu, setShowImportMenu] = React.useState(false);
    const [pasteText, setPasteText] = React.useState('');

    React.useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target as Node)
            ) {
                setShowImportMenu(false);
            }
        }
        if (showImportMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, [showImportMenu]);

    React.useEffect(() => {
        if (showPasteModal && pasteTextareaRef.current) {
            pasteTextareaRef.current.focus();
            pasteTextareaRef.current.select();
        }
    }, [showPasteModal]);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const text = String(reader.result || '');
            if (onImportJson) onImportJson(text);
            if (fileInputRef.current) fileInputRef.current.value = '';
        };
        reader.readAsText(file);
    }

    return (
        <>
            <div className="flex gap-2 items-center">
                {colorCounts && (
                    <div className="flex gap-1.5 items-center mr-2">
                        <div
                            className="flex items-center justify-center rounded-full w-7 h-7 text-white font-semibold text-sm"
                            style={{ backgroundColor: '#ef4444' }}
                            title="Rosso"
                        >
                            {colorCounts.rosso}
                        </div>
                        <div
                            className="flex items-center justify-center rounded-full w-7 h-7 text-white font-semibold text-sm"
                            style={{ backgroundColor: '#eab308' }}
                            title="Giallo"
                        >
                            {colorCounts.giallo}
                        </div>
                        <div
                            className="flex items-center justify-center rounded-full w-7 h-7 text-white font-semibold text-sm"
                            style={{ backgroundColor: '#3b82f6' }}
                            title="Blu"
                        >
                            {colorCounts.blu}
                        </div>
                        <div
                            className="flex items-center justify-center rounded-full w-7 h-7 text-white font-semibold text-sm"
                            style={{ backgroundColor: '#22c55e' }}
                            title="Verde"
                        >
                            {colorCounts.verde}
                        </div>
                        <div
                            className="flex items-center justify-center rounded-full w-7 h-7 text-white font-semibold text-sm"
                            style={{
                                backgroundColor: isDark ? 'white' : 'black',
                                color: isDark ? 'black' : 'white'
                            }}
                            title="Bianco"
                        >
                            {colorCounts.bianco}
                        </div>
                        <div className="w-px h-6 bg-gray-300 mx-1"></div>
                        <div
                            className="flex items-center justify-center rounded-full w-8 h-8 font-bold text-sm"
                            style={{
                                backgroundColor: isDark ? '#475569' : '#cbd5e1',
                                color: isDark ? 'white' : 'black'
                            }}
                            title="Totale"
                        >
                            {colorCounts.total}
                        </div>
                    </div>
                )}
                <Button
                    onClick={onToggleDark}
                    variant="outline"
                    size="sm"
                    className="border cursor-pointer"
                    style={baseCardStyles}
                    title={isDark ? 'Modalità chiara' : 'Modalità scura'}
                >
                    {isDark ? '🌙' : '☀️'}
                </Button>
                <Button
                    onClick={onCollapseAll}
                    variant="outline"
                    size="sm"
                    className="border bg-transparent cursor-pointer"
                    style={baseCardStyles}
                    title="Collassa tutti (CTRL-ALT-C)"
                >
                    <ChevronsUp className="w-4 h-4" />
                </Button>
                <Button
                    onClick={onExpandAll}
                    variant="outline"
                    size="sm"
                    className="border bg-transparent cursor-pointer"
                    style={baseCardStyles}
                    title="Espandi tutti (CTRL-ALT-U)"
                >
                    <ChevronsDown className="w-4 h-4" />
                </Button>
                <Button
                    onClick={onDeleteAll}
                    variant="outline"
                    size="sm"
                    className="border bg-transparent cursor-pointer"
                    style={{
                        backgroundColor: isDark ? '#7f1d1d' : '#fecaca',
                        color: isDark ? '#fecaca' : '#7f1d1d',
                        borderColor: isDark ? '#991b1b' : '#f87171',
                        cursor: 'pointer'
                    }}
                    title="Elimina tutti"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
                <Button
                    onClick={onAddCard}
                    className="cursor-pointer"
                    style={{
                        backgroundColor: isDark ? 'white' : 'blue',
                        color: isDark ? 'black' : 'white',
                        cursor: 'pointer'
                    }}
                    title="Aggiungi paziente (CTRL-ALT-P)"
                >
                    <Plus className="w-4 h-4" />
                </Button>
                {onExportJson && (
                    <Button
                        onClick={onExportJson}
                        variant="outline"
                        size="sm"
                        className="border bg-transparent cursor-pointer"
                        style={baseCardStyles}
                        title="Esporta pazienti in JSON"
                    >
                        <Download className="w-4 h-4" />
                    </Button>
                )}
                {(onImportJson || onImportClipboard) && (
                    <div className="relative" ref={menuRef}>
                        <Button
                            variant="outline"
                            size="sm"
                            className="border bg-transparent cursor-pointer"
                            style={baseCardStyles}
                            onClick={() => setShowImportMenu(prev => !prev)}
                            aria-haspopup="menu"
                            aria-expanded={showImportMenu}
                        >
                            <Upload className="w-4 h-4" />
                        </Button>
                        {showImportMenu && (
                            <div
                                className="absolute right-0 mt-2 w-48 rounded-md border shadow-lg bg-white text-black z-10"
                                role="menu"
                            >
                                <button
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 flex items-center gap-2"
                                    onClick={() => {
                                        setShowImportMenu(false);
                                        fileInputRef.current?.click();
                                    }}
                                >
                                    <Upload className="w-4 h-4" /> Importa JSON
                                </button>
                                <button
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 flex items-center gap-2"
                                    onClick={() => {
                                        setShowImportMenu(false);
                                        setShowPasteModal(true);
                                    }}
                                >
                                    <Upload className="w-4 h-4" /> Importa da
                                    Testo
                                </button>
                            </div>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="application/json,.json"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>
                )}
            </div>

            {showPasteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div
                        className="w-full max-w-2xl rounded-lg bg-white text-black shadow-lg p-4 space-y-3"
                        role="dialog"
                        aria-modal="true"
                    >
                        <h2 className="text-lg font-semibold">
                            Incolla qui il contenuto da DSEO
                        </h2>
                        <form
                            className="space-y-3"
                            onSubmit={e => {
                                e.preventDefault();
                                if (onImportClipboard) {
                                    onImportClipboard(pasteText);
                                }
                                setPasteText('');
                                setShowPasteModal(false);
                            }}
                        >
                            <textarea
                                ref={pasteTextareaRef}
                                value={pasteText}
                                onChange={e => setPasteText(e.target.value)}
                                className="w-full h-64 border border-slate-300 rounded p-2 text-sm text-black"
                                placeholder="Incolla qui il contenuto da DSEO..."
                            />
                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setPasteText('');
                                        setShowPasteModal(false);
                                    }}
                                >
                                    Annulla
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={!pasteText.trim()}
                                >
                                    Importa
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
