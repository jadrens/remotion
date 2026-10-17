import React, {useLayoutEffect, useRef} from 'react';
import {STUDIO_PANEL_CLASS_NAME} from '../state/studio-panels';

// `.css-reset *` sets the font and color on every element. Panel content is
// user code, so let it inherit instead, like on a normal page.
const panelCss = `.css-reset .${STUDIO_PANEL_CLASS_NAME}, .css-reset .${STUDIO_PANEL_CLASS_NAME} * {
	font-family: inherit;
	font-size: inherit;
	line-height: inherit;
	color: inherit;
}`;

const host: React.CSSProperties = {
	display: 'flex',
	flexDirection: 'column',
	flex: 1,
	minHeight: 0,
};

// Attaches the element that a <StudioPanel> portals into. The element is
// moved back out on unmount but not destroyed, so the panel keeps its state.
export const StudioPanelHost: React.FC<{
	readonly element: HTMLDivElement;
}> = ({element}) => {
	const ref = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		const {current} = ref;
		if (!current) {
			return;
		}

		current.appendChild(element);
		return () => {
			if (element.parentNode === current) {
				current.removeChild(element);
			}
		};
	}, [element]);

	return (
		<>
			<style>{panelCss}</style>
			<div ref={ref} style={host} />
		</>
	);
};
