const RichDisplay = require('./RichDisplay');

const numbers = ['0⃣', '1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣'];

class RichMenu extends RichDisplay {

	constructor(embed) {
		super(embed);
		this.options = [];
	}

}

module.exports = RichMenu;
