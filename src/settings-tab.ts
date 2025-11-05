import { App, PluginSettingTab, Setting } from 'obsidian';
import type DynamicViewsPlugin from '../main';

export class DynamicViewsSettingTab extends PluginSettingTab {
	plugin: DynamicViewsPlugin;

	constructor(app: App, plugin: DynamicViewsPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		const settings = this.plugin.persistenceManager.getGlobalSettings();

		new Setting(containerEl)
			.setName('Open file action')
			.setDesc('How files should open when clicked')
			.addDropdown((dropdown) =>
				dropdown
					.addOption('card', 'Press on card')
					.addOption('title', 'Press on title')
					.setValue(settings.openFileAction)
					.onChange(async (value: 'card' | 'title') => {
						await this.plugin.persistenceManager.setGlobalSettings({ openFileAction: value });
					})
			);

		new Setting(containerEl)
			.setName('Thumbnail cache size')
			.setDesc('Size of cached thumbnails (affects performance and quality)')
			.addDropdown((dropdown) =>
				dropdown
					.addOption('minimal', 'Minimal')
					.addOption('small', 'Small')
					.addOption('balanced', 'Balanced')
					.addOption('large', 'Large')
					.addOption('unlimited', 'Unlimited')
					.setValue(settings.thumbnailCacheSize)
					.onChange(async (value: 'minimal' | 'small' | 'balanced' | 'large' | 'unlimited') => {
						await this.plugin.persistenceManager.setGlobalSettings({ thumbnailCacheSize: value });
					})
			);

		new Setting(containerEl)
			.setName('Minimum masonry columns')
			.setDesc('Minimum number of columns in masonry view')
			.addDropdown((dropdown) =>
				dropdown
					.addOption('1', 'One')
					.addOption('2', 'Two')
					.setValue(String(settings.minMasonryColumns))
					.onChange(async (value: string) => {
						await this.plugin.persistenceManager.setGlobalSettings({ minMasonryColumns: Number(value) });
					})
			);

		new Setting(containerEl)
			.setName('Card background')
			.setDesc('Card background appearance')
			.addDropdown((dropdown) =>
				dropdown
					.addOption('tinted', 'Tinted')
					.addOption('transparent', 'Transparent')
					.setValue(settings.addCardBackground)
					.onChange(async (value: 'tinted' | 'transparent') => {
						await this.plugin.persistenceManager.setGlobalSettings({ addCardBackground: value });
					})
			);
	}
}
