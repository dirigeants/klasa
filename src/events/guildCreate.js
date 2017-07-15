exports.run = (client, guild) => {
	if (guild.available) client.settingGateway.create(guild).catch(e => client.emit('log', e, 'error'));
};
