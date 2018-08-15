module.exports = {
	boolean: require('./Boolean'),
	channel: require('./Channel'),
	textchannel: require('./Channel'),
	voicechannel: require('./Channel'),
	categorychannel: require('./Channel'),
	guild: require('./Guild'),
	number: require('./Number'),
	integer: require('./Number'),
	float: require('./Number'),
	role: require('./Role'),
	string: require('./String'),
	url: require('./Url'),
	user: require('./User'),
	command: require('./Piece'),
	language: require('./Piece'),
	any: require('./base/SchemaType')
};
