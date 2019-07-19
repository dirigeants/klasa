const { TIME: { SECOND, MINUTE, DAY, DAYS, MONTHS, TIMESTAMP: { TOKENS } } } = require('./constants');

/* eslint-disable id-length, new-cap */

// Dates

const Y = time => String(time.getFullYear()).slice(0, 2);
const YYY = time => String(time.getFullYear());
const Q = time => String((time.getMonth() + 1) / 3);
const M = time => String(time.getMonth() + 1);
const MM = time => M(time).padStart(2, '0');
const MMM = time => MONTHS[time.getMonth()];
const D = time => String(time.getDate());
const DD = time => D(time).padStart(2, '0');
const DDD = time => {
	const start = new Date(time.getFullYear(), 0, 0);
	const diff = ((time.getMilliseconds() - start.getMilliseconds()) + (start.getTimezoneOffset() - time.getTimezoneOffset())) * MINUTE;
	return String(Math.floor(diff / DAY));
};
const d = time => {
	const day = D(time);
	if (day !== '11' && day.endsWith('1')) return `${day}st`;
	if (day !== '12' && day.endsWith('2')) return `${day}nd`;
	if (day !== '13' && day.endsWith('3')) return `${day}rd`;
	return `${day}th`;
};
const dd = time => DAYS[time.getDay()].slice(0, 2);
const ddd = time => DAYS[time.getDay()].slice(0, 3);
const dddd = time => DAYS[time.getDay()];
const X = time => String(time.valueOf() / SECOND);
const x = time => String(time.valueOf());

// Times

const H = time => String(time.getHours());
const HH = time => H(time).padStart(2, '0');
const h = time => String(time.getHours() % 12 || 12);
const hh = time => String(time.getHours() % 12 || 12).padStart(2, '0');
const a = time => time.getHours() < 12 ? 'am' : 'pm';
const A = time => time.getHours() < 12 ? 'AM' : 'PM';
const m = time => String(time.getMinutes());
const mm = time => m(time).padStart(2, '0');
const s = time => String(time.getSeconds());
const ss = time => s(time).padStart(2, '0');
const S = time => String(time.getMilliseconds());
const SS = time => SS(time).padStart(2, '0');
const SSS = time => SS(time).padStart(3, '0');

// Locales

const T = (time) => `${h(time)}:${mm(time)} ${A(time)}`;
const t = (time) => `${h(time)}:${mm(time)}:${ss(time)} ${A(time)}`;
const L = (time) => `${MM(time)}/${DD(time)}/${YYY(time)}`;
const l = (time) => `${M(time)}/${DD(time)}/${YYY(time)}`;
const LL = (time) => `${MMM(time)} ${DD(time)}, ${YYY(time)}`;
const ll = (time) => `${MMM(time).slice(0, 3)} ${DD(time)}, ${YYY(time)}`;
const LLL = (time) => `${LL(time)} ${T(time)}`;
const lll = (time) => `${ll(time)} ${T(time)}`;
const LLLL = (time) => `${dddd(time)}, ${LLL(time)}`;
const llll = (time) => `${ddd(time)} ${lll(time)}`;
const Z = time => {
	const offset = time.getTimezoneOffset();
	return `${offset >= 0 ? '+' : '-'}${String(offset / -60).padStart(2, '0')}:${String(offset % 60).padStart(2, '0')}`;
};

/* eslint-enable id-length, new-cap */

const tokens = new Map([
	['Y', Y],
	['YY', Y],
	['YYY', YYY],
	['YYYY', YYY],
	['Q', Q],
	['M', M],
	['MM', MM],
	['MMM', MMM],
	['MMMM', MMM],
	['D', D],
	['DD', DD],
	['DDD', DDD],
	['DDDD', DDD],
	['d', d],
	['dd', dd],
	['ddd', ddd],
	['dddd', dddd],
	['X', X],
	['x', x],
	['H', H],
	['HH', HH],
	['h', h],
	['hh', hh],
	['a', a],
	['A', A],
	['m', m],
	['mm', mm],
	['s', s],
	['ss', ss],
	['S', S],
	['SS', SS],
	['SSS', SSS],
	['T', T],
	['t', t],
	['L', L],
	['l', l],
	['LL', LL],
	['ll', ll],
	['LLL', LLL],
	['lll', lll],
	['LLLL', LLLL],
	['llll', llll],
	['Z', Z],
	['ZZ', Z]
]);

/**
 * Klasa's Timestamp class, parses the pattern once, displays the desired Date or UNIX timestamp with the selected pattern.
 */
class Timestamp {

