/* eslint-disable id-length */

/**
 * The Colors class that manages the colors displayed in the console.
 */
class Colors {

	/**
	 * @typedef {Object} ColorsFormatOptions
	 * @property {(string|string[])} style The style or styles to apply
	 * @property {ColorsFormatType} background The format for the background
	 * @property {ColorsFormatType} text The format for the text
	 */

	/**
	 * @typedef {(string|number|string[]|number[])} ColorsFormatType
	 */

	/**
	 * @typedef {Object} ColorsFormatData
	 * @property {string[]} opening The opening format data styles
	 * @property {string[]} closing The closing format data styles
	 * @private
	 */

	/**
	 * Constructs our Colors instance
	 * @param {ColorsFormatOptions} [options = {}] The options for this format
	 * @since 0.4.0
	 */
	constructor(options = {}) {
		const { opening, closing } = this.constructor.text(options.text, this.constructor.background(options.background, this.constructor.style(options.style)));

		/**
		 * The opening tags
		 * @type {string}
		 * @since 0.5.0
		 */
		this.opening = this.constructor.useColors ? `\u001B[${opening.join(';')}m` : '';

		/**
		 * The closing tags
		 * @type {string}
		 * @since 0.5.0
		 */
		this.closing = this.constructor.useColors ? `\u001B[${closing.join(';')}m` : '';
	}

	/**
	 * Format a string
	 * @since 0.4.0
	 * @param {string} string The string to format
	 * @returns {string}
	 */
	format(string) {
		return this.opening + string + this.closing;
	}

	/**
	 * Convert hex to RGB
	 * @since 0.4.0
	 * @param {string} hex The hexadecimal value to parse
	 * @returns {number[]}
	 */
	static hexToRGB(hex) {
		if (hex.length === 3) hex = hex.split('').map(char => char + char).join('');
		const integer = parseInt(hex, 16);
		// eslint-disable-next-line no-bitwise
		return [(integer >> 16) & 0xFF, (integer >> 8) & 0xFF, integer & 0xFF];
	}

	/**
	 * Convert hue to RGB
	 * @since 0.4.0
	 * @param {number} p Value number one
	 * @param {number} q Value number two
	 * @param {number} t Value number three
	 * @returns {number}
	 */
	static hueToRGB(p, q, t) {
		if (t < 0) t += 1;
		if (t > 1) t -= 1;
		if (t < 1 / 6) return p + ((q - p) * 6 * t);
		if (t < 1 / 2) return q;
		if (t < 2 / 3) return p + ((q - p) * ((2 / 3) - t) * 6);
		return p;
	}

	/**
	 * Format HSL to RGB
	 * @since 0.4.0
	 * @param {(number[]|string[])} formatArray The array to format
	 * @returns {number[]}
	 */
	static hslToRGB([h, s, l]) {
		if (s === '0%' && typeof l === 'number') return [l, l, l];
		if (typeof h !== 'number' || typeof s !== 'number' || typeof l !== 'number') {
			throw new TypeError(`The input for Colors.hslToRGB must be number[], received: [${typeof h}, ${typeof s}, ${typeof l}]`);
		}

		const q = l < 0.5 ? l * (1 + s) : (l + s) - (l * s);
		const p = (2 * l) - q;
		return [Colors.hueToRGB(p, q, h + (1 / 3)), Colors.hueToRGB(p, q, h), Colors.hueToRGB(p, q, h - (1 / 3))];
	}

	/**
	 * Format an array into a string
	 * @since 0.4.0
	 * @param {(number[]|string[])} formatArray The array to format
	 * @returns {string}
	 */
	static formatArray([pos1, pos2, pos3]) {
		if (typeof pos1 === 'string' && typeof pos2 === 'string' && pos3 === 'string') {
			const exec1 = /(\d{1,3})%?/.exec(pos1);
			if (exec1 === null) throw new TypeError('Invalid argument parsed at first position. Expected a parsable numeric value.');
			const exec2 = /(\d{1,3})%?/.exec(pos2);
			if (exec2 === null) throw new TypeError('Invalid argument parsed at second position. Expected a parsable numeric value.');
			const exec3 = /(\d{1,3})%?/.exec(pos3);
			if (exec3 === null) throw new TypeError('Invalid argument parsed at third position. Expected a parsable numeric value.');

			return `38;2;${Colors.hslToRGB([parseInt(exec1[1]), parseInt(exec2[1]), parseInt(exec3[1])]).join(';')}`;
		}
		return `38;2;${pos1};${pos2};${pos3}`;
	}

