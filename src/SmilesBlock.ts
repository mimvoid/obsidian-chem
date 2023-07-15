import { MarkdownRenderChild, MarkdownPostProcessorContext } from 'obsidian';
import SmilesDrawer from 'smiles-drawer';
import { gDrawer } from './global/drawer';
import { ChemPluginSettings } from './settings/base';
import { addBlock, removeBlock } from './global/blocks';

export class SmilesBlock extends MarkdownRenderChild {
	constructor(
		private readonly el: HTMLElement,
		private readonly markdownSource: string,
		private readonly context: MarkdownPostProcessorContext,
		private readonly settings: ChemPluginSettings
	) {
		super(el); // important
		addBlock(this);
	}

	render() {
		//TODO: rendering animation

		this.el.empty();
		const rows = this.markdownSource
			.split('\n')
			.filter((row) => row.length > 0)
			.map((row) => row.trim());

		if (rows.length == 1) {
			const div = this.el.createDiv({ cls: 'chem-cell' });
			const svgcell = div.createSvg('svg');
			this.renderCell(rows[0], svgcell);
		} else {
			const table = this.el.createDiv({ cls: 'chem-table' });
			const maxWidth = this.settings.options?.width ?? 300;

			rows.forEach((row) => {
				const cell = table.createDiv({ cls: 'chem-cell' });
				const svgcell = cell.createSvg('svg');
				this.renderCell(row, svgcell);
				if (parseFloat(svgcell.style.width) > maxWidth)
					svgcell.style.width = `${maxWidth.toString()}px`;
			});

			table.style.gridTemplateColumns = `repeat(auto-fill, minmax(${
				this.settings.options.width?.toString() ?? '300'
			}px, 1fr)`;
		}
	}

	private renderCell = (source: string, target: SVGSVGElement) => {
		SmilesDrawer.parse(
			source,
			(tree: object) => {
				gDrawer.draw(
					tree,
					target,
					document.body.hasClass('theme-dark') &&
						!document.body.hasClass('theme-light')
						? this.settings.darkTheme
						: this.settings.lightTheme
				);
			},
			(error: object & { name: string; message: string }) => {
				console.log(error.name + ': ' + error.message);
			}
		);
		if (this.settings.options.scale == 0)
			target.style.width = `${this.settings.imgWidth.toString()}px`;
	};

	async onload() {
		this.render();
	}

	onunload() {
		removeBlock(this); // remove from global block list
	}
}
