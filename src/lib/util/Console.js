const { Console } = require('console');
const { inspect } = require('util');
const Colors = require('./Colors');
const Timestamp = require('./Timestamp');
const constants = require('./constants');
const { mergeDefault } = require('./util');

/**
 * Klasa's console class, extends NodeJS Console class.
 */
class KlasaConsole extends Console {

	/**
	 * @typedef {Object} KlasaConsoleConfig
	 * @property {KlasaConsoleColorStyles} [colors]
	 * @property {NodeJS.WritableStream} [stdout]
	 * @property {NodeJS.WritableStream} [stderr]
	 * @property {(boolean|string)} [timestamps]
	 * @property {boolean} [useColor]
	 * @memberof KlasaConsole
	 */

	/**
	 * @typedef {Object} KlasaConsoleColorStyles Time is for the timestamp of the log, message is for the actual output.
	 * @property {KlasaConsoleColorObjects} debug An object containing a message and time color object
	 * @property {KlasaConsoleColorObjects} error An object containing a message and time color object
	 * @property {KlasaConsoleColorObjects} log An object containing a message and time color object
	 * @property {KlasaConsoleColorObjects} verbose An object containing a message and time color object
	 * @property {KlasaConsoleColorObjects} warn An object containing a message and time color object
	 * @property {KlasaConsoleColorObjects} wtf An object containing a message and time Color Object
	 * @memberof KlasaConsole
	 */

	/**
	 * @typedef {Object} KlasaConsoleColorObjects
	 * @property {string} [type='log'] The method from Console this color object should call
	 * @property {KlasaConsoleMessageObject} message A message object containing colors and styles
	 * @property {KlasaConsoleTimeObject} time A time object containing colors and styles
	 * @memberof KlasaConsole
	 */

	/**
	 * @typedef {Object} KlasaConsoleMessageObject
	 * @property {KlasaConsoleColorTypes} background The background color. Can be a basic string like "red", a hex string, or a RGB array
	 * @property {KlasaConsoleColorTypes} text The text color. Can be a basic string like "red", a hex string, or a RGB array
	 * @property {KlasaConsoleStyleTypes} style A style string from KlasaConsoleStyleTypes
	 * @memberof KlasaConsole
	 */

	/**
	 * @typedef {Object} KlasaConsoleTimeObject
	 * @property {KlasaConsoleColorTypes} background The background color. Can be a basic string like "red", a hex string, or a RGB array
	 * @property {KlasaConsoleColorTypes} text The text color. Can be a basic string like "red", a hex string, a RGB array, or HSL array
	 * @property {KlasaConsoleStyleTypes} style A style string from KlasaConsoleStyleTypes
	 * @memberof KlasaConsole
	 */

	/**
	 * @typedef {*} KlasaConsoleColorTypes - All the valid color types.
	 * @property {string} black
	 * @property {string} red
	 * @property {string} green
	 * @property {string} yellow
	 * @property {string} blue
	 * @property {string} magenta
	 * @property {string} cyan
	 * @property {string} gray
	 * @property {string} grey
	 * @property {string} lightgray
	 * @property {string} lightgrey
	 * @property {string} lightred
	 * @property {string} lightgreen
	 * @property {string} lightyellow
	 * @property {string} lightblue
	 * @property {string} lightmagenta
	 * @property {string} lightcyan
	 * @property {string} white
	 * @property {string} #008000 green
	 * @property {string} #008000 green
	 * @property {Array} [255,0,0] red
	 * @property {Array} [229,50%,50%] blue
	 * @memberof KlasaConsole
	 */

	/**
	 * @typedef {*} KlasaConsoleStyleTypes
	 * @property {string} normal
	 * @property {string} bold
	 * @property {string} dim
	 * @property {string} italic
	 * @property {string} underline
	 * @property {string} inverse
	 * @property {string} hidden
	 * @property {string} strikethrough
	 * @memberof KlasaConsole
	 */

