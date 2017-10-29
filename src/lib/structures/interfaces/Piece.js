const { applyToClass } = require('../../util/util');

/**
 * The common interface for all pieces
 * @since 0.1.1
 * @see Command
 * @see Event
 * @see Extendable
 * @see Finalizer
 * @see Inhibitor
 * @see Language
 * @see Monitor
 * @see Provider
 */
class Piece {

	/**
	 * Reloads this piece
	 * @since 0.0.1
	 * @returns {Piece} The newly loaded piece
	 */
	async reload() {
		const piece = this.client[`${this.type}s`].load(this.dir, this.file);
		await piece.init();
		return piece;
	}

	/**
	 * Unloads this piece
	 * @since 0.0.1
	 * @returns {void}
	 */
	unload() {
		return this.client[`${this.type}s`].delete(this);
	}

	/**
	 * Disables this piece
	 * @since 0.0.1
	 * @returns {Piece} This piece
	 */
	disable() {
		this.enabled = false;
		return this;
	}

	/**
	 * Enables this piece
	 * @since 0.0.1
	 * @returns {Piece} This piece
	 */
	enable() {
		this.enabled = true;
		return this;
	}

	/**
	 * Defines toString behavior for pieces
	 * @since 0.3.0
	 * @returns {string} This piece name
	 */
	toString() {
		return this.name;
	}

	/**
	 * Applies this interface to a class
	 * @since 0.1.1
	 * @param {Object} structure The structure to apply this interface to
	 * @param {string[]} [skips=[]] The methods to skip when applying this interface
	 */
	static applyToClass(structure, skips) {
		applyToClass(Piece, structure, skips);
	}

}

module.exports = Piece;
