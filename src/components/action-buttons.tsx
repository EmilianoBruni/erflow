'use client';

import { Button } from '@/components/ui/button';
import { Plus, ChevronsDown, ChevronsUp, Trash2 } from 'lucide-react';

interface ActionButtonsProps {
    isDark: boolean;
    onToggleDark: () => void;
    onCollapseAll: () => void;
    onExpandAll: () => void;
    onDeleteAll: () => void;
    onAddCard: () => void;
}

export function ActionButtons({
    isDark,
    onToggleDark,
    onCollapseAll,
    onExpandAll,
    onDeleteAll,
    onAddCard
}: ActionButtonsProps) {
    const baseCardStyles = {
        backgroundColor: isDark ? '#1e293b' : 'white',
        color: isDark ? 'white' : 'black',
        borderColor: isDark ? '#475569' : '#cbd5e1'
    };

    return (
        <div className="flex gap-2">
            <Button
                onClick={onToggleDark}
                variant="outline"
                size="sm"
                className="border"
                style={baseCardStyles}
                title={isDark ? 'Modalità chiara' : 'Modalità scura'}
            >
                {isDark ? '🌙' : '☀️'}
            </Button>
            <Button
                onClick={onCollapseAll}
                variant="outline"
                size="sm"
                className="border bg-transparent"
                style={baseCardStyles}
                title="Collassa tutti"
            >
                <ChevronsUp className="w-4 h-4" />
            </Button>
            <Button
                onClick={onExpandAll}
                variant="outline"
                size="sm"
                className="border bg-transparent"
                style={baseCardStyles}
                title="Espandi tutti"
            >
                <ChevronsDown className="w-4 h-4" />
            </Button>
            <Button
                onClick={onDeleteAll}
                variant="outline"
                size="sm"
                className="border bg-transparent"
                style={{
                    backgroundColor: isDark ? '#7f1d1d' : '#fecaca',
                    color: isDark ? '#fecaca' : '#7f1d1d',
                    borderColor: isDark ? '#991b1b' : '#f87171'
                }}
                title="Elimina tutti"
            >
                <Trash2 className="w-4 h-4" />
            </Button>
            <Button
                onClick={onAddCard}
                style={{
                    backgroundColor: isDark ? 'white' : 'blue',
                    color: isDark ? 'black' : 'white'
                }}
                title="Aggiungi paziente"
            >
                <Plus className="w-4 h-4" />
            </Button>
        </div>
    );
}
