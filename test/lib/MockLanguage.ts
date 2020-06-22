import { Language, SchemaEntry } from '../../src';

export class MockLanguage extends Language {

	public language = {
		DEFAULT: (key: string, ...args: unknown[]): string => `[DEFAULT]: ${key} ${args.join(' ')}`,
		SETTING_GATEWAY_KEY_NOEXT: (key: string): string => `[SETTING_GATEWAY_KEY_NOEXT]: ${key}`,
		SETTING_GATEWAY_CHOOSE_KEY: (keys: string[]): string => `[SETTING_GATEWAY_CHOOSE_KEY]: ${keys.join(' ')}`,
		SETTING_GATEWAY_MISSING_VALUE: (entry: SchemaEntry, value: string): string => `[SETTING_GATEWAY_MISSING_VALUE]: ${entry.key} ${value}`,
		SETTING_GATEWAY_DUPLICATE_VALUE: (entry: SchemaEntry, value: string): string => `[SETTING_GATEWAY_DUPLICATE_VALUE]: ${entry.key} ${value}`,
		SETTING_GATEWAY_INVALID_FILTERED_VALUE: (entry: SchemaEntry, value: unknown): string => `[SETTING_GATEWAY_INVALID_FILTERED_VALUE]: ${entry.key} ${value}`,
		RESOLVER_MINMAX_EXACTLY: (key: string, value: number, inclusive: boolean): string => `[RESOLVER_MINMAX_EXACTLY]: ${key} ${value} ${inclusive}`,
		RESOLVER_MINMAX_BOTH: (key: string, minimum: number, maximum: number, inclusive: boolean): string => `[RESOLVER_MINMAX_BOTH]: ${key} ${minimum} ${maximum} ${inclusive}`,
		RESOLVER_MINMAX_MIN: (key: string, minimum: number, inclusive: number): string => `[RESOLVER_MINMAX_MIN]: ${key} ${minimum} ${inclusive}`,
		RESOLVER_MINMAX_MAX: (key: string, maximum: number, inclusive: number): string => `[RESOLVER_MINMAX_MAX]: ${key} ${maximum} ${inclusive}`
	};

}