	/**
	 * @typedef {Object} TimestampObject
	 * @property {string} type The type of the current variable
	 * @property {string} [content] The content of the type. Only accessible if the type is 'literal'
	 */

	/**
	 * Starts a new Timestamp and parses the pattern.
	 * @since 0.5.0
	 * @param {string} pattern The pattern to parse
	 */
	constructor(pattern) {
		/**
		 * The raw pattern
		 * @since 0.5.0
		 * @type {string}
		 */
		this.pattern = pattern;

		/**
		 * @since 0.5.0
		 * @type {TimestampObject[]}
		 * @private
		 */
		this._template = Timestamp._patch(pattern);
	}

	/**
	 * Display the current date with the current pattern.
	 * @since 0.5.0
	 * @param {(Date|number|string)} [time=new Date()] The time to display
	 * @returns {string}
	 */
	display(time = new Date()) {
		return Timestamp._display(this._template, time);
	}

	/**
	 * Display the current date utc with the current pattern.
	 * @since 0.5.0
	 * @param {(Date|number|string)} [time=new Date()] The time to display in utc
	 * @returns {string}
	 */
	displayUTC(time) {
		return Timestamp._display(this._template, Timestamp.utc(time));
	}

	/**
	 * Edits the current pattern.
	 * @since 0.5.0
	 * @param {string} pattern The new pattern for this instance
	 * @returns {this}
	 * @chainable
	 */
	edit(pattern) {
		this.pattern = pattern;
		this._template = Timestamp._patch(pattern);
		return this;
	}

	/**
	 * Defines the toString behavior of Timestamp.
	 * @returns {string}
	 */
	toString() {
		return this.display();
	}

	/**
	 * Display the current date with the current pattern.
	 * @since 0.5.0
	 * @param {string} pattern The pattern to parse
	 * @param {(Date|number|string)} [time=new Date()] The time to display
	 * @returns {string}
	 */
	static displayArbitrary(pattern, time = new Date()) {
		return Timestamp._display(Timestamp._patch(pattern), time);
	}

	/**
	 * Creates a UTC Date object to work with.
	 * @since 0.5.0
	 * @param {(Date|number|string)} [time=new Date()] The date to convert to utc
	 * @returns {Date}
	 */
	static utc(time = new Date()) {
		time = Timestamp._resolveDate(time);
		return new Date(time.valueOf() + Timestamp.timezoneOffset);
	}

	/**
	 * Display the current date with the current pattern.
	 * @since 0.5.0
	 * @param {string} template The pattern to parse
	 * @param {(Date|number|string)} time The time to display
	 * @returns {string}
	 * @private
	 */
	static _display(template, time) {
		let output = '';
		const parsedTime = Timestamp._resolveDate(time);
		for (const { content, type } of template) output += content || tokens.get(type)(parsedTime);
		return output;
	}

	/**
	 * Parses the pattern.
	 * @since 0.5.0
	 * @param {string} pattern The pattern to parse
	 * @returns {TimestampObject[]}
	 * @private
	 */
	static _patch(pattern) {
		const template = [];
		for (let i = 0; i < pattern.length; i++) {
			let current = '';
			const currentChar = pattern[i];
			if (this.mapTokens.has(currentChar)) {
				current += currentChar;
				const tokenMax = this.mapTokens.get(currentChar);
				while (pattern[i + 1] === currentChar && current.length < tokenMax) current += pattern[++i];
				template.push({ type: current, content: null });
			} else if (currentChar === '[') {
				while (i + 1 < pattern.length && pattern[i + 1] !== ']') current += pattern[++i];
				i++;
				template.push({ type: 'literal', content: current });
			} else {
				current += currentChar;
				while (i + 1 < pattern.length && !this.mapTokens.has(pattern[i + 1]) && pattern[i + 1] !== '[') current += pattern[++i];
				template.push({ type: 'literal', content: current });
			}
		}

		return template;
	}

	/**
	 * Resolves a date.
	 * @since 0.5.0
	 * @param {(Date|number|string)} time The time to parse
	 * @returns {Date}
	 * @private
	 */
	static _resolveDate(time) {
		return time instanceof Date ? time : new Date(time);
	}

}

/**
 * The timezone offset in seconds.
 * @since 0.5.0
 * @type {number}
 * @static
 */
Timestamp.timezoneOffset = new Date().getTimezoneOffset() * 60000;

/**
 * The map tokens, mapped from the constants.
 * @since 0.5.0
 * @type {Map<string, Function>}
 * @static
 */
Timestamp.mapTokens = new Map(Object.entries(TOKENS));

module.exports = Timestamp;