	/**
	 * Constructs our KlasaConsole instance
	 * @since 0.4.0
	 * @param {KlasaClient} client The client this console is for
	 * @param {KlasaConsoleConfig} [options] The options for the klasa console
	 */
	constructor(client, options = {}) {
		options = mergeDefault(constants.DEFAULTS.CONSOLE, options);

		super(options.stdout, options.stderr);

		/**
		 * The client this Console was created with
		 * @since 0.5.0
		 * @name KlasaConsole#client
		 * @type {KlasaClient}
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: client });

		/**
		 * The standard output stream for this console, defaulted to process.stderr.
		 * @since 0.4.0
		 * @name KlasaConsole#stdout
		 * @type {NodeJS.WritableStream}
		 * @readonly
		 */
		Object.defineProperty(this, 'stdout', { value: options.stdout });

		/**
		 * The standard error output stream for this console, defaulted to process.stderr.
		 * @since 0.4.0
		 * @name KlasaConsole#stderr
		 * @type {NodeJS.WritableStream}
		 * @readonly
		 */
		Object.defineProperty(this, 'stderr', { value: options.stderr });

		/**
		 * Whether or not timestamps should be enabled for this console.
		 * @since 0.5.0
		 * @type {Timestamp}
		 */
		this.template = options.timestamps !== false ? new Timestamp(options.timestamps === true ? 'YYYY-MM-DD HH:mm:ss' : options.timestamps) : null;

		/**
		 * Whether or not this console should use colors.
		 * @since 0.4.0
		 * @type {boolean}
		 */
		this.useColors = typeof options.useColor === 'undefined' ? this.stdout.isTTY || false : options.useColor;

		/**
		 * The colors for this console.
		 * @since 0.4.0
		 * @name KlasaConsole#colors
		 * @type {(boolean|KlasaConsoleColorStyles)}
		 */
		this.colors = options.colors;
	}


	/**
	 * Logs everything to the console/writable stream.
	 * @since 0.4.0
	 * @param {*} data The data we want to print
	 * @param {string} [type="log"] The type of log, particularly useful for coloring
	 */
	write(data, type = 'log') {
		data = KlasaConsole._flatten(data, this.useColors);
		const color = this.colors[type.toLowerCase()] || {};
		const timestamp = this.template ? `${this.timestamp(`[${this.template}]`, color.time || {})} ` : '';
		const shard = this.client.shard ? `${this.shard(`[${this.client.shard.id}]`, color.shard)} ` : '';
		super[color.type || 'log'](data.split('\n').map(str => `${timestamp}${shard}${this.messages(str, color.message)}`).join('\n'));
	}

	/**
	 * Calls a log write with everything to the console/writable stream.
	 * @since 0.4.0
	 * @param {...*} data The data we want to print
	 * @returns {void}
	 */
	log(...data) {
		this.write(data, 'log');
	}

	/**
	 * Calls a warn write with everything to the console/writable stream.
	 * @since 0.4.0
	 * @param {...*} data The data we want to print
	 * @returns {void}
	 */
	warn(...data) {
		this.write(data, 'warn');
	}

	/**
	 * Calls an error write with everything to the console/writable stream.
	 * @since 0.4.0
	 * @param {...*} data The data we want to print
	 * @returns {void}
	 */
	error(...data) {
		this.write(data, 'error');
	}

	/**
	 * Calls a debug write with everything to the console/writable stream.
	 * @since 0.4.0
	 * @param {...*} data The data we want to print
	 * @returns {void}
	 */
	debug(...data) {
		this.write(data, 'debug');
	}

	/**
	 * Calls a verbose write with everything to the console/writable stream.
	 * @since 0.4.0
	 * @param {...*} data The data we want to print
	 * @returns {void}
	 */
	verbose(...data) {
		this.write(data, 'verbose');
	}

	/**
	 * Calls a wtf (what a terrible failure) write with everything to the console/writable stream.
	 * @since 0.4.0
	 * @param {...*} data The data we want to print
	 * @returns {void}
	 */
	wtf(...data) {
		this.write(data, 'wtf');
	}

	/**
	 * Logs everything to the console/writable stream.
	 * @since 0.4.0
	 * @param {string} input The timestamp to maybe format
	 * @param {ColorsFormatOptions} time The time format used for coloring
	 * @returns {string}
	 */
	timestamp(input, time) {
		if (!this.useColors) return input;
		return Colors.format(input, time);
	}

	/**
	 * Logs everything to the console/writable stream.
	 * @since 0.5.0
	 * @param {string} input The shard string to maybe format
	 * @param {ColorsFormatOptions} shard The shard format used for coloring
	 * @returns {string}
	 */
	shard(input, shard) {
		if (!this.useColors) return input;
		return Colors.format(input, shard);
	}

	/**
	 * Logs everything to the console/writable stream.
	 * @since 0.4.0
	 * @param {string} input The data we want to print
	 * @param {ColorsFormatOptions} message The message format used for coloring
	 * @returns {string}
	 */
	messages(input, message) {
		if (!this.useColors) return input;
		return Colors.format(input, message);
	}

	/**
	 * Flattens our data into a readable string.
	 * @since 0.4.0
	 * @param {*} data Some data to flatten
	 * @param {boolean} useColors Whether or not the inspection should color the output
	 * @returns {string}
	 * @private
	 */
	static _flatten(data, useColors) {
		if (typeof data === 'undefined' || typeof data === 'number' || data === null) return String(data);
		if (typeof data === 'string') return data;
		if (typeof data === 'object') {
			if (Array.isArray(data)) return data.join('\n');
			return data.stack || data.message || inspect(data, { depth: 0, colors: useColors });
		}
		return String(data);
	}

}

module.exports = KlasaConsole;
