exports.run = (client, old, msg) => {
	if (old.content !== msg.content && client.config.cmdEditing) client.emit('message', msg);
};
