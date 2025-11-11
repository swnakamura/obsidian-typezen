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
			// this.center = document.querySelector('.workspace-split.mod-root');
			// this.tabBar = this.center?.querySelectorAll('.workspace-split.mod-root .workspace-tab-header-container') ?? null;
		})
	}

	async onload() {	
		// turn off interface
		this.registerEvent(this.app.workspace.on('editor-change', (editor, info) => {
			if (this.elementsShown) {
				this.elementsShown = false;
				[this.ribbon, this.leftSide, this.rightSide].forEach((element) => element?.classList.add('typezen-hide'));

				this.tabBar?.forEach((element) => element?.classList.add('typezen-hide'));
			}
		}))

		// turn on interface — only when the cursor leaves the editor/text area
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
				this.elementsShown = true;
				[this.ribbon, this.leftSide, this.rightSide].forEach((element) => element?.classList.remove('typezen-hide'));
				this.tabBar?.forEach((element) => element?.classList.remove('typezen-hide'));
			}
		})
	}
}
