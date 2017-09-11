const { Console } = require('console');
const Colors = require('./Colors');
const moment = require('moment');
const { inspect } = require('util');

/**
 * Klasa's console class, extends NodeJS Console class.
 */
class KlasaConsole extends Console {

	/**
	 * Constructs our KlasaConsole instance
	 * @param  {KlasaConsoleConfig} [options] The options for the klasa console.
	 */
	constructor({ stdout = process.stdout, stderr = process.stderr, useColor = true, colors = {}, timestamps = true }) {
		super(stdout, stderr);

		/**
		 * The standard output stream for this console, defaulted to process.stderr.
		 * @name KlasaConsole#stdout
		 * @type {WritableStream}
		 */
		Object.defineProperty(this, 'stdout', { value: stdout });

		/**
		 * The standard error output stream for this console, defaulted to process.stderr.
		 * @name KlasaConsole#stderr
		 * @type {WritableStream}
		 */
		Object.defineProperty(this, 'stderr', { value: stderr });

		/**
		 * Whether or not timestamps should be enabled for this console.
		 * @type {(boolean|string)}
		 */
		this.timestamps = timestamps === true ? 'YYYY-MM-DD HH:mm:ss' : timestamps;

		/**
		 * Whether or not this console should use colors.
		 * @type {boolean}
		 */
		this.useColors = useColor || this.stdout.isTTY || false;

		/**
		 * The colors for this console.
		 * @name KlasaConsole#colors
		 * @type  {boolean|Colors}
		 */
		this.colors = {
			debug: colors.debug || {
				type: 'log',
				message: { background: null, text: null, style: null },
				time: { background: 'magenta', text: null, style: null }
			},
			error: colors.error || {
				type: 'error',
				message: { background: null, text: null, style: null },
				time: { background: 'red', text: null, style: null }
			},
			log: colors.log || {
				type: 'log',
				message: { background: null, text: null, style: null },
				time: { background: 'blue', text: null, style: null }
			},
			verbose: colors.verbose || {
				type: 'log',
				message: { background: null, text: 'gray', style: null },
				time: { background: null, text: 'gray', style: null }
			},
			warn: colors.warn || {
				type: 'warn',
				message: { background: null, text: null, style: null },
				time: { background: 'lightyellow', text: 'black', style: null }
			},
			wtf: colors.wtf || {
				type: 'error',
				message: { background: null, text: 'red', style: null },
				time: { background: 'red', text: null, style: null }
			}
		};
	}

	/**
	 * @memberof KlasaConsole
	 * @typedef {object} Colors - Time is for the timestamp of the log, message is for the actual output.
	 * @property {ColorObjects} debug An object containing a message and time color object.
	 * @property {ColorObjects} error An object containing a message and time color object.
	 * @property {ColorObjects} log An object containing a message and time color object.
	 * @property {ColorObjects} verbose An object containing a message and time color object.
	 * @property {ColorObjects} warn An object containing a message and time color object.
	 * @property {ColorObjects} wtf An object containing a message and time Color Object.
	 */

	/**
	 * @memberof KlasaConsole
	 * @typedef {object} ColorObjects
	 * @property {MessageObject} message A message object containing colors and styles.
	 * @property {TimeObject} time A time object containing colors and styles.
	 */

	/**
	 * @memberof KlasaConsole
	 * @typedef {object} MessageObject
	 * @property {BackgroundColorTypes} background The background color. Can be a basic string like "red", a hex string, or a RGB array.
	 * @property {TextColorTypes} text The text color. Can be a basic string like "red", a hex string, or a RGB array.
	 * @property {StyleTypes} style A style string from StyleTypes.
	 */

	/**
	 * @memberof KlasaConsole
	 * @typedef {object} TimeObject
	 * @property {BackgroundColorTypes} background The background color. Can be a basic string like "red", a hex string, or a RGB array.
	 * @property {TextColorTypes} text The text color. Can be a basic string like "red", a hex string, a RGB array, or HSL array.
	 * @property {StyleTypes} style A style string from StyleTypes.
	 */

