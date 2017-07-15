exports.run = async (client, msg) => {
	if (!client.user.bot) return msg.reply('Why would you need an invite link for a selfbot...');

	return msg.sendMessage([
		`To add ${client.user.username} to your discord guild:`,
		client.invite,
		[
			'```The above link is generated requesting the minimum permissions required to use every command currently.',
			"I know not all permissions are right for every server, so don't be afraid to uncheck any of the boxes.",
			'If you try to use a command that requires more permissions than the bot is granted, it will let you know.```'
		].join(' '),
		'Please file an issue at <https://github.com/dirigeants/klasa> if you find any bugs.'
	]);
};

exports.conf = {
	enabled: true,
	runIn: ['text'],
	aliases: [],
	permLevel: 0,
	botPerms: [],
	requiredFuncs: [],
	requiredSettings: []
};

exports.help = {
	name: 'invite',
	description: 'Displays the join server link of the bot.',
	usage: '',
	usageDelim: ''
};
