exports.run = (client, msgs) => {
	for (const msg of msgs.values()) client.emit('messageDelete', msg); // eslint-disable-line no-restricted-syntax
};
