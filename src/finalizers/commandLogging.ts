import { Finalizer, Command } from 'klasa';
import { ChannelType } from '@klasa/dapi-types';
import { Colors } from '@klasa/console';

import type { Message } from '@klasa/core';
import type { Stopwatch } from '@klasa/stopwatch';

export default class extends Finalizer {

	private reprompted = [new Colors({ background: 'blue' }), new Colors({ background: 'red' })];
	private user = new Colors({ background: 'yellow', text: 'black' });
	private shard = new Colors({ background: 'cyan', text: 'black' });
	private dm = new Colors({ background: 'magenta' });
	private text = new Colors({ background: 'green', text: 'black' })

	public run(message: Message, command: Command, _response: Message[], timer: Stopwatch): void {
		const shard = message.guild ? message.guild.shard.id : 0;
		this.client.emit('log', [
			this.shard.format(`[${shard}]`),
			`${command.name}(${message.args.join(', ')})`,
			this.reprompted[Number(message.reprompted)].format(`[${timer.stop()}]`),
			this.user.format(`${message.author.username}[${message.author.id}]`),
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			message.channel.type === ChannelType.DM ? this.dm.format('Direct Messages') : this.text.format(`${message.guild!.name}[${message.guild!.id}]`)
		].join(' '));
	}

	public init(): void {
		this.enabled = this.client.options.commands.logging;
	}

}
