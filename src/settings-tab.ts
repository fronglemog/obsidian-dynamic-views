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
			.setName('Open random file in new pane')
			.setDesc('When opening a random file from Bases view, open it in a new pane instead of the same pane')
			.addToggle((toggle) =>
				toggle
					.setValue(settings.openRandomInNewPane)
					.onChange(async (value) => {
						await this.plugin.persistenceManager.setGlobalSettings({ openRandomInNewPane: value });
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
			.setName('Timestamp reflects')
			.setDesc('Which timestamp to display in card metadata')
			.addDropdown((dropdown) =>
				dropdown
					.addOption('mtime', 'Modified time')
					.addOption('ctime', 'Created time')
					.addOption('sort-based', 'Sort method')
					.setValue(settings.timestampDisplay)
					.onChange(async (value: 'ctime' | 'mtime' | 'sort-based') => {
						await this.plugin.persistenceManager.setGlobalSettings({ timestampDisplay: value });
					})
			);

		new Setting(containerEl)
			.setName('Omit first line in text preview')
			.setDesc('Always skip first line in text previews (in addition to automatic omission when first line matches title/filename)')
			.addToggle((toggle) =>
				toggle
					.setValue(settings.omitFirstLine)
					.onChange(async (value) => {
						await this.plugin.persistenceManager.setGlobalSettings({ omitFirstLine: value });
					})
			);

		new Setting(containerEl)
			.setName('Date created property')
			.setDesc('Set property to show as created timestamp. Will use file created time if unavailable. Must be a date or datetime property.')
			.addText((text) =>
				text
					.setPlaceholder('Comma-separated if multiple')
					.setValue(settings.createdProperty)
					.onChange(async (value) => {
						await this.plugin.persistenceManager.setGlobalSettings({ createdProperty: value });
					})
			);

		new Setting(containerEl)
			.setName('Date modified property')
			.setDesc('Set property to show as modified timestamp. Will use file modified time if unavailable. Must be a date or datetime property.')
			.addText((text) =>
				text
					.setPlaceholder('Comma-separated if multiple')
					.setValue(settings.modifiedProperty)
					.onChange(async (value) => {
						await this.plugin.persistenceManager.setGlobalSettings({ modifiedProperty: value });
					})
			);

		// Appearance section
		const appearanceHeading = new Setting(containerEl)
			.setName('Appearance')
			.setHeading();
		appearanceHeading.settingEl.addClass('dynamic-views-appearance-heading');

		const appearanceDesc = containerEl.createEl('p', { cls: 'setting-item-description' });
		appearanceDesc.appendText('Appearance settings can be configured via ');
		appearanceDesc.createEl('a', {
			text: 'Style Settings',
			href: 'obsidian://show-plugin?id=obsidian-style-settings'
		});
		appearanceDesc.appendText('.');

		const appearanceTip = containerEl.createEl('p', { cls: 'setting-item-description' });
		appearanceTip.appendText('Tip: Run ');
		appearanceTip.createEl('em').appendText('Show style settings view');
		appearanceTip.appendText(' command to open settings in a tab.');

		// Default settings for new views section
		new Setting(containerEl)
			.setName('Default settings for new views')
			.setHeading();

		const defaultViewSettings = this.plugin.persistenceManager.getDefaultViewSettings();

		new Setting(containerEl)
			.setName('Metadata display (1)')
			.setDesc('Property to show in first metadata position')
			.addText((text) =>
				text
					.setPlaceholder('Property name (e.g., file tags, status)')
					.setValue(defaultViewSettings.metadataDisplay1)
					.onChange(async (value) => {
						await this.plugin.persistenceManager.setDefaultViewSettings({ metadataDisplay1: value });
					})
			);

		new Setting(containerEl)
			.setName('Metadata display (2)')
			.setDesc('Property to show in second metadata position')
			.addText((text) =>
				text
					.setPlaceholder('Property name (leave empty for none)')
					.setValue(defaultViewSettings.metadataDisplay2)
					.onChange(async (value) => {
						await this.plugin.persistenceManager.setDefaultViewSettings({ metadataDisplay2: value });
					})
			);

		new Setting(containerEl)
			.setName('Show (1) and (2) side-by-side')
			.setDesc('Display first two metadata items horizontally')
			.addToggle((toggle) =>
				toggle
					.setValue(defaultViewSettings.metadataLayout12SideBySide)
					.onChange(async (value) => {
						await this.plugin.persistenceManager.setDefaultViewSettings({ metadataLayout12SideBySide: value });
					})
			);

		new Setting(containerEl)
			.setName('Metadata display (3)')
			.setDesc('Property to show in third metadata position')
			.addText((text) =>
				text
					.setPlaceholder('Property name (leave empty for none)')
					.setValue(defaultViewSettings.metadataDisplay3)
					.onChange(async (value) => {
						await this.plugin.persistenceManager.setDefaultViewSettings({ metadataDisplay3: value });
					})
			);

		new Setting(containerEl)
			.setName('Metadata display (4)')
			.setDesc('Property to show in fourth metadata position')
			.addText((text) =>
				text
					.setPlaceholder('Property name (leave empty for none)')
					.setValue(defaultViewSettings.metadataDisplay4)
					.onChange(async (value) => {
						await this.plugin.persistenceManager.setDefaultViewSettings({ metadataDisplay4: value });
					})
			);

		new Setting(containerEl)
			.setName('Show (3) and (4) side-by-side')
			.setDesc('Display third and fourth metadata items horizontally')
			.addToggle((toggle) =>
				toggle
					.setValue(defaultViewSettings.metadataLayout34SideBySide)
					.onChange(async (value) => {
						await this.plugin.persistenceManager.setDefaultViewSettings({ metadataLayout34SideBySide: value });
					})
			);

		new Setting(containerEl)
			.setName('Title property')
			.setDesc('Default property to show as file title')
			.addText((text) =>
				text
					.setPlaceholder('Comma-separated if multiple')
					.setValue(defaultViewSettings.titleProperty)
					.onChange(async (value) => {
						await this.plugin.persistenceManager.setDefaultViewSettings({ titleProperty: value });
					})
			);

		new Setting(containerEl)
			.setName('Show text preview')
			.setDesc('Show text preview by default')
			.addToggle((toggle) =>
				toggle
					.setValue(defaultViewSettings.showTextPreview)
					.onChange(async (value) => {
						await this.plugin.persistenceManager.setDefaultViewSettings({ showTextPreview: value });
					})
			);

		new Setting(containerEl)
			.setName('Text preview property')
			.setDesc('Default property to show as text preview')
			.addText((text) =>
				text
					.setPlaceholder('Comma-separated if multiple')
					.setValue(defaultViewSettings.descriptionProperty)
					.onChange(async (value) => {
						await this.plugin.persistenceManager.setDefaultViewSettings({ descriptionProperty: value });
					})
			);

		new Setting(containerEl)
			.setName('Use note content if text preview property unavailable')
			.setDesc('Fall back to note content when text preview property is not set')
			.addToggle((toggle) =>
				toggle
					.setValue(defaultViewSettings.fallbackToContent)
					.onChange(async (value) => {
						await this.plugin.persistenceManager.setDefaultViewSettings({ fallbackToContent: value });
					})
			);

		new Setting(containerEl)
			.setName('Show thumbnails')
			.setDesc('Show thumbnails by default')
			.addToggle((toggle) =>
				toggle
					.setValue(defaultViewSettings.showThumbnails)
					.onChange(async (value) => {
						await this.plugin.persistenceManager.setDefaultViewSettings({ showThumbnails: value });
					})
			);

		new Setting(containerEl)
			.setName('Image property')
			.setDesc('Default property to show as thumbnail')
			.addText((text) =>
				text
					.setPlaceholder('Comma-separated if multiple')
					.setValue(defaultViewSettings.imageProperty)
					.onChange(async (value) => {
						await this.plugin.persistenceManager.setDefaultViewSettings({ imageProperty: value });
					})
			);

		new Setting(containerEl)
			.setName('Use in-note images if image property unavailable')
			.setDesc('Fall back to image embeds from note content')
			.addToggle((toggle) =>
				toggle
					.setValue(defaultViewSettings.fallbackToEmbeds)
					.onChange(async (value) => {
						await this.plugin.persistenceManager.setDefaultViewSettings({ fallbackToEmbeds: value });
					})
			);

		new Setting(containerEl)
			.setName('List marker')
			.setDesc('Default marker style for list view')
			.addDropdown((dropdown) =>
				dropdown
					.addOption('bullet', 'Bullet')
					.addOption('number', 'Number')
					.addOption('none', 'None')
					.setValue(defaultViewSettings.listMarker)
					.onChange(async (value: string) => {
						await this.plugin.persistenceManager.setDefaultViewSettings({ listMarker: value });
					})
			);

		new Setting(containerEl)
			.setName('View height')
			.setDesc('Default maximum height of results area in pixels. Set to 0 for unlimited.')
			.addText((text) =>
				text
					.setPlaceholder('500')
					.setValue(String(defaultViewSettings.queryHeight))
					.onChange(async (value) => {
						const num = parseInt(value);
						if (!isNaN(num) && num >= 0) {
							await this.plugin.persistenceManager.setDefaultViewSettings({ queryHeight: num });
						}
					})
			);
	}
}
