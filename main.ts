import { App, Plugin, PluginManifest } from 'obsidian';

export default class TypezenPlugin extends Plugin {
	private elementsShown = true;

	private ribbon: HTMLElement | null; // .workspace-ribbon
	private leftSide: HTMLElement | null; // .workspace-split.mod-left-split
	private rightSide: HTMLElement | null; // .workspace-split.mod-right-split
	private tabBar: NodeListOf<Element> | null; // .workspace-tab-header-container
	// private center: HTMLElement | null; // .workspace-split.mod-root

	constructor(app: App, manifest: PluginManifest) {
		super(app, manifest);

		this.app.workspace.onLayoutReady(() => {
			this.ribbon = document.querySelector('.workspace-ribbon');
			this.leftSide = document.querySelector('.workspace-split.mod-left-split');
			this.rightSide = document.querySelector('.workspace-split.mod-right-split');
		})
	}

	async onload() {
		// turn off interface
		this.registerEvent(this.app.workspace.on('editor-change', (editor, info) => {
			if (this.elementsShown) {
				this.hideUI();
			}
		}));

		// turn on interface when focusing on search input
		this.registerDomEvent(this.app.workspace.containerEl, 'focusin', (event) => {
			const target = event.target as HTMLElement;
			if (target.closest('.search-input-container')) {
				this.showUI();
			}
		});

		this.app.workspace.containerEl.addEventListener('mousemove', (event) => {
			// If the cursor is still inside the editor/text area, keep zen mode active.
			const target = event.target as HTMLElement | null;
			const isInsideEditor = Boolean(target && (
				// common editor/content classes used by Obsidian / CodeMirror
				target.closest('.cm-editor, .cm-content')
			));
			if (isInsideEditor) {
				return;
			}

			if (!this.elementsShown) {
				// Only show UI when the window/document currently has focus.
				if (document.hasFocus && document.hasFocus()) {
					this.showUI();
				}
			}
		})

	}

	private ensureElements() {
		if (!this.ribbon) this.ribbon = document.querySelector('.workspace-ribbon');
		if (!this.leftSide) this.leftSide = document.querySelector('.workspace-split.mod-left-split');
		if (!this.rightSide) this.rightSide = document.querySelector('.workspace-split.mod-right-split');
	}

	private hideUI() {
		this.ensureElements();
		if (this.elementsShown) {
			this.elementsShown = false;
			[this.ribbon, this.leftSide, this.rightSide].forEach((element) => element?.classList.add('typezen-hide'));
		}
	}

	private showUI() {
		this.ensureElements();
		this.elementsShown = true;
		[this.ribbon, this.leftSide, this.rightSide].forEach((element) => element?.classList.remove('typezen-hide'));
	}
}
