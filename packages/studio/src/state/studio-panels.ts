export type StudioPanelEntry = {
	readonly id: string;
	readonly title: string;
	// Owned by the store, not by the sidebar, so the panel content stays
	// mounted while another sidebar tab is selected.
	readonly element: HTMLDivElement;
};

// Lets panel content inherit fonts and colors, see StudioPanelHost
export const STUDIO_PANEL_CLASS_NAME = '__remotion-studio-panel';

type Listener = () => void;

let panels: readonly StudioPanelEntry[] = [];
const listeners = new Set<Listener>();

const emitChange = () => {
	for (const listener of listeners) {
		listener();
	}
};

export const studioPanelStore = {
	subscribe(listener: Listener): () => void {
		listeners.add(listener);
		return () => {
			listeners.delete(listener);
		};
	},
	getSnapshot(): readonly StudioPanelEntry[] {
		return panels;
	},
	register(id: string, title: string): HTMLDivElement {
		const element = document.createElement('div');
		element.className = STUDIO_PANEL_CLASS_NAME;
		element.style.fontSize = '13px';
		element.style.display = 'flex';
		element.style.flexDirection = 'column';
		element.style.flex = '1';
		element.style.minHeight = '0';
		panels = [...panels.filter((p) => p.id !== id), {id, title, element}];
		emitChange();
		return element;
	},
	setTitle(element: HTMLDivElement, title: string): void {
		if (!panels.some((p) => p.element === element && p.title !== title)) {
			return;
		}

		panels = panels.map((p) => (p.element === element ? {...p, title} : p));
		emitChange();
	},
	unregister(element: HTMLDivElement): void {
		panels = panels.filter((p) => p.element !== element);
		emitChange();
	},
};
