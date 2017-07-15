/* eslint-disable no-restricted-syntax */
exports.run = (client, msg) => {
	for (const [key, value] of client.commandMessages) {
		if (key === msg.id) return client.commandMessages.delete(key);
		if (msg.id === value.response.id) return client.commandMessages.delete(key);
	}
	return false;
};
