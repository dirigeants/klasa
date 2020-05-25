import { Inhibitor, KlasaMessage, Command, InhibitorStore } from 'klasa';

export default class extends Inhibitor {

	public constructor(store: InhibitorStore, directory: string, files: readonly string[]) {
		super(store, directory, files, { spamProtection: true });
	}

	public run(message: KlasaMessage, command: Command): void {
		if (this.client.owners.has(message.author) || command.cooldown <= 0) return;

		let existing;

		try {
			existing = this.client.finalizers.get('commandCooldown')?.getCooldown(message, command);
		} catch (err) {
			return;
		}

		if (existing && existing.limited) throw message.language.get('INHIBITOR_COOLDOWN', Math.ceil(existing.remainingTime / 1000), command.cooldownLevel !== 'author');
	}

}