	/**
	 * @memberof KlasaConsole
	 * @typedef {*} TextColorTypes - All the valid color types.
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
	 */

	/**
	 * @memberof KlasaConsole
	 * @typedef {*} BackgroundColorTypes - One of these strings, HexStrings, RGB, or HSL are valid types.
	 * @property {string} black
	 * @property {string} red
	 * @property {string} green
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
	 * @property {Array} [255,0,0] red
	 * @property {Array} [229,50%,50%] blue
	 */

	/**
	 * @memberof KlasaConsole
	 * @typedef {*} StyleTypes
	 * @property {string} normal
	 * @property {string} bold
	 * @property {string} dim
	 * @property {string} italic
	 * @property {string} underline
	 * @property {string} inverse
	 * @property {string} hidden
	 * @property {string} strikethrough
	 */

	/**
	 * Logs everything to the console/writable stream.
	 * @param  {*} stuff The stuff we want to print.
	 * @param  {string} [type="log"] The type of log, particularly useful for coloring.
	 */
	write(stuff, type = 'log') {
		stuff = KlasaConsole.flatten(stuff, this.useColors);
		const color = this.colors[type.toLowerCase()] || {};
		const message = color.message || {};
		const time = color.time || {};
		const timestamp = this.timestamps ? `${this.timestamp(`[${moment().format(this.timestamps)}]`, time)} ` : '';
		super[color.type || 'log'](stuff.split('\n').map(str => `${timestamp}${this.messages(str, message)}`).join('\n'));
	}

	/**
	 * Calls a log write with everything to the console/writable stream.
	 * @param {...*} stuff The stuff we want to print.
	 * @returns {undefined}
	 */
	log(...stuff) {
		this.write(stuff, 'log');
	}

	/**
	 * Calls a warn write with everything to the console/writable stream.
	 * @param {...*} stuff The stuff we want to print.
	 * @returns {undefined}
	 */
	warn(...stuff) {
		this.write(stuff, 'warn');
	}

	/**
	 * Calls an error write with everything to the console/writable stream.
	 * @param {...*} stuff The stuff we want to print.
	 * @returns {undefined}
	 */
	error(...stuff) {
		this.write(stuff, 'error');
	}

	/**
	 * Calls a debug write with everything to the console/writable stream.
	 * @param {...*} stuff The stuff we want to print.
	 * @returns {undefined}
	 */
	debug(...stuff) {
		this.write(stuff, 'debug');
	}

	/**
	 * Calls a verbose write with everything to the console/writable stream.
	 * @param {...*} stuff The stuff we want to print.
	 * @returns {undefined}
	 */
	verbose(...stuff) {
		this.write(stuff, 'verbose');
	}

	/**
	 * Calls a wtf (what a terrible failure) write with everything to the console/writable stream.
	 * @param {...*} stuff The stuff we want to print.
	 * @returns {undefined}
	 */
	wtf(...stuff) {
		this.write(stuff, 'wtf');
	}

	/**
	 * Logs everything to the console/writable stream.
	 * @param {Date} timestamp The timestamp to maybe format
	 * @param {string} time The time format used for coloring
	 * @returns {string} 
	 */
	timestamp(timestamp, time) {
		if (!this.useColors) return timestamp;
		return Colors.format(timestamp, time);
	}

	/**
	 * Logs everything to the console/writable stream.
	 * @param {string} string The stuff we want to print.
	 * @param {string} message The message format used for coloring
	 * @returns {string}
	 */
	messages(string, message) {
		if (!this.useColors) return string;
		return Colors.format(string, message);
	}

	/**
	 * Flattens our data into a readable string.
	 * @param  {*} data Some data to flatten
	 * @param {boolean} useColors Whether or not the inspection should color the output
	 * @return {string}
	 */
	static flatten(data, useColors) {
		data = data.stack || data.message || data;
		if (typeof data === 'object' && typeof data !== 'string' && !Array.isArray(data)) data = inspect(data, { depth: 0, colors: useColors });
		if (Array.isArray(data)) data = data.join('\n');
		return data;
	}

}

module.exports = KlasaConsole;
