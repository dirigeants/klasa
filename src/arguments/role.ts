import { Argument, Possible, KlasaMessage } from 'klasa';
import { Role } from '@klasa/core';

export default class CoreArgument extends Argument {

	public run(argument: string, possible: Possible, message: KlasaMessage): Role {
		const roleID = Argument.regex.role.exec(argument);
		const role = roleID ? message.guild?.roles.get(roleID[1]) : null;
		if (role) return role;
		throw message.language.get('RESOLVER_INVALID_ROLE', possible.name);
	}

}
