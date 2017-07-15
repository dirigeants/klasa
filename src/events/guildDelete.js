exports.run = (client, guild) => {
	if (guild.available) client.settingGateway.destroy(guild.id).catch(() => null);
};