	/**
	 * Apply the style
	 * @since 0.5.0
	 * @param {(string|string[])} styles The style or styles to apply
	 * @param {ColorsFormatData} [data={}] The data
	 * @returns {ColorsFormatData}
	 * @private
	 */
	static style(styles, { opening = [], closing = [] } = {}) {
		if (styles) {
			if (!Array.isArray(styles)) styles = [styles];
			for (let style in styles) {
				style = style.toLowerCase();
				if (!(style in Colors.STYLES)) continue;
				opening.push(Colors.STYLES[style]);
				closing.push(Colors.CLOSE[style]);
			}
		}
		return { opening, closing };
	}

	/**
	 * Apply the background
	 * @since 0.5.0
	 * @param {ColorsFormatType} background The background to apply
	 * @param {ColorsFormatData} [data={}] The data
	 * @returns {ColorsFormatData}
	 * @private
	 */
	static background(background, { opening = [], closing = [] } = {}) {
		if (background) {
			if (typeof background === 'number') {
				if (!Number.isInteger(background)) background = Math.round(background);

				const number = (background >= 0x100 && background <= 0xFFF) || (background >= 0x100000 && background <= 0xFFFFFF) ?
					background.toString(16) :
					null;

				if (number !== null) {
					opening.push(`48;5;${background}`);
					closing.push(Colors.CLOSE.background);
				}
			} else if (Array.isArray(background)) {
				opening.push(Colors.formatArray([background[0], background[1], background[2]]));
				closing.push(`\u001B[${Colors.CLOSE.background}`);
			} else if (typeof background === 'string' && background.toLowerCase() in Colors.BACKGROUNDS) {
				opening.push(Colors.BACKGROUNDS[background.toLowerCase()]);
				closing.push(Colors.CLOSE.background);
			}
		}
		return { opening, closing };
	}

	/**
	 * Apply the text format
	 * @since 0.5.0
	 * @param {ColorsFormatType} text The text format to apply
	 * @param {ColorsFormatData} [data={}] The data
	 * @returns {ColorsFormatData}
	 * @private
	 */
	static text(text, { opening = [], closing = [] } = {}) {
		if (text) {
			if (typeof text === 'number') {
				if (!Number.isInteger(text)) text = Math.round(text);
				opening.push(`38;5;${text}`);
				closing.push(Colors.CLOSE.text);
			} else if (Array.isArray(text)) {
				opening.push(Colors.formatArray([text[0], text[1], text[2]]));
				closing.push(Colors.CLOSE.text);
			} else if (typeof text === 'string' && text.toLowerCase() in Colors.TEXTS) {
				opening.push(Colors.TEXTS[text.toLowerCase()]);
				closing.push(Colors.CLOSE.text);
			}
		}
		return { opening, closing };
	}

}

/**
 * Determines if this class should be constructed with colors or not
 * @type {?boolean}
 * @static
 * @private
 */
Colors.useColors = null;

/**
 * The close codes
 * @type {object}
 * @static
 * @private
 */
Colors.CLOSE = {
	normal: 0,
	bold: 22,
	dim: 22,
	italic: 23,
	underline: 24,
	inverse: 27,
	hidden: 28,
	strikethrough: 29,
	text: 39,
	background: 49
};

/**
 * The style codes
 * @type {object}
 * @static
 * @private
 */
Colors.STYLES = {
	normal: 0,
	bold: 1,
	dim: 2,
	italic: 3,
	underline: 4,
	inverse: 7,
	hidden: 8,
	strikethrough: 9
};

/**
 * The text codes
 * @type {object}
 * @static
 * @private
 */
Colors.TEXTS = {
	black: 30,
	red: 31,
	green: 32,
	yellow: 33,
	blue: 34,
	magenta: 35,
	cyan: 36,
	lightgray: 37,
	lightgrey: 37,
	gray: 90,
	grey: 90,
	lightred: 91,
	lightgreen: 92,
	lightyellow: 93,
	lightblue: 94,
	lightmagenta: 95,
	lightcyan: 96,
	white: 97
};

/**
 * The background codes
 * @type {object}
 * @static
 * @private
 */
Colors.BACKGROUNDS = {
	black: 40,
	red: 41,
	green: 42,
	yellow: 43,
	blue: 44,
	magenta: 45,
	cyan: 46,
	gray: 47,
	grey: 47,
	lightgray: 100,
	lightgrey: 100,
	lightred: 101,
	lightgreen: 102,
	lightyellow: 103,
	lightblue: 104,
	lightmagenta: 105,
	lightcyan: 106,
	white: 107
};

/* eslint-enable id-length */

module.exports = Colors;
