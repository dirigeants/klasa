import { Schema } from './Schema';

export class SchemaFolder extends Schema {

	/**
	 * The schema that manages this instance
	 */
	public readonly parent: Schema | SchemaFolder;

	/**
	 * The key of this entry relative to its parent
	 */
	public readonly key: string;

	/**
	 * Constructs a SchemaFolder instance.
	 * @param parent The schema that manages this instance
	 * @param key This folder's key name
	 */
	public constructor(parent: Schema, key: string) {
		super(parent.path.length === 0 ? key : `${parent.path}.${key}`);
		this.parent = parent;
		this.key = key;
	}

}
