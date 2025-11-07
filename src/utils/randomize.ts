import { App, Notice, View } from 'obsidian';
import type { DynamicViewsCardView } from '../bases/card-view';
import type { DynamicViewsMasonryView } from '../bases/masonry-view';

type DynamicBasesView = DynamicViewsCardView | DynamicViewsMasonryView;

// Internal Obsidian base-view structure
interface BasesViewWrapper extends View {
	basesView?: {
		type: string;
		data?: {
			data: unknown[];
		};
		onDataUpdated?: () => void;
	};
}

/**
 * Fisher-Yates shuffle algorithm
 * Shuffles array in place and returns it
 */
export function shuffleArray<T>(array: T[]): T[] {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

/**
 * Get the active Bases view if it's a dynamic-views view (Grid or Masonry)
 */
export function getActiveDynamicViewsBase(app: App): DynamicBasesView | null {
	const activeLeaf = app.workspace.activeLeaf;
	if (!activeLeaf) return null;

	const view = activeLeaf.view;

	// Check if it's a dynamic-views Bases view
	// The view type will be 'base-view' but we need to check the specific type
	if (view.getViewType() === 'base-view') {
		// Access the Bases view instance through the view's properties
		const wrapper = view as BasesViewWrapper;
		const basesView = wrapper.basesView;

		if (basesView?.type === 'dynamic-views-card' || basesView?.type === 'dynamic-views-masonry') {
			return basesView as DynamicBasesView;
		}
	}

	return null;
}

/**
 * Open a random file from the currently visible entries in the active Bases view
 */
export async function openRandomFile(app: App, openInNewPane: boolean): Promise<void> {
	const basesView = getActiveDynamicViewsBase(app);

	if (!basesView) {
		new Notice('No dynamic-views Bases view is currently active');
		return;
	}

	const entries = basesView.data?.data;
	if (!entries || entries.length === 0) {
		new Notice('No files in current view');
		return;
	}

	// Pick a random entry
	const randomIndex = Math.floor(Math.random() * entries.length);
	const randomEntry = entries[randomIndex];

	if (!randomEntry.file) {
		new Notice('Selected entry has no file');
		return;
	}

	// Open the file
	const filePath = randomEntry.file.path;
	await app.workspace.openLinkText(filePath, '', openInNewPane);
}

/**
 * Toggle shuffle state on the active Bases view
 */
export function toggleShuffleActiveView(app: App): void {
	const basesView = getActiveDynamicViewsBase(app);

	if (!basesView) {
		new Notice('No dynamic-views Bases view is currently active');
		return;
	}

	// Toggle the shuffle state
	const currentState = basesView.isShuffled ?? false;
	basesView.isShuffled = !currentState;

	// Trigger re-render
	basesView.onDataUpdated();

	const newState = basesView.isShuffled;
	new Notice(newState ? 'View shuffled' : 'Shuffle disabled');
}
