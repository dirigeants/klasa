module.exports = (client, msg, error) => {
	if (error.stack) {
		client.emit('error', error.stack);
	} else if (error.message) {
		msg.sendCode('JSON', error.message).catch(err => client.emit('error', err));
	} else {
		msg.sendMessage(error).catch(err => client.emit('error', err));
	}
};
