import type { Settings } from '../types';
import { CardRenderer } from '../shared/card-renderer';
import { transformDatacoreResults } from '../shared/data-transform';

interface CardViewProps {
    results: any[];
    displayedCount: number;
    settings: Settings;
    viewMode: 'card' | 'masonry';
    sortMethod: string;
    isShuffled: boolean;
    snippets: Record<string, string>;
    images: Record<string, string | string[]>;
    hasImageAvailable: Record<string, boolean>;
    focusableCardIndex: number;
    containerRef: any;
    updateLayoutRef: any;
    app: any;
    dc: any;
    onCardClick?: (path: string, newLeaf: boolean) => void;
    onFocusChange?: (index: number) => void;
}

export function CardView({
    results,
    displayedCount,
    settings,
    viewMode,
    sortMethod,
    isShuffled,
    snippets,
    images,
    hasImageAvailable,
    focusableCardIndex,
    containerRef,
    updateLayoutRef,
    app,
    dc,
    onCardClick,
    onFocusChange
}: CardViewProps) {
    // Transform Datacore results to CardData array
    const allCards = transformDatacoreResults(
        results,
        dc,
        settings,
        sortMethod,
        isShuffled,
        snippets,
        images,
        hasImageAvailable
    );

    // Apply display limit
    const cards = allCards.slice(0, displayedCount);

    return (
        <CardRenderer
            cards={cards}
            settings={settings}
            viewMode={viewMode}
            sortMethod={sortMethod}
            isShuffled={isShuffled}
            focusableCardIndex={focusableCardIndex}
            containerRef={containerRef}
            updateLayoutRef={updateLayoutRef}
            app={app}
            onCardClick={onCardClick}
            onFocusChange={onFocusChange}
        />
    );
}
