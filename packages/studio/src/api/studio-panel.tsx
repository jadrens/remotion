import React, {useEffect, useState} from 'react';
import {createPortal} from 'react-dom';
import {useRemotionEnvironment} from 'remotion';
import {studioPanelStore} from '../state/studio-panels';

const stopPropagation = (e: React.SyntheticEvent) => {
	// The panel is portaled out of the canvas, but React events still bubble
	// through the composition tree. Don't let the canvas treat clicks in the
	// sidebar as clicks on the video.
	e.stopPropagation();
};

const container: React.CSSProperties = {
	display: 'flex',
	flexDirection: 'column',
	flex: 1,
	minHeight: 0,
	overflow: 'auto',
};

/*
 * @description Renders its children as a tab in the right sidebar of the Remotion Studio. The children stay inside the composition's React tree, so hooks like useCurrentFrame() keep working. Renders nothing outside of the Studio.
 * @see [Documentation](https://www.remotion.dev/docs/studio/studio-panel)
 */
export const StudioPanel: React.FC<{
	readonly id: string;
	readonly title: string;
	readonly children: React.ReactNode;
}> = ({id, title, children}) => {
	const {isStudio, isRendering} = useRemotionEnvironment();
	const enabled = isStudio && !isRendering;
	const [element, setElement] = useState<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!enabled) {
			return;
		}

		const el = studioPanelStore.register(id, title);
		setElement(el);
		return () => {
			studioPanelStore.unregister(el);
			setElement(null);
		};
		// The title is updated below without re-registering the panel
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [enabled, id]);

	useEffect(() => {
		if (element) {
			studioPanelStore.setTitle(element, title);
		}
	}, [element, title]);

	if (!element) {
		return null;
	}

	return createPortal(
		<div
			style={container}
			onPointerDown={stopPropagation}
			onMouseDown={stopPropagation}
			onClick={stopPropagation}
			onDoubleClick={stopPropagation}
			onContextMenu={stopPropagation}
		>
			{children}
		</div>,
		element,
	);
};
