const { Console } = require('console');
const Colors = require('./Colors');
const moment = require('moment');
const { inspect } = require('util');

/**
 * Klasa's console class, extends NodeJS Console class.
 */
class KlasaConsole extends Console {

	/**
	 * @memberof KlasaConsole
	 * @typedef {object} Colors - Time is for the timestamp of the log, message is for the actual output.
	 * @property {KlasaConsoleColorObjects} debug An object containing a message and time color object.
	 * @property {KlasaConsoleColorObjects} error An object containing a message and time color object.
	 * @property {KlasaConsoleColorObjects} log An object containing a message and time color object.
	 * @property {KlasaConsoleColorObjects} verbose An object containing a message and time color object.
	 * @property {KlasaConsoleColorObjects} warn An object containing a message and time color object.
	 * @property {KlasaConsoleColorObjects} wtf An object containing a message and time Color Object.
	 */

	/**
	 * @memberof KlasaConsole
	 * @typedef {object} KlasaConsoleColorObjects
	 * @property {string} [type='log'] The method from Console this color object should call.
	 * @property {KlasaConsoleMessageObject} message A message object containing colors and styles.
	 * @property {KlasaConsoleTimeObject} time A time object containing colors and styles.
	 */

	/**
	 * @memberof KlasaConsole
	 * @typedef {object} KlasaConsoleMessageObject
	 * @property {BackgroundColorTypes} background The background color. Can be a basic string like "red", a hex string, or a RGB array.
	 * @property {TextColorTypes} text The text color. Can be a basic string like "red", a hex string, or a RGB array.
	 * @property {StyleTypes} style A style string from StyleTypes.
	 */

	/**
	 * @memberof KlasaConsole
	 * @typedef {object} KlasaConsoleTimeObject
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
	 * Constructs our KlasaConsole instance
	 * @since 0.4.0
	 * @param  {KlasaConsoleConfig} [options] The options for the klasa console.
	 */
	constructor({ stdout = process.stdout, stderr = process.stderr, useColor, colors = {}, timestamps = true }) {
		super(stdout, stderr);

		/**
		 * The standard output stream for this console, defaulted to process.stderr.
		 * @since 0.4.0
		 * @name KlasaConsole#stdout
		 * @type {WritableStream}
		 */
		Object.defineProperty(this, 'stdout', { value: stdout });

		/**
		 * The standard error output stream for this console, defaulted to process.stderr.
		 * @since 0.4.0
		 * @name KlasaConsole#stderr
		 * @type {WritableStream}
		 */
		Object.defineProperty(this, 'stderr', { value: stderr });

		/**
		 * Whether or not timestamps should be enabled for this console.
		 * @since 0.4.0
		 * @type {(boolean|string)}
		 */
		this.timestamps = timestamps === true ? 'YYYY-MM-DD HH:mm:ss' : timestamps;

		/**
		 * Whether or not this console should use colors.
		 * @since 0.4.0
		 * @type {boolean}
		 */
		this.useColors = typeof useColor === 'undefined' ? this.stdout.isTTY || false : useColor;

		/**
		 * The colors for this console.
		 * @since 0.4.0
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
	 * Logs everything to the console/writable stream.
	 * @since 0.4.0
	 * @param  {*} data The data we want to print.
	 * @param  {string} [type="log"] The type of log, particularly useful for coloring.
	 */
	write(data, type = 'log') {
		data = KlasaConsole.flatten(data, this.useColors);
		const color = this.colors[type.toLowerCase()] || {};
		const message = color.message || {};
		const time = color.time || {};
		const timestamp = this.timestamps ? `${this.timestamp(`[${moment().format(this.timestamps)}]`, time)} ` : '';
		super[color.type || 'log'](data.split('\n').map(str => `${timestamp}${this.messages(str, message)}`).join('\n'));
	}

	/**
	 * Calls a log write with everything to the console/writable stream.
	 * @since 0.4.0
	 * @param {...*} data The data we want to print.
	 * @returns {void}
	 */
	log(...data) {
		this.write(data, 'log');
	}

	/**
	 * Calls a warn write with everything to the console/writable stream.
	 * @since 0.4.0
	 * @param {...*} data The data we want to print.
	 * @returns {void}
	 */
	warn(...data) {
		this.write(data, 'warn');
	}

	/**
	 * Calls an error write with everything to the console/writable stream.
	 * @since 0.4.0
	 * @param {...*} data The data we want to print.
	 * @returns {void}
	 */
	error(...data) {
		this.write(data, 'error');
	}

	/**
	 * Calls a debug write with everything to the console/writable stream.
	 * @since 0.4.0
	 * @param {...*} data The data we want to print.
	 * @returns {void}
	 */
	debug(...data) {
		this.write(data, 'debug');
	}

	/**
	 * Calls a verbose write with everything to the console/writable stream.
	 * @since 0.4.0
	 * @param {...*} data The data we want to print.
	 * @returns {void}
	 */
	verbose(...data) {
		this.write(data, 'verbose');
	}

	/**
	 * Calls a wtf (what a terrible failure) write with everything to the console/writable stream.
	 * @since 0.4.0
	 * @param {...*} data The data we want to print.
	 * @returns {void}
	 */
	wtf(...data) {
		this.write(data, 'wtf');
	}

	/**
	 * Logs everything to the console/writable stream.
	 * @since 0.4.0
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
	 * @since 0.4.0
	 * @param {string} string The data we want to print.
	 * @param {string} message The message format used for coloring
	 * @returns {string}
	 */
	messages(string, message) {
		if (!this.useColors) return string;
		return Colors.format(string, message);
	}

	/**
	 * Flattens our data into a readable string.
	 * @since 0.4.0
	 * @param {*} data Some data to flatten
	 * @param {boolean} useColors Whether or not the inspection should color the output
	 * @return {string}
	 */
	static flatten(data, useColors) {
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
