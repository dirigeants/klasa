/// <reference types="node" />
import { MessageType, ChannelType } from '@klasa/dapi-types';
import type { Language, LanguageValue } from '../structures/Language';
import type { Schema } from '../settings/schema/Schema';
import type { QueryBuilderEntryOptions, QueryBuilderDatatype } from './QueryBuilder';
export declare const version: any;
export declare const KlasaClientDefaults: {
    ws: {
        shards: number | number[] | "auto";
        totalShards: number;
        intents: number | "GUILDS" | "GUILD_MEMBERS" | "GUILD_BANS" | "GUILD_EMOJIS" | "GUILD_INTEGRATIONS" | "GUILD_WEBHOOKS" | "GUILD_INVITES" | "GUILD_VOICE_STATES" | "GUILD_PRESENCES" | "GUILD_MESSAGES" | "GUILD_MESSAGE_REACTIONS" | "GUILD_MESSAGE_TYPING" | "DIRECT_MESSAGES" | "DIRECT_MESSAGE_REACTIONS" | "DIRECT_MESSAGE_TYPING" | {
            bitfield: number;
        } | (number | "GUILDS" | "GUILD_MEMBERS" | "GUILD_BANS" | "GUILD_EMOJIS" | "GUILD_INTEGRATIONS" | "GUILD_WEBHOOKS" | "GUILD_INVITES" | "GUILD_VOICE_STATES" | "GUILD_PRESENCES" | "GUILD_MESSAGES" | "GUILD_MESSAGE_REACTIONS" | "GUILD_MESSAGE_TYPING" | "DIRECT_MESSAGES" | "DIRECT_MESSAGE_REACTIONS" | "DIRECT_MESSAGE_TYPING" | {
            bitfield: number;
        })[];
        additionalOptions: {
            [x: string]: unknown;
        };
        gatewayVersion: number;
    };
    pieces: {
        createFolders: boolean;
        disabledCoreTypes: string[];
        defaults: {
            commands: {
                autoAliases: boolean;
                bucket: number;
                cooldown: number;
                cooldownLevel: string;
                deletable: boolean;
                description: string | (((language: Language) => LanguageValue) & string);
                extendedHelp: (string & ((language: Language) => LanguageValue)) | (((language: Language) => LanguageValue) & ((language: Language) => LanguageValue));
                flagSupport: boolean;
                guarded: boolean;
                hidden: boolean;
                nsfw: boolean;
                permissionLevel: number;
                promptLimit: number;
                promptTime: number;
                quotedStringSupport: boolean;
                requiredPermissions: number | (import("@klasa/bitfield").BitFieldObject & number) | ((number | import("@klasa/bitfield").BitFieldObject | "CREATE_INSTANT_INVITE" | "KICK_MEMBERS" | "BAN_MEMBERS" | "ADMINISTRATOR" | "MANAGE_CHANNELS" | "MANAGE_GUILD" | "ADD_REACTIONS" | "VIEW_AUDIT_LOG" | "PRIORITY_SPEAKER" | "STREAM" | "VIEW_CHANNEL" | "SEND_MESSAGES" | "SEND_TTS_MESSAGES" | "MANAGE_MESSAGES" | "EMBED_LINKS" | "ATTACH_FILES" | "READ_MESSAGE_HISTORY" | "MENTION_EVERYONE" | "USE_EXTERNAL_EMOJIS" | "VIEW_GUILD_INSIGHTS" | "CONNECT" | "SPEAK" | "MUTE_MEMBERS" | "DEAFEN_MEMBERS" | "MOVE_MEMBERS" | "USE_VAD" | "CHANGE_NICKNAME" | "MANAGE_NICKNAMES" | "MANAGE_ROLES" | "MANAGE_WEBHOOKS" | "MANAGE_EMOJIS")[] & number);
                requiredSettings: {
                    [x: number]: never;
                    length: number;
                    toString: (() => string) & (() => string);
                    toLocaleString: (() => string) & (() => string);
                    pop: (() => string | undefined) & (() => undefined);
                    push: ((...items: string[]) => number) & ((...items: never[]) => number);
                    concat: {
                        (...items: ConcatArray<string>[]): string[];
                        (...items: (string | ConcatArray<string>)[]): string[];
                    } & {
                        (...items: ConcatArray<never>[]): never[];
                        (...items: ConcatArray<never>[]): never[];
                    };
                    join: ((separator?: string | undefined) => string) & ((separator?: string | undefined) => string);
                    reverse: (() => string[]) & (() => never[]);
                    shift: (() => string | undefined) & (() => undefined);
                    slice: ((start?: number | undefined, end?: number | undefined) => string[]) & ((start?: number | undefined, end?: number | undefined) => never[]);
                    sort: ((compareFn?: ((a: string, b: string) => number) | undefined) => string[] & never[]) & ((compareFn?: ((a: never, b: never) => number) | undefined) => string[] & never[]);
                    splice: {
                        (start: number, deleteCount?: number | undefined): string[];
                        (start: number, deleteCount: number, ...items: string[]): string[];
                    } & {
                        (start: number, deleteCount?: number | undefined): never[];
                        (start: number, deleteCount: number, ...items: never[]): never[];
                    };
                    unshift: ((...items: string[]) => number) & ((...items: never[]) => number);
                    indexOf: ((searchElement: string, fromIndex?: number | undefined) => number) & ((searchElement: never, fromIndex?: number | undefined) => number);
                    lastIndexOf: ((searchElement: string, fromIndex?: number | undefined) => number) & ((searchElement: never, fromIndex?: number | undefined) => number);
                    every: ((callbackfn: (value: string, index: number, array: string[]) => unknown, thisArg?: any) => boolean) & ((callbackfn: (value: never, index: number, array: never[]) => unknown, thisArg?: any) => boolean);
                    some: ((callbackfn: (value: string, index: number, array: string[]) => unknown, thisArg?: any) => boolean) & ((callbackfn: (value: never, index: number, array: never[]) => unknown, thisArg?: any) => boolean);
                    forEach: ((callbackfn: (value: string, index: number, array: string[]) => void, thisArg?: any) => void) & ((callbackfn: (value: never, index: number, array: never[]) => void, thisArg?: any) => void);
                    map: (<U>(callbackfn: (value: string, index: number, array: string[]) => U, thisArg?: any) => U[]) & (<U_1>(callbackfn: (value: never, index: number, array: never[]) => U_1, thisArg?: any) => U_1[]);
                    filter: {
                        <S extends string>(callbackfn: (value: string, index: number, array: string[]) => value is S, thisArg?: any): S[];
                        (callbackfn: (value: string, index: number, array: string[]) => unknown, thisArg?: any): string[];
                    } & {
                        <S_1 extends never>(callbackfn: (value: never, index: number, array: never[]) => value is S_1, thisArg?: any): S_1[];
                        (callbackfn: (value: never, index: number, array: never[]) => unknown, thisArg?: any): never[];
                    };
                    reduce: {
                        (callbackfn: (previousValue: string, currentValue: string, currentIndex: number, array: string[]) => string): string;
                        (callbackfn: (previousValue: string, currentValue: string, currentIndex: number, array: string[]) => string, initialValue: string): string;
                        <U_2>(callbackfn: (previousValue: U_2, currentValue: string, currentIndex: number, array: string[]) => U_2, initialValue: U_2): U_2;
                    } & {
                        (callbackfn: (previousValue: never, currentValue: never, currentIndex: number, array: never[]) => never): never;
                        (callbackfn: (previousValue: never, currentValue: never, currentIndex: number, array: never[]) => never, initialValue: never): never;
                        <U_3>(callbackfn: (previousValue: U_3, currentValue: never, currentIndex: number, array: never[]) => U_3, initialValue: U_3): U_3;
                    };
                    reduceRight: {
                        (callbackfn: (previousValue: string, currentValue: string, currentIndex: number, array: string[]) => string): string;
                        (callbackfn: (previousValue: string, currentValue: string, currentIndex: number, array: string[]) => string, initialValue: string): string;
                        <U_4>(callbackfn: (previousValue: U_4, currentValue: string, currentIndex: number, array: string[]) => U_4, initialValue: U_4): U_4;
                    } & {
                        (callbackfn: (previousValue: never, currentValue: never, currentIndex: number, array: never[]) => never): never;
                        (callbackfn: (previousValue: never, currentValue: never, currentIndex: number, array: never[]) => never, initialValue: never): never;
                        <U_5>(callbackfn: (previousValue: U_5, currentValue: never, currentIndex: number, array: never[]) => U_5, initialValue: U_5): U_5;
                    };
                    find: {
                        <S_2 extends string>(predicate: (this: void, value: string, index: number, obj: string[]) => value is S_2, thisArg?: any): S_2 | undefined;
                        (predicate: (value: string, index: number, obj: string[]) => unknown, thisArg?: any): string | undefined;
                    } & {
                        <S_3 extends never>(predicate: (this: void, value: never, index: number, obj: never[]) => value is S_3, thisArg?: any): S_3 | undefined;
                        (predicate: (value: never, index: number, obj: never[]) => unknown, thisArg?: any): undefined;
                    };
                    findIndex: ((predicate: (value: string, index: number, obj: string[]) => unknown, thisArg?: any) => number) & ((predicate: (value: never, index: number, obj: never[]) => unknown, thisArg?: any) => number);
                    fill: ((value: string, start?: number | undefined, end?: number | undefined) => string[] & never[]) & ((value: never, start?: number | undefined, end?: number | undefined) => string[] & never[]);
                    copyWithin: ((target: number, start: number, end?: number | undefined) => string[] & never[]) & ((target: number, start: number, end?: number | undefined) => string[] & never[]);
                    entries: (() => IterableIterator<[number, string]>) & (() => IterableIterator<[number, never]>);
                    keys: (() => IterableIterator<number>) & (() => IterableIterator<number>);
                    values: (() => IterableIterator<string>) & (() => IterableIterator<never>);
                    includes: ((searchElement: string, fromIndex?: number | undefined) => boolean) & ((searchElement: never, fromIndex?: number | undefined) => boolean);
                    flatMap: (<U_6, This = undefined>(callback: (this: This, value: string, index: number, array: string[]) => U_6 | readonly U_6[], thisArg?: This | undefined) => U_6[]) & (<U_7, This_1 = undefined>(callback: (this: This_1, value: never, index: number, array: never[]) => U_7 | readonly U_7[], thisArg?: This_1 | undefined) => U_7[]);
                    flat: (<A, D extends number = 1>(this: A, depth?: D | undefined) => {
                        done: A;
                        recur: A extends readonly (infer InnerArr)[] ? {
                            done: InnerArr;
                            recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                done: InnerArr;
                                recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                    done: InnerArr;
                                    recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                        done: InnerArr;
                                        recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                            done: InnerArr;
                                            recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                done: InnerArr;
                                                recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                    done: InnerArr;
                                                    recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                        done: InnerArr;
                                                        recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                            done: InnerArr;
                                                            recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                                done: InnerArr;
                                                                recur: InnerArr extends readonly (infer InnerArr)[] ? any[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]]]]]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                                            }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]]]]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                                        }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]]]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                                    }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                                }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                            }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                        }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                    }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]]] extends -1 ? "done" : "recur"] : InnerArr;
                            }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]] extends -1 ? "done" : "recur"] : InnerArr;
                        }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D] extends -1 ? "done" : "recur"] : A;
                    }[D extends -1 ? "done" : "recur"][]) & (<A_1, D_1 extends number = 1>(this: A_1, depth?: D_1 | undefined) => {
                        done: A_1;
                        recur: A_1 extends readonly (infer InnerArr)[] ? {
                            done: InnerArr;
                            recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                done: InnerArr;
                                recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                    done: InnerArr;
                                    recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                        done: InnerArr;
                                        recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                            done: InnerArr;
                                            recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                done: InnerArr;
                                                recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                    done: InnerArr;
                                                    recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                        done: InnerArr;
                                                        recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                            done: InnerArr;
                                                            recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                                done: InnerArr;
                                                                recur: InnerArr extends readonly (infer InnerArr)[] ? any[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]]]]]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                                            }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]]]]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                                        }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]]]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                                    }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                                }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                            }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                        }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                    }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]]] extends -1 ? "done" : "recur"] : InnerArr;
                            }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]] extends -1 ? "done" : "recur"] : InnerArr;
                        }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1] extends -1 ? "done" : "recur"] : A_1;
                    }[D_1 extends -1 ? "done" : "recur"][]);
                };
                runIn: ChannelType[];
                subcommands: boolean;
                usage: string;
                usageDelim: string;
                aliases: {
                    [x: number]: never;
                    length: number;
                    toString: (() => string) & (() => string);
                    toLocaleString: (() => string) & (() => string);
                    pop: (() => string | undefined) & (() => undefined);
                    push: ((...items: string[]) => number) & ((...items: never[]) => number);
                    concat: {
                        (...items: ConcatArray<string>[]): string[];
                        (...items: (string | ConcatArray<string>)[]): string[];
                    } & {
                        (...items: ConcatArray<never>[]): never[];
                        (...items: ConcatArray<never>[]): never[];
                    };
                    join: ((separator?: string | undefined) => string) & ((separator?: string | undefined) => string);
                    reverse: (() => string[]) & (() => never[]);
                    shift: (() => string | undefined) & (() => undefined);
                    slice: ((start?: number | undefined, end?: number | undefined) => string[]) & ((start?: number | undefined, end?: number | undefined) => never[]);
                    sort: ((compareFn?: ((a: string, b: string) => number) | undefined) => string[] & never[]) & ((compareFn?: ((a: never, b: never) => number) | undefined) => string[] & never[]);
                    splice: {
                        (start: number, deleteCount?: number | undefined): string[];
                        (start: number, deleteCount: number, ...items: string[]): string[];
                    } & {
                        (start: number, deleteCount?: number | undefined): never[];
                        (start: number, deleteCount: number, ...items: never[]): never[];
                    };
                    unshift: ((...items: string[]) => number) & ((...items: never[]) => number);
                    indexOf: ((searchElement: string, fromIndex?: number | undefined) => number) & ((searchElement: never, fromIndex?: number | undefined) => number);
                    lastIndexOf: ((searchElement: string, fromIndex?: number | undefined) => number) & ((searchElement: never, fromIndex?: number | undefined) => number);
                    every: ((callbackfn: (value: string, index: number, array: string[]) => unknown, thisArg?: any) => boolean) & ((callbackfn: (value: never, index: number, array: never[]) => unknown, thisArg?: any) => boolean);
                    some: ((callbackfn: (value: string, index: number, array: string[]) => unknown, thisArg?: any) => boolean) & ((callbackfn: (value: never, index: number, array: never[]) => unknown, thisArg?: any) => boolean);
                    forEach: ((callbackfn: (value: string, index: number, array: string[]) => void, thisArg?: any) => void) & ((callbackfn: (value: never, index: number, array: never[]) => void, thisArg?: any) => void);
                    map: (<U>(callbackfn: (value: string, index: number, array: string[]) => U, thisArg?: any) => U[]) & (<U_1>(callbackfn: (value: never, index: number, array: never[]) => U_1, thisArg?: any) => U_1[]);
                    filter: {
                        <S extends string>(callbackfn: (value: string, index: number, array: string[]) => value is S, thisArg?: any): S[];
                        (callbackfn: (value: string, index: number, array: string[]) => unknown, thisArg?: any): string[];
                    } & {
                        <S_1 extends never>(callbackfn: (value: never, index: number, array: never[]) => value is S_1, thisArg?: any): S_1[];
                        (callbackfn: (value: never, index: number, array: never[]) => unknown, thisArg?: any): never[];
                    };
                    reduce: {
                        (callbackfn: (previousValue: string, currentValue: string, currentIndex: number, array: string[]) => string): string;
                        (callbackfn: (previousValue: string, currentValue: string, currentIndex: number, array: string[]) => string, initialValue: string): string;
                        <U_2>(callbackfn: (previousValue: U_2, currentValue: string, currentIndex: number, array: string[]) => U_2, initialValue: U_2): U_2;
                    } & {
                        (callbackfn: (previousValue: never, currentValue: never, currentIndex: number, array: never[]) => never): never;
                        (callbackfn: (previousValue: never, currentValue: never, currentIndex: number, array: never[]) => never, initialValue: never): never;
                        <U_3>(callbackfn: (previousValue: U_3, currentValue: never, currentIndex: number, array: never[]) => U_3, initialValue: U_3): U_3;
                    };
                    reduceRight: {
                        (callbackfn: (previousValue: string, currentValue: string, currentIndex: number, array: string[]) => string): string;
                        (callbackfn: (previousValue: string, currentValue: string, currentIndex: number, array: string[]) => string, initialValue: string): string;
                        <U_4>(callbackfn: (previousValue: U_4, currentValue: string, currentIndex: number, array: string[]) => U_4, initialValue: U_4): U_4;
                    } & {
                        (callbackfn: (previousValue: never, currentValue: never, currentIndex: number, array: never[]) => never): never;
                        (callbackfn: (previousValue: never, currentValue: never, currentIndex: number, array: never[]) => never, initialValue: never): never;
                        <U_5>(callbackfn: (previousValue: U_5, currentValue: never, currentIndex: number, array: never[]) => U_5, initialValue: U_5): U_5;
                    };
                    find: {
                        <S_2 extends string>(predicate: (this: void, value: string, index: number, obj: string[]) => value is S_2, thisArg?: any): S_2 | undefined;
                        (predicate: (value: string, index: number, obj: string[]) => unknown, thisArg?: any): string | undefined;
                    } & {
                        <S_3 extends never>(predicate: (this: void, value: never, index: number, obj: never[]) => value is S_3, thisArg?: any): S_3 | undefined;
                        (predicate: (value: never, index: number, obj: never[]) => unknown, thisArg?: any): undefined;
                    };
                    findIndex: ((predicate: (value: string, index: number, obj: string[]) => unknown, thisArg?: any) => number) & ((predicate: (value: never, index: number, obj: never[]) => unknown, thisArg?: any) => number);
                    fill: ((value: string, start?: number | undefined, end?: number | undefined) => string[] & never[]) & ((value: never, start?: number | undefined, end?: number | undefined) => string[] & never[]);
                    copyWithin: ((target: number, start: number, end?: number | undefined) => string[] & never[]) & ((target: number, start: number, end?: number | undefined) => string[] & never[]);
                    entries: (() => IterableIterator<[number, string]>) & (() => IterableIterator<[number, never]>);
                    keys: (() => IterableIterator<number>) & (() => IterableIterator<number>);
                    values: (() => IterableIterator<string>) & (() => IterableIterator<never>);
                    includes: ((searchElement: string, fromIndex?: number | undefined) => boolean) & ((searchElement: never, fromIndex?: number | undefined) => boolean);
                    flatMap: (<U_6, This = undefined>(callback: (this: This, value: string, index: number, array: string[]) => U_6 | readonly U_6[], thisArg?: This | undefined) => U_6[]) & (<U_7, This_1 = undefined>(callback: (this: This_1, value: never, index: number, array: never[]) => U_7 | readonly U_7[], thisArg?: This_1 | undefined) => U_7[]);
                    flat: (<A, D extends number = 1>(this: A, depth?: D | undefined) => {
                        done: A;
                        recur: A extends readonly (infer InnerArr)[] ? {
                            done: InnerArr;
                            recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                done: InnerArr;
                                recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                    done: InnerArr;
                                    recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                        done: InnerArr;
                                        recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                            done: InnerArr;
                                            recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                done: InnerArr;
                                                recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                    done: InnerArr;
                                                    recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                        done: InnerArr;
                                                        recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                            done: InnerArr;
                                                            recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                                done: InnerArr;
                                                                recur: InnerArr extends readonly (infer InnerArr)[] ? any[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]]]]]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                                            }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]]]]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                                        }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]]]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                                    }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                                }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                            }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                        }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                    }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]]] extends -1 ? "done" : "recur"] : InnerArr;
                            }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]] extends -1 ? "done" : "recur"] : InnerArr;
                        }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D] extends -1 ? "done" : "recur"] : A;
                    }[D extends -1 ? "done" : "recur"][]) & (<A_1, D_1 extends number = 1>(this: A_1, depth?: D_1 | undefined) => {
                        done: A_1;
                        recur: A_1 extends readonly (infer InnerArr)[] ? {
                            done: InnerArr;
                            recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                done: InnerArr;
                                recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                    done: InnerArr;
                                    recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                        done: InnerArr;
                                        recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                            done: InnerArr;
                                            recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                done: InnerArr;
                                                recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                    done: InnerArr;
                                                    recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                        done: InnerArr;
                                                        recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                            done: InnerArr;
                                                            recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                                done: InnerArr;
                                                                recur: InnerArr extends readonly (infer InnerArr)[] ? any[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]]]]]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                                            }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]]]]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                                        }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]]]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                                    }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                                }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                            }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                        }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                    }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]]] extends -1 ? "done" : "recur"] : InnerArr;
                            }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]] extends -1 ? "done" : "recur"] : InnerArr;
                        }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1] extends -1 ? "done" : "recur"] : A_1;
                    }[D_1 extends -1 ? "done" : "recur"][]);
                };
                name: string;
                enabled: boolean;
            };
            events: {
                once: boolean;
                emitter: "options" | "removeListener" | "connect" | "ready" | "user" | "ws" | "channels" | "guilds" | "users" | "dms" | "invites" | "userBaseDirectory" | "pieceStores" | "events" | "actions" | "emojis" | "token" | "registerStore" | "unregisterStore" | "destroy" | "console" | "arguments" | "commands" | "inhibitors" | "finalizers" | "monitors" | "languages" | "providers" | "extendables" | "tasks" | "serializers" | "permissionLevels" | "gateways" | "schedule" | "mentionPrefix" | "settings" | "application" | "invite" | "owners" | "fetchApplication" | "api" | "addListener" | "on" | "once" | "off" | "removeAllListeners" | "setMaxListeners" | "getMaxListeners" | "listeners" | "rawListeners" | "emit" | "listenerCount" | "prependListener" | "prependOnceListener" | "eventNames" | {
                    addListener: (event: string | symbol, listener: (...args: any[]) => void) => import("events").EventEmitter;
                    on: (event: string | symbol, listener: (...args: any[]) => void) => import("events").EventEmitter;
                    once: (event: string | symbol, listener: (...args: any[]) => void) => import("events").EventEmitter;
                    removeListener: (event: string | symbol, listener: (...args: any[]) => void) => import("events").EventEmitter;
                    off: (event: string | symbol, listener: (...args: any[]) => void) => import("events").EventEmitter;
                    removeAllListeners: (event?: string | symbol | undefined) => import("events").EventEmitter;
                    setMaxListeners: (n: number) => import("events").EventEmitter;
                    getMaxListeners: () => number;
                    listeners: (event: string | symbol) => Function[];
                    rawListeners: (event: string | symbol) => Function[];
                    emit: (event: string | symbol, ...args: any[]) => boolean;
                    listenerCount: (type: string | symbol) => number;
                    prependListener: (event: string | symbol, listener: (...args: any[]) => void) => import("events").EventEmitter;
                    prependOnceListener: (event: string | symbol, listener: (...args: any[]) => void) => import("events").EventEmitter;
                    eventNames: () => (string | symbol)[];
                };
                event: string;
                name: string;
                enabled: boolean;
            };
            extendables: {
                appliesTo: {
                    [x: number]: never;
                    readonly length: number;
                    toString: (() => string) & (() => string);
                    toLocaleString: (() => string) & (() => string);
                    concat: {
                        (...items: ConcatArray<import("../..").Constructor<unknown>>[]): import("../..").Constructor<unknown>[];
                        (...items: (import("../..").Constructor<unknown> | ConcatArray<import("../..").Constructor<unknown>>)[]): import("../..").Constructor<unknown>[];
                    } & {
                        (...items: ConcatArray<never>[]): never[];
                        (...items: ConcatArray<never>[]): never[];
                    };
                    join: ((separator?: string | undefined) => string) & ((separator?: string | undefined) => string);
                    slice: ((start?: number | undefined, end?: number | undefined) => import("../..").Constructor<unknown>[]) & ((start?: number | undefined, end?: number | undefined) => never[]);
                    indexOf: ((searchElement: import("../..").Constructor<unknown>, fromIndex?: number | undefined) => number) & ((searchElement: never, fromIndex?: number | undefined) => number);
                    lastIndexOf: ((searchElement: import("../..").Constructor<unknown>, fromIndex?: number | undefined) => number) & ((searchElement: never, fromIndex?: number | undefined) => number);
                    every: ((callbackfn: (value: import("../..").Constructor<unknown>, index: number, array: readonly import("../..").Constructor<unknown>[]) => unknown, thisArg?: any) => boolean) & ((callbackfn: (value: never, index: number, array: never[]) => unknown, thisArg?: any) => boolean);
                    some: ((callbackfn: (value: import("../..").Constructor<unknown>, index: number, array: readonly import("../..").Constructor<unknown>[]) => unknown, thisArg?: any) => boolean) & ((callbackfn: (value: never, index: number, array: never[]) => unknown, thisArg?: any) => boolean);
                    forEach: ((callbackfn: (value: import("../..").Constructor<unknown>, index: number, array: readonly import("../..").Constructor<unknown>[]) => void, thisArg?: any) => void) & ((callbackfn: (value: never, index: number, array: never[]) => void, thisArg?: any) => void);
                    map: (<U_8>(callbackfn: (value: import("../..").Constructor<unknown>, index: number, array: readonly import("../..").Constructor<unknown>[]) => U_8, thisArg?: any) => U_8[]) & (<U_9>(callbackfn: (value: never, index: number, array: never[]) => U_9, thisArg?: any) => U_9[]);
                    filter: {
                        <S_4 extends import("../..").Constructor<unknown>>(callbackfn: (value: import("../..").Constructor<unknown>, index: number, array: readonly import("../..").Constructor<unknown>[]) => value is S_4, thisArg?: any): S_4[];
                        (callbackfn: (value: import("../..").Constructor<unknown>, index: number, array: readonly import("../..").Constructor<unknown>[]) => unknown, thisArg?: any): import("../..").Constructor<unknown>[];
                    } & {
                        <S_5 extends never>(callbackfn: (value: never, index: number, array: never[]) => value is S_5, thisArg?: any): S_5[];
                        (callbackfn: (value: never, index: number, array: never[]) => unknown, thisArg?: any): never[];
                    };
                    reduce: {
                        (callbackfn: (previousValue: import("../..").Constructor<unknown>, currentValue: import("../..").Constructor<unknown>, currentIndex: number, array: readonly import("../..").Constructor<unknown>[]) => import("../..").Constructor<unknown>): import("../..").Constructor<unknown>;
                        (callbackfn: (previousValue: import("../..").Constructor<unknown>, currentValue: import("../..").Constructor<unknown>, currentIndex: number, array: readonly import("../..").Constructor<unknown>[]) => import("../..").Constructor<unknown>, initialValue: import("../..").Constructor<unknown>): import("../..").Constructor<unknown>;
                        <U_10>(callbackfn: (previousValue: U_10, currentValue: import("../..").Constructor<unknown>, currentIndex: number, array: readonly import("../..").Constructor<unknown>[]) => U_10, initialValue: U_10): U_10;
                    } & {
                        (callbackfn: (previousValue: never, currentValue: never, currentIndex: number, array: never[]) => never): never;
                        (callbackfn: (previousValue: never, currentValue: never, currentIndex: number, array: never[]) => never, initialValue: never): never;
                        <U_11>(callbackfn: (previousValue: U_11, currentValue: never, currentIndex: number, array: never[]) => U_11, initialValue: U_11): U_11;
                    };
                    reduceRight: {
                        (callbackfn: (previousValue: import("../..").Constructor<unknown>, currentValue: import("../..").Constructor<unknown>, currentIndex: number, array: readonly import("../..").Constructor<unknown>[]) => import("../..").Constructor<unknown>): import("../..").Constructor<unknown>;
                        (callbackfn: (previousValue: import("../..").Constructor<unknown>, currentValue: import("../..").Constructor<unknown>, currentIndex: number, array: readonly import("../..").Constructor<unknown>[]) => import("../..").Constructor<unknown>, initialValue: import("../..").Constructor<unknown>): import("../..").Constructor<unknown>;
                        <U_12>(callbackfn: (previousValue: U_12, currentValue: import("../..").Constructor<unknown>, currentIndex: number, array: readonly import("../..").Constructor<unknown>[]) => U_12, initialValue: U_12): U_12;
                    } & {
                        (callbackfn: (previousValue: never, currentValue: never, currentIndex: number, array: never[]) => never): never;
                        (callbackfn: (previousValue: never, currentValue: never, currentIndex: number, array: never[]) => never, initialValue: never): never;
                        <U_13>(callbackfn: (previousValue: U_13, currentValue: never, currentIndex: number, array: never[]) => U_13, initialValue: U_13): U_13;
                    };
                    find: {
                        <S_6 extends import("../..").Constructor<unknown>>(predicate: (this: void, value: import("../..").Constructor<unknown>, index: number, obj: readonly import("../..").Constructor<unknown>[]) => value is S_6, thisArg?: any): S_6 | undefined;
                        (predicate: (value: import("../..").Constructor<unknown>, index: number, obj: readonly import("../..").Constructor<unknown>[]) => unknown, thisArg?: any): import("../..").Constructor<unknown> | undefined;
                    } & {
                        <S_7 extends never>(predicate: (this: void, value: never, index: number, obj: never[]) => value is S_7, thisArg?: any): S_7 | undefined;
                        (predicate: (value: never, index: number, obj: never[]) => unknown, thisArg?: any): undefined;
                    };
                    findIndex: ((predicate: (value: import("../..").Constructor<unknown>, index: number, obj: readonly import("../..").Constructor<unknown>[]) => unknown, thisArg?: any) => number) & ((predicate: (value: never, index: number, obj: never[]) => unknown, thisArg?: any) => number);
                    entries: (() => IterableIterator<[number, import("../..").Constructor<unknown>]>) & (() => IterableIterator<[number, never]>);
                    keys: (() => IterableIterator<number>) & (() => IterableIterator<number>);
                    values: (() => IterableIterator<import("../..").Constructor<unknown>>) & (() => IterableIterator<never>);
                    includes: ((searchElement: import("../..").Constructor<unknown>, fromIndex?: number | undefined) => boolean) & ((searchElement: never, fromIndex?: number | undefined) => boolean);
                    flatMap: (<U_14, This_2 = undefined>(callback: (this: This_2, value: import("../..").Constructor<unknown>, index: number, array: import("../..").Constructor<unknown>[]) => U_14 | readonly U_14[], thisArg?: This_2 | undefined) => U_14[]) & (<U_15, This_3 = undefined>(callback: (this: This_3, value: never, index: number, array: never[]) => U_15 | readonly U_15[], thisArg?: This_3 | undefined) => U_15[]);
                    flat: (<A_2, D_2 extends number = 1>(this: A_2, depth?: D_2 | undefined) => {
                        done: A_2;
                        recur: A_2 extends readonly (infer InnerArr)[] ? {
                            done: InnerArr;
                            recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                done: InnerArr;
                                recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                    done: InnerArr;
                                    recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                        done: InnerArr;
                                        recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                            done: InnerArr;
                                            recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                done: InnerArr;
                                                recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                    done: InnerArr;
                                                    recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                        done: InnerArr;
                                                        recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                            done: InnerArr;
                                                            recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                                done: InnerArr;
                                                                recur: InnerArr extends readonly (infer InnerArr)[] ? any[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_2]]]]]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                                            }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_2]]]]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                                        }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_2]]]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                                    }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_2]]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                                }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_2]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                            }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_2]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                        }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_2]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                    }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_2]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_2]]] extends -1 ? "done" : "recur"] : InnerArr;
                            }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_2]] extends -1 ? "done" : "recur"] : InnerArr;
                        }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_2] extends -1 ? "done" : "recur"] : A_2;
                    }[D_2 extends -1 ? "done" : "recur"][]) & (<A_3, D_3 extends number = 1>(this: A_3, depth?: D_3 | undefined) => {
                        done: A_3;
                        recur: A_3 extends readonly (infer InnerArr)[] ? {
                            done: InnerArr;
                            recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                done: InnerArr;
                                recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                    done: InnerArr;
                                    recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                        done: InnerArr;
                                        recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                            done: InnerArr;
                                            recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                done: InnerArr;
                                                recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                    done: InnerArr;
                                                    recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                        done: InnerArr;
                                                        recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                            done: InnerArr;
                                                            recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                                done: InnerArr;
                                                                recur: InnerArr extends readonly (infer InnerArr)[] ? any[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_3]]]]]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                                            }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_3]]]]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                                        }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_3]]]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                                    }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_3]]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                                }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_3]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                            }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_3]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                        }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_3]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                    }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_3]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_3]]] extends -1 ? "done" : "recur"] : InnerArr;
                            }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_3]] extends -1 ? "done" : "recur"] : InnerArr;
                        }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_3] extends -1 ? "done" : "recur"] : A_3;
                    }[D_3 extends -1 ? "done" : "recur"][]);
                    pop: () => undefined;
                    push: (...items: never[]) => number;
                    reverse: () => never[];
                    shift: () => undefined;
                    sort: (compareFn?: ((a: never, b: never) => number) | undefined) => readonly import("../..").Constructor<unknown>[] & never[];
                    splice: {
                        (start: number, deleteCount?: number | undefined): never[];
                        (start: number, deleteCount: number, ...items: never[]): never[];
                    };
                    unshift: (...items: never[]) => number;
                    fill: (value: never, start?: number | undefined, end?: number | undefined) => readonly import("../..").Constructor<unknown>[] & never[];
                    copyWithin: (target: number, start: number, end?: number | undefined) => readonly import("../..").Constructor<unknown>[] & never[];
                };
                name: string;
                enabled: boolean;
            };
            finalizers: {
                name: string;
                enabled: boolean;
            };
            inhibitors: {
                spamProtection: boolean;
                name: string;
                enabled: boolean;
            };
            languages: {
                name: string;
                enabled: boolean;
            };
            monitors: {
                allowedTypes: MessageType[];
                ignoreBots: boolean;
                ignoreSelf: boolean;
                ignoreOthers: boolean;
                ignoreWebhooks: boolean;
                ignoreEdits: boolean;
                ignoreBlacklistedUsers: boolean;
                ignoreBlacklistedGuilds: boolean;
                name: string;
                enabled: boolean;
            };
            providers: {
                name: string;
                enabled: boolean;
            };
            arguments: {
                aliases: {
                    [x: number]: never;
                    length: number;
                    toString: (() => string) & (() => string);
                    toLocaleString: (() => string) & (() => string);
                    pop: (() => string | undefined) & (() => undefined);
                    push: ((...items: string[]) => number) & ((...items: never[]) => number);
                    concat: {
                        (...items: ConcatArray<string>[]): string[];
                        (...items: (string | ConcatArray<string>)[]): string[];
                    } & {
                        (...items: ConcatArray<never>[]): never[];
                        (...items: ConcatArray<never>[]): never[];
                    };
                    join: ((separator?: string | undefined) => string) & ((separator?: string | undefined) => string);
                    reverse: (() => string[]) & (() => never[]);
                    shift: (() => string | undefined) & (() => undefined);
                    slice: ((start?: number | undefined, end?: number | undefined) => string[]) & ((start?: number | undefined, end?: number | undefined) => never[]);
                    sort: ((compareFn?: ((a: string, b: string) => number) | undefined) => string[] & never[]) & ((compareFn?: ((a: never, b: never) => number) | undefined) => string[] & never[]);
                    splice: {
                        (start: number, deleteCount?: number | undefined): string[];
                        (start: number, deleteCount: number, ...items: string[]): string[];
                    } & {
                        (start: number, deleteCount?: number | undefined): never[];
                        (start: number, deleteCount: number, ...items: never[]): never[];
                    };
                    unshift: ((...items: string[]) => number) & ((...items: never[]) => number);
                    indexOf: ((searchElement: string, fromIndex?: number | undefined) => number) & ((searchElement: never, fromIndex?: number | undefined) => number);
                    lastIndexOf: ((searchElement: string, fromIndex?: number | undefined) => number) & ((searchElement: never, fromIndex?: number | undefined) => number);
                    every: ((callbackfn: (value: string, index: number, array: string[]) => unknown, thisArg?: any) => boolean) & ((callbackfn: (value: never, index: number, array: never[]) => unknown, thisArg?: any) => boolean);
                    some: ((callbackfn: (value: string, index: number, array: string[]) => unknown, thisArg?: any) => boolean) & ((callbackfn: (value: never, index: number, array: never[]) => unknown, thisArg?: any) => boolean);
                    forEach: ((callbackfn: (value: string, index: number, array: string[]) => void, thisArg?: any) => void) & ((callbackfn: (value: never, index: number, array: never[]) => void, thisArg?: any) => void);
                    map: (<U>(callbackfn: (value: string, index: number, array: string[]) => U, thisArg?: any) => U[]) & (<U_1>(callbackfn: (value: never, index: number, array: never[]) => U_1, thisArg?: any) => U_1[]);
                    filter: {
                        <S extends string>(callbackfn: (value: string, index: number, array: string[]) => value is S, thisArg?: any): S[];
                        (callbackfn: (value: string, index: number, array: string[]) => unknown, thisArg?: any): string[];
                    } & {
                        <S_1 extends never>(callbackfn: (value: never, index: number, array: never[]) => value is S_1, thisArg?: any): S_1[];
                        (callbackfn: (value: never, index: number, array: never[]) => unknown, thisArg?: any): never[];
                    };
                    reduce: {
                        (callbackfn: (previousValue: string, currentValue: string, currentIndex: number, array: string[]) => string): string;
                        (callbackfn: (previousValue: string, currentValue: string, currentIndex: number, array: string[]) => string, initialValue: string): string;
                        <U_2>(callbackfn: (previousValue: U_2, currentValue: string, currentIndex: number, array: string[]) => U_2, initialValue: U_2): U_2;
                    } & {
                        (callbackfn: (previousValue: never, currentValue: never, currentIndex: number, array: never[]) => never): never;
                        (callbackfn: (previousValue: never, currentValue: never, currentIndex: number, array: never[]) => never, initialValue: never): never;
                        <U_3>(callbackfn: (previousValue: U_3, currentValue: never, currentIndex: number, array: never[]) => U_3, initialValue: U_3): U_3;
                    };
                    reduceRight: {
                        (callbackfn: (previousValue: string, currentValue: string, currentIndex: number, array: string[]) => string): string;
                        (callbackfn: (previousValue: string, currentValue: string, currentIndex: number, array: string[]) => string, initialValue: string): string;
                        <U_4>(callbackfn: (previousValue: U_4, currentValue: string, currentIndex: number, array: string[]) => U_4, initialValue: U_4): U_4;
                    } & {
                        (callbackfn: (previousValue: never, currentValue: never, currentIndex: number, array: never[]) => never): never;
                        (callbackfn: (previousValue: never, currentValue: never, currentIndex: number, array: never[]) => never, initialValue: never): never;
                        <U_5>(callbackfn: (previousValue: U_5, currentValue: never, currentIndex: number, array: never[]) => U_5, initialValue: U_5): U_5;
                    };
                    find: {
                        <S_2 extends string>(predicate: (this: void, value: string, index: number, obj: string[]) => value is S_2, thisArg?: any): S_2 | undefined;
                        (predicate: (value: string, index: number, obj: string[]) => unknown, thisArg?: any): string | undefined;
                    } & {
                        <S_3 extends never>(predicate: (this: void, value: never, index: number, obj: never[]) => value is S_3, thisArg?: any): S_3 | undefined;
                        (predicate: (value: never, index: number, obj: never[]) => unknown, thisArg?: any): undefined;
                    };
                    findIndex: ((predicate: (value: string, index: number, obj: string[]) => unknown, thisArg?: any) => number) & ((predicate: (value: never, index: number, obj: never[]) => unknown, thisArg?: any) => number);
                    fill: ((value: string, start?: number | undefined, end?: number | undefined) => string[] & never[]) & ((value: never, start?: number | undefined, end?: number | undefined) => string[] & never[]);
                    copyWithin: ((target: number, start: number, end?: number | undefined) => string[] & never[]) & ((target: number, start: number, end?: number | undefined) => string[] & never[]);
                    entries: (() => IterableIterator<[number, string]>) & (() => IterableIterator<[number, never]>);
                    keys: (() => IterableIterator<number>) & (() => IterableIterator<number>);
                    values: (() => IterableIterator<string>) & (() => IterableIterator<never>);
                    includes: ((searchElement: string, fromIndex?: number | undefined) => boolean) & ((searchElement: never, fromIndex?: number | undefined) => boolean);
                    flatMap: (<U_6, This = undefined>(callback: (this: This, value: string, index: number, array: string[]) => U_6 | readonly U_6[], thisArg?: This | undefined) => U_6[]) & (<U_7, This_1 = undefined>(callback: (this: This_1, value: never, index: number, array: never[]) => U_7 | readonly U_7[], thisArg?: This_1 | undefined) => U_7[]);
                    flat: (<A, D extends number = 1>(this: A, depth?: D | undefined) => {
                        done: A;
                        recur: A extends readonly (infer InnerArr)[] ? {
                            done: InnerArr;
                            recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                done: InnerArr;
                                recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                    done: InnerArr;
                                    recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                        done: InnerArr;
                                        recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                            done: InnerArr;
                                            recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                done: InnerArr;
                                                recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                    done: InnerArr;
                                                    recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                        done: InnerArr;
                                                        recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                            done: InnerArr;
                                                            recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                                done: InnerArr;
                                                                recur: InnerArr extends readonly (infer InnerArr)[] ? any[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]]]]]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                                            }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]]]]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                                        }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]]]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                                    }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                                }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                            }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                        }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                    }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]]] extends -1 ? "done" : "recur"] : InnerArr;
                            }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]] extends -1 ? "done" : "recur"] : InnerArr;
                        }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D] extends -1 ? "done" : "recur"] : A;
                    }[D extends -1 ? "done" : "recur"][]) & (<A_1, D_1 extends number = 1>(this: A_1, depth?: D_1 | undefined) => {
                        done: A_1;
                        recur: A_1 extends readonly (infer InnerArr)[] ? {
                            done: InnerArr;
                            recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                done: InnerArr;
                                recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                    done: InnerArr;
                                    recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                        done: InnerArr;
                                        recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                            done: InnerArr;
                                            recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                done: InnerArr;
                                                recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                    done: InnerArr;
                                                    recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                        done: InnerArr;
                                                        recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                            done: InnerArr;
                                                            recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                                done: InnerArr;
                                                                recur: InnerArr extends readonly (infer InnerArr)[] ? any[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]]]]]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                                            }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]]]]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                                        }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]]]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                                    }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                                }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                            }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                        }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                    }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]]] extends -1 ? "done" : "recur"] : InnerArr;
                            }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]] extends -1 ? "done" : "recur"] : InnerArr;
                        }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1] extends -1 ? "done" : "recur"] : A_1;
                    }[D_1 extends -1 ? "done" : "recur"][]);
                };
                name: string;
                enabled: boolean;
            };
            serializers: {
                aliases: {
                    [x: number]: never;
                    length: number;
                    toString: (() => string) & (() => string);
                    toLocaleString: (() => string) & (() => string);
                    pop: (() => string | undefined) & (() => undefined);
                    push: ((...items: string[]) => number) & ((...items: never[]) => number);
                    concat: {
                        (...items: ConcatArray<string>[]): string[];
                        (...items: (string | ConcatArray<string>)[]): string[];
                    } & {
                        (...items: ConcatArray<never>[]): never[];
                        (...items: ConcatArray<never>[]): never[];
                    };
                    join: ((separator?: string | undefined) => string) & ((separator?: string | undefined) => string);
                    reverse: (() => string[]) & (() => never[]);
                    shift: (() => string | undefined) & (() => undefined);
                    slice: ((start?: number | undefined, end?: number | undefined) => string[]) & ((start?: number | undefined, end?: number | undefined) => never[]);
                    sort: ((compareFn?: ((a: string, b: string) => number) | undefined) => string[] & never[]) & ((compareFn?: ((a: never, b: never) => number) | undefined) => string[] & never[]);
                    splice: {
                        (start: number, deleteCount?: number | undefined): string[];
                        (start: number, deleteCount: number, ...items: string[]): string[];
                    } & {
                        (start: number, deleteCount?: number | undefined): never[];
                        (start: number, deleteCount: number, ...items: never[]): never[];
                    };
                    unshift: ((...items: string[]) => number) & ((...items: never[]) => number);
                    indexOf: ((searchElement: string, fromIndex?: number | undefined) => number) & ((searchElement: never, fromIndex?: number | undefined) => number);
                    lastIndexOf: ((searchElement: string, fromIndex?: number | undefined) => number) & ((searchElement: never, fromIndex?: number | undefined) => number);
                    every: ((callbackfn: (value: string, index: number, array: string[]) => unknown, thisArg?: any) => boolean) & ((callbackfn: (value: never, index: number, array: never[]) => unknown, thisArg?: any) => boolean);
                    some: ((callbackfn: (value: string, index: number, array: string[]) => unknown, thisArg?: any) => boolean) & ((callbackfn: (value: never, index: number, array: never[]) => unknown, thisArg?: any) => boolean);
                    forEach: ((callbackfn: (value: string, index: number, array: string[]) => void, thisArg?: any) => void) & ((callbackfn: (value: never, index: number, array: never[]) => void, thisArg?: any) => void);
                    map: (<U>(callbackfn: (value: string, index: number, array: string[]) => U, thisArg?: any) => U[]) & (<U_1>(callbackfn: (value: never, index: number, array: never[]) => U_1, thisArg?: any) => U_1[]);
                    filter: {
                        <S extends string>(callbackfn: (value: string, index: number, array: string[]) => value is S, thisArg?: any): S[];
                        (callbackfn: (value: string, index: number, array: string[]) => unknown, thisArg?: any): string[];
                    } & {
                        <S_1 extends never>(callbackfn: (value: never, index: number, array: never[]) => value is S_1, thisArg?: any): S_1[];
                        (callbackfn: (value: never, index: number, array: never[]) => unknown, thisArg?: any): never[];
                    };
                    reduce: {
                        (callbackfn: (previousValue: string, currentValue: string, currentIndex: number, array: string[]) => string): string;
                        (callbackfn: (previousValue: string, currentValue: string, currentIndex: number, array: string[]) => string, initialValue: string): string;
                        <U_2>(callbackfn: (previousValue: U_2, currentValue: string, currentIndex: number, array: string[]) => U_2, initialValue: U_2): U_2;
                    } & {
                        (callbackfn: (previousValue: never, currentValue: never, currentIndex: number, array: never[]) => never): never;
                        (callbackfn: (previousValue: never, currentValue: never, currentIndex: number, array: never[]) => never, initialValue: never): never;
                        <U_3>(callbackfn: (previousValue: U_3, currentValue: never, currentIndex: number, array: never[]) => U_3, initialValue: U_3): U_3;
                    };
                    reduceRight: {
                        (callbackfn: (previousValue: string, currentValue: string, currentIndex: number, array: string[]) => string): string;
                        (callbackfn: (previousValue: string, currentValue: string, currentIndex: number, array: string[]) => string, initialValue: string): string;
                        <U_4>(callbackfn: (previousValue: U_4, currentValue: string, currentIndex: number, array: string[]) => U_4, initialValue: U_4): U_4;
                    } & {
                        (callbackfn: (previousValue: never, currentValue: never, currentIndex: number, array: never[]) => never): never;
                        (callbackfn: (previousValue: never, currentValue: never, currentIndex: number, array: never[]) => never, initialValue: never): never;
                        <U_5>(callbackfn: (previousValue: U_5, currentValue: never, currentIndex: number, array: never[]) => U_5, initialValue: U_5): U_5;
                    };
                    find: {
                        <S_2 extends string>(predicate: (this: void, value: string, index: number, obj: string[]) => value is S_2, thisArg?: any): S_2 | undefined;
                        (predicate: (value: string, index: number, obj: string[]) => unknown, thisArg?: any): string | undefined;
                    } & {
                        <S_3 extends never>(predicate: (this: void, value: never, index: number, obj: never[]) => value is S_3, thisArg?: any): S_3 | undefined;
                        (predicate: (value: never, index: number, obj: never[]) => unknown, thisArg?: any): undefined;
                    };
                    findIndex: ((predicate: (value: string, index: number, obj: string[]) => unknown, thisArg?: any) => number) & ((predicate: (value: never, index: number, obj: never[]) => unknown, thisArg?: any) => number);
                    fill: ((value: string, start?: number | undefined, end?: number | undefined) => string[] & never[]) & ((value: never, start?: number | undefined, end?: number | undefined) => string[] & never[]);
                    copyWithin: ((target: number, start: number, end?: number | undefined) => string[] & never[]) & ((target: number, start: number, end?: number | undefined) => string[] & never[]);
                    entries: (() => IterableIterator<[number, string]>) & (() => IterableIterator<[number, never]>);
                    keys: (() => IterableIterator<number>) & (() => IterableIterator<number>);
                    values: (() => IterableIterator<string>) & (() => IterableIterator<never>);
                    includes: ((searchElement: string, fromIndex?: number | undefined) => boolean) & ((searchElement: never, fromIndex?: number | undefined) => boolean);
                    flatMap: (<U_6, This = undefined>(callback: (this: This, value: string, index: number, array: string[]) => U_6 | readonly U_6[], thisArg?: This | undefined) => U_6[]) & (<U_7, This_1 = undefined>(callback: (this: This_1, value: never, index: number, array: never[]) => U_7 | readonly U_7[], thisArg?: This_1 | undefined) => U_7[]);
                    flat: (<A, D extends number = 1>(this: A, depth?: D | undefined) => {
                        done: A;
                        recur: A extends readonly (infer InnerArr)[] ? {
                            done: InnerArr;
                            recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                done: InnerArr;
                                recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                    done: InnerArr;
                                    recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                        done: InnerArr;
                                        recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                            done: InnerArr;
                                            recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                done: InnerArr;
                                                recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                    done: InnerArr;
                                                    recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                        done: InnerArr;
                                                        recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                            done: InnerArr;
                                                            recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                                done: InnerArr;
                                                                recur: InnerArr extends readonly (infer InnerArr)[] ? any[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]]]]]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                                            }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]]]]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                                        }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]]]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                                    }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                                }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                            }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                        }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                    }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]]] extends -1 ? "done" : "recur"] : InnerArr;
                            }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]] extends -1 ? "done" : "recur"] : InnerArr;
                        }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D] extends -1 ? "done" : "recur"] : A;
                    }[D extends -1 ? "done" : "recur"][]) & (<A_1, D_1 extends number = 1>(this: A_1, depth?: D_1 | undefined) => {
                        done: A_1;
                        recur: A_1 extends readonly (infer InnerArr)[] ? {
                            done: InnerArr;
                            recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                done: InnerArr;
                                recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                    done: InnerArr;
                                    recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                        done: InnerArr;
                                        recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                            done: InnerArr;
                                            recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                done: InnerArr;
                                                recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                    done: InnerArr;
                                                    recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                        done: InnerArr;
                                                        recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                            done: InnerArr;
                                                            recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                                done: InnerArr;
                                                                recur: InnerArr extends readonly (infer InnerArr)[] ? any[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]]]]]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                                            }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]]]]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                                        }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]]]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                                    }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                                }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                            }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                        }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                    }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]]] extends -1 ? "done" : "recur"] : InnerArr;
                            }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]] extends -1 ? "done" : "recur"] : InnerArr;
                        }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1] extends -1 ? "done" : "recur"] : A_1;
                    }[D_1 extends -1 ? "done" : "recur"][]);
                };
                name: string;
                enabled: boolean;
            };
            tasks: {
                name: string;
                enabled: boolean;
            };
        };
        disabledStores: never[];
    };
    cache: {
        enabled: boolean;
        limits: {
            bans: number;
            channels: number;
            dms: number;
            emojis: number;
            guilds: number;
            integrations: number;
            invites: number;
            members: number;
            messages: number;
            overwrites: number;
            presences: number;
            reactions: number;
            roles: number;
            users: number;
            voiceStates: number;
        };
        messageLifetime: number;
        messageSweepInterval: number;
    };
    commands: {
        editing: boolean;
        logging: boolean;
        messageLifetime: number;
        noPrefixDM: boolean;
        prefix: never;
        regexPrefix: never;
        slowmode: number;
        slowmodeAggressive: boolean;
        typing: boolean;
        prefixCaseInsensitive: boolean;
        prompts: {
            limit: number;
            time: number;
            quotedStringSupport: boolean;
            flagSupport: boolean;
        };
    };
    console: {
        useColor: boolean;
        stdout: {
            addListener: {
                (event: string, listener: (...args: any[]) => void): NodeJS.WriteStream;
                (event: "resize", listener: () => void): NodeJS.WriteStream;
            };
            emit: {
                (event: string | symbol, ...args: any[]): boolean;
                (event: "resize"): boolean;
            };
            on: {
                (event: string, listener: (...args: any[]) => void): NodeJS.WriteStream;
                (event: "resize", listener: () => void): NodeJS.WriteStream;
            };
            once: {
                (event: string, listener: (...args: any[]) => void): NodeJS.WriteStream;
                (event: "resize", listener: () => void): NodeJS.WriteStream;
            };
            prependListener: {
                (event: string, listener: (...args: any[]) => void): NodeJS.WriteStream;
                (event: "resize", listener: () => void): NodeJS.WriteStream;
            };
            prependOnceListener: {
                (event: string, listener: (...args: any[]) => void): NodeJS.WriteStream;
                (event: "resize", listener: () => void): NodeJS.WriteStream;
            };
            clearLine: (dir: import("readline").Direction, callback?: (() => void) | undefined) => boolean;
            clearScreenDown: (callback?: (() => void) | undefined) => boolean;
            cursorTo: {
                (x: number, y?: number | undefined, callback?: (() => void) | undefined): boolean;
                (x: number, callback: () => void): boolean;
            };
            moveCursor: (dx: number, dy: number, callback?: (() => void) | undefined) => boolean;
            getColorDepth: (env?: {} | undefined) => number;
            hasColors: {
                (depth?: number | undefined): boolean;
                (env?: {} | undefined): boolean;
                (depth: number, env?: {} | undefined): boolean;
            };
            getWindowSize: () => [number, number];
            columns: number;
            rows: number;
            isTTY: boolean;
            write: {
                (buffer: string | Uint8Array, cb?: ((err?: Error | undefined) => void) | undefined): boolean;
                (str: string | Uint8Array, encoding?: "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary" | "hex" | undefined, cb?: ((err?: Error | undefined) => void) | undefined): boolean;
            };
            connect: {
                (options: import("net").SocketConnectOpts, connectionListener?: (() => void) | undefined): NodeJS.WriteStream;
                (port: number, host: string, connectionListener?: (() => void) | undefined): NodeJS.WriteStream;
                (port: number, connectionListener?: (() => void) | undefined): NodeJS.WriteStream;
                (path: string, connectionListener?: (() => void) | undefined): NodeJS.WriteStream;
            };
            setEncoding: (encoding?: "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary" | "hex" | undefined) => NodeJS.WriteStream;
            pause: () => NodeJS.WriteStream;
            resume: () => NodeJS.WriteStream;
            setTimeout: (timeout: number, callback?: (() => void) | undefined) => NodeJS.WriteStream;
            setNoDelay: (noDelay?: boolean | undefined) => NodeJS.WriteStream;
            setKeepAlive: (enable?: boolean | undefined, initialDelay?: number | undefined) => NodeJS.WriteStream;
            address: () => string | import("net").AddressInfo;
            unref: () => NodeJS.WriteStream;
            ref: () => NodeJS.WriteStream;
            readonly bufferSize: number;
            readonly bytesRead: number;
            readonly bytesWritten: number;
            readonly connecting: boolean;
            readonly destroyed: boolean;
            readonly localAddress: string;
            readonly localPort: number;
            readonly remoteAddress: string;
            readonly remoteFamily: string;
            readonly remotePort: number;
            end: {
                (cb?: (() => void) | undefined): void;
                (buffer: string | Uint8Array, cb?: (() => void) | undefined): void;
                (str: string | Uint8Array, encoding?: "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary" | "hex" | undefined, cb?: (() => void) | undefined): void;
            };
            readonly writable: boolean;
            readonly writableEnded: boolean;
            readonly writableFinished: boolean;
            readonly writableHighWaterMark: number;
            readonly writableLength: number;
            readonly writableObjectMode: boolean;
            readonly writableCorked: number;
            _write: (chunk: any, encoding: BufferEncoding, callback: (error?: Error | null | undefined) => void) => void;
            _writev: (chunks: {
                chunk: any;
                encoding: BufferEncoding;
            }[], callback: (error?: Error | null | undefined) => void) => void;
            _destroy: (error: Error | null, callback: (error: Error | null) => void) => void;
            _final: (callback: (error?: Error | null | undefined) => void) => void;
            setDefaultEncoding: (encoding: BufferEncoding) => NodeJS.WriteStream;
            cork: () => void;
            uncork: () => void;
            readable: boolean;
            readonly readableHighWaterMark: number;
            readonly readableLength: number;
            readonly readableObjectMode: boolean;
            _read: (size: number) => void;
            read: (size?: number | undefined) => any;
            isPaused: () => boolean;
            unpipe: (destination?: NodeJS.WritableStream | undefined) => NodeJS.WriteStream;
            unshift: (chunk: any, encoding?: "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary" | "hex" | undefined) => void;
            wrap: (oldStream: NodeJS.ReadableStream) => NodeJS.WriteStream;
            push: (chunk: any, encoding?: "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary" | "hex" | undefined) => boolean;
            destroy: (error?: Error | undefined) => void;
            removeListener: {
                (event: "close", listener: () => void): NodeJS.WriteStream;
                (event: "data", listener: (chunk: any) => void): NodeJS.WriteStream;
                (event: "end", listener: () => void): NodeJS.WriteStream;
                (event: "error", listener: (err: Error) => void): NodeJS.WriteStream;
                (event: "pause", listener: () => void): NodeJS.WriteStream;
                (event: "readable", listener: () => void): NodeJS.WriteStream;
                (event: "resume", listener: () => void): NodeJS.WriteStream;
                (event: string | symbol, listener: (...args: any[]) => void): NodeJS.WriteStream;
            };
            pipe: <T extends NodeJS.WritableStream>(destination: T, options?: {
                end?: boolean | undefined;
            } | undefined) => T;
            off: (event: string | symbol, listener: (...args: any[]) => void) => NodeJS.WriteStream;
            removeAllListeners: (event?: string | symbol | undefined) => NodeJS.WriteStream;
            setMaxListeners: (n: number) => NodeJS.WriteStream;
            getMaxListeners: () => number;
            listeners: (event: string | symbol) => Function[];
            rawListeners: (event: string | symbol) => Function[];
            listenerCount: (type: string | symbol) => number;
            eventNames: () => (string | symbol)[];
        };
        stderr: {
            addListener: {
                (event: string, listener: (...args: any[]) => void): NodeJS.WriteStream;
                (event: "resize", listener: () => void): NodeJS.WriteStream;
            };
            emit: {
                (event: string | symbol, ...args: any[]): boolean;
                (event: "resize"): boolean;
            };
            on: {
                (event: string, listener: (...args: any[]) => void): NodeJS.WriteStream;
                (event: "resize", listener: () => void): NodeJS.WriteStream;
            };
            once: {
                (event: string, listener: (...args: any[]) => void): NodeJS.WriteStream;
                (event: "resize", listener: () => void): NodeJS.WriteStream;
            };
            prependListener: {
                (event: string, listener: (...args: any[]) => void): NodeJS.WriteStream;
                (event: "resize", listener: () => void): NodeJS.WriteStream;
            };
            prependOnceListener: {
                (event: string, listener: (...args: any[]) => void): NodeJS.WriteStream;
                (event: "resize", listener: () => void): NodeJS.WriteStream;
            };
            clearLine: (dir: import("readline").Direction, callback?: (() => void) | undefined) => boolean;
            clearScreenDown: (callback?: (() => void) | undefined) => boolean;
            cursorTo: {
                (x: number, y?: number | undefined, callback?: (() => void) | undefined): boolean;
                (x: number, callback: () => void): boolean;
            };
            moveCursor: (dx: number, dy: number, callback?: (() => void) | undefined) => boolean;
            getColorDepth: (env?: {} | undefined) => number;
            hasColors: {
                (depth?: number | undefined): boolean;
                (env?: {} | undefined): boolean;
                (depth: number, env?: {} | undefined): boolean;
            };
            getWindowSize: () => [number, number];
            columns: number;
            rows: number;
            isTTY: boolean;
            write: {
                (buffer: string | Uint8Array, cb?: ((err?: Error | undefined) => void) | undefined): boolean;
                (str: string | Uint8Array, encoding?: "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary" | "hex" | undefined, cb?: ((err?: Error | undefined) => void) | undefined): boolean;
            };
            connect: {
                (options: import("net").SocketConnectOpts, connectionListener?: (() => void) | undefined): NodeJS.WriteStream;
                (port: number, host: string, connectionListener?: (() => void) | undefined): NodeJS.WriteStream;
                (port: number, connectionListener?: (() => void) | undefined): NodeJS.WriteStream;
                (path: string, connectionListener?: (() => void) | undefined): NodeJS.WriteStream;
            };
            setEncoding: (encoding?: "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary" | "hex" | undefined) => NodeJS.WriteStream;
            pause: () => NodeJS.WriteStream;
            resume: () => NodeJS.WriteStream;
            setTimeout: (timeout: number, callback?: (() => void) | undefined) => NodeJS.WriteStream;
            setNoDelay: (noDelay?: boolean | undefined) => NodeJS.WriteStream;
            setKeepAlive: (enable?: boolean | undefined, initialDelay?: number | undefined) => NodeJS.WriteStream;
            address: () => string | import("net").AddressInfo;
            unref: () => NodeJS.WriteStream;
            ref: () => NodeJS.WriteStream;
            readonly bufferSize: number;
            readonly bytesRead: number;
            readonly bytesWritten: number;
            readonly connecting: boolean;
            readonly destroyed: boolean;
            readonly localAddress: string;
            readonly localPort: number;
            readonly remoteAddress: string;
            readonly remoteFamily: string;
            readonly remotePort: number;
            end: {
                (cb?: (() => void) | undefined): void;
                (buffer: string | Uint8Array, cb?: (() => void) | undefined): void;
                (str: string | Uint8Array, encoding?: "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary" | "hex" | undefined, cb?: (() => void) | undefined): void;
            };
            readonly writable: boolean;
            readonly writableEnded: boolean;
            readonly writableFinished: boolean;
            readonly writableHighWaterMark: number;
            readonly writableLength: number;
            readonly writableObjectMode: boolean;
            readonly writableCorked: number;
            _write: (chunk: any, encoding: BufferEncoding, callback: (error?: Error | null | undefined) => void) => void;
            _writev: (chunks: {
                chunk: any;
                encoding: BufferEncoding;
            }[], callback: (error?: Error | null | undefined) => void) => void;
            _destroy: (error: Error | null, callback: (error: Error | null) => void) => void;
            _final: (callback: (error?: Error | null | undefined) => void) => void;
            setDefaultEncoding: (encoding: BufferEncoding) => NodeJS.WriteStream;
            cork: () => void;
            uncork: () => void;
            readable: boolean;
            readonly readableHighWaterMark: number;
            readonly readableLength: number;
            readonly readableObjectMode: boolean;
            _read: (size: number) => void;
            read: (size?: number | undefined) => any;
            isPaused: () => boolean;
            unpipe: (destination?: NodeJS.WritableStream | undefined) => NodeJS.WriteStream;
            unshift: (chunk: any, encoding?: "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary" | "hex" | undefined) => void;
            wrap: (oldStream: NodeJS.ReadableStream) => NodeJS.WriteStream;
            push: (chunk: any, encoding?: "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary" | "hex" | undefined) => boolean;
            destroy: (error?: Error | undefined) => void;
            removeListener: {
                (event: "close", listener: () => void): NodeJS.WriteStream;
                (event: "data", listener: (chunk: any) => void): NodeJS.WriteStream;
                (event: "end", listener: () => void): NodeJS.WriteStream;
                (event: "error", listener: (err: Error) => void): NodeJS.WriteStream;
                (event: "pause", listener: () => void): NodeJS.WriteStream;
                (event: "readable", listener: () => void): NodeJS.WriteStream;
                (event: "resume", listener: () => void): NodeJS.WriteStream;
                (event: string | symbol, listener: (...args: any[]) => void): NodeJS.WriteStream;
            };
            pipe: <T extends NodeJS.WritableStream>(destination: T, options?: {
                end?: boolean | undefined;
            } | undefined) => T;
            off: (event: string | symbol, listener: (...args: any[]) => void) => NodeJS.WriteStream;
            removeAllListeners: (event?: string | symbol | undefined) => NodeJS.WriteStream;
            setMaxListeners: (n: number) => NodeJS.WriteStream;
            getMaxListeners: () => number;
            listeners: (event: string | symbol) => Function[];
            rawListeners: (event: string | symbol) => Function[];
            listenerCount: (type: string | symbol) => number;
            eventNames: () => (string | symbol)[];
        };
        timestamps: string | boolean;
        utc: boolean;
        colors: {
            debug: {
                [x: string]: {
                    background: import("@klasa/console").Color;
                    style: "bold" | "hidden" | "normal" | "dim" | "italic" | "underline" | "inverse" | "strikethrough" | import("@klasa/console").Style[];
                    text: import("@klasa/console").Color;
                };
                time: {
                    background: import("@klasa/console").Color;
                    style: "bold" | "hidden" | "normal" | "dim" | "italic" | "underline" | "inverse" | "strikethrough" | import("@klasa/console").Style[];
                    text: import("@klasa/console").Color;
                };
                message: {
                    background: import("@klasa/console").Color;
                    style: "bold" | "hidden" | "normal" | "dim" | "italic" | "underline" | "inverse" | "strikethrough" | import("@klasa/console").Style[];
                    text: import("@klasa/console").Color;
                };
                shard: {
                    background: import("@klasa/console").Color;
                    style: "bold" | "hidden" | "normal" | "dim" | "italic" | "underline" | "inverse" | "strikethrough" | import("@klasa/console").Style[];
                    text: import("@klasa/console").Color;
                };
            };
            error: {
                [x: string]: {
                    background: import("@klasa/console").Color;
                    style: "bold" | "hidden" | "normal" | "dim" | "italic" | "underline" | "inverse" | "strikethrough" | import("@klasa/console").Style[];
                    text: import("@klasa/console").Color;
                };
                time: {
                    background: import("@klasa/console").Color;
                    style: "bold" | "hidden" | "normal" | "dim" | "italic" | "underline" | "inverse" | "strikethrough" | import("@klasa/console").Style[];
                    text: import("@klasa/console").Color;
                };
                message: {
                    background: import("@klasa/console").Color;
                    style: "bold" | "hidden" | "normal" | "dim" | "italic" | "underline" | "inverse" | "strikethrough" | import("@klasa/console").Style[];
                    text: import("@klasa/console").Color;
                };
                shard: {
                    background: import("@klasa/console").Color;
                    style: "bold" | "hidden" | "normal" | "dim" | "italic" | "underline" | "inverse" | "strikethrough" | import("@klasa/console").Style[];
                    text: import("@klasa/console").Color;
                };
            };
            log: {
                [x: string]: {
                    background: import("@klasa/console").Color;
                    style: "bold" | "hidden" | "normal" | "dim" | "italic" | "underline" | "inverse" | "strikethrough" | import("@klasa/console").Style[];
                    text: import("@klasa/console").Color;
                };
                time: {
                    background: import("@klasa/console").Color;
                    style: "bold" | "hidden" | "normal" | "dim" | "italic" | "underline" | "inverse" | "strikethrough" | import("@klasa/console").Style[];
                    text: import("@klasa/console").Color;
                };
                message: {
                    background: import("@klasa/console").Color;
                    style: "bold" | "hidden" | "normal" | "dim" | "italic" | "underline" | "inverse" | "strikethrough" | import("@klasa/console").Style[];
                    text: import("@klasa/console").Color;
                };
                shard: {
                    background: import("@klasa/console").Color;
                    style: "bold" | "hidden" | "normal" | "dim" | "italic" | "underline" | "inverse" | "strikethrough" | import("@klasa/console").Style[];
                    text: import("@klasa/console").Color;
                };
            };
            verbose: {
                [x: string]: {
                    background: import("@klasa/console").Color;
                    style: "bold" | "hidden" | "normal" | "dim" | "italic" | "underline" | "inverse" | "strikethrough" | import("@klasa/console").Style[];
                    text: import("@klasa/console").Color;
                };
                time: {
                    background: import("@klasa/console").Color;
                    style: "bold" | "hidden" | "normal" | "dim" | "italic" | "underline" | "inverse" | "strikethrough" | import("@klasa/console").Style[];
                    text: import("@klasa/console").Color;
                };
                message: {
                    background: import("@klasa/console").Color;
                    style: "bold" | "hidden" | "normal" | "dim" | "italic" | "underline" | "inverse" | "strikethrough" | import("@klasa/console").Style[];
                    text: import("@klasa/console").Color;
                };
                shard: {
                    background: import("@klasa/console").Color;
                    style: "bold" | "hidden" | "normal" | "dim" | "italic" | "underline" | "inverse" | "strikethrough" | import("@klasa/console").Style[];
                    text: import("@klasa/console").Color;
                };
            };
            warn: {
                [x: string]: {
                    background: import("@klasa/console").Color;
                    style: "bold" | "hidden" | "normal" | "dim" | "italic" | "underline" | "inverse" | "strikethrough" | import("@klasa/console").Style[];
                    text: import("@klasa/console").Color;
                };
                time: {
                    background: import("@klasa/console").Color;
                    style: "bold" | "hidden" | "normal" | "dim" | "italic" | "underline" | "inverse" | "strikethrough" | import("@klasa/console").Style[];
                    text: import("@klasa/console").Color;
                };
                message: {
                    background: import("@klasa/console").Color;
                    style: "bold" | "hidden" | "normal" | "dim" | "italic" | "underline" | "inverse" | "strikethrough" | import("@klasa/console").Style[];
                    text: import("@klasa/console").Color;
                };
                shard: {
                    background: import("@klasa/console").Color;
                    style: "bold" | "hidden" | "normal" | "dim" | "italic" | "underline" | "inverse" | "strikethrough" | import("@klasa/console").Style[];
                    text: import("@klasa/console").Color;
                };
            };
            wtf: {
                [x: string]: {
                    background: import("@klasa/console").Color;
                    style: "bold" | "hidden" | "normal" | "dim" | "italic" | "underline" | "inverse" | "strikethrough" | import("@klasa/console").Style[];
                    text: import("@klasa/console").Color;
                };
                time: {
                    background: import("@klasa/console").Color;
                    style: "bold" | "hidden" | "normal" | "dim" | "italic" | "underline" | "inverse" | "strikethrough" | import("@klasa/console").Style[];
                    text: import("@klasa/console").Color;
                };
                message: {
                    background: import("@klasa/console").Color;
                    style: "bold" | "hidden" | "normal" | "dim" | "italic" | "underline" | "inverse" | "strikethrough" | import("@klasa/console").Style[];
                    text: import("@klasa/console").Color;
                };
                shard: {
                    background: import("@klasa/console").Color;
                    style: "bold" | "hidden" | "normal" | "dim" | "italic" | "underline" | "inverse" | "strikethrough" | import("@klasa/console").Style[];
                    text: import("@klasa/console").Color;
                };
            };
        };
    };
    consoleEvents: {
        debug: boolean;
        error: boolean;
        log: boolean;
        verbose: boolean;
        warn: boolean;
        wtf: boolean;
    };
    language: string;
    owners: {
        [x: number]: never;
        length: number;
        toString: (() => string) & (() => string);
        toLocaleString: (() => string) & (() => string);
        pop: (() => string | undefined) & (() => undefined);
        push: ((...items: string[]) => number) & ((...items: never[]) => number);
        concat: {
            (...items: ConcatArray<string>[]): string[];
            (...items: (string | ConcatArray<string>)[]): string[];
        } & {
            (...items: ConcatArray<never>[]): never[];
            (...items: ConcatArray<never>[]): never[];
        };
        join: ((separator?: string | undefined) => string) & ((separator?: string | undefined) => string);
        reverse: (() => string[]) & (() => never[]);
        shift: (() => string | undefined) & (() => undefined);
        slice: ((start?: number | undefined, end?: number | undefined) => string[]) & ((start?: number | undefined, end?: number | undefined) => never[]);
        sort: ((compareFn?: ((a: string, b: string) => number) | undefined) => string[] & never[]) & ((compareFn?: ((a: never, b: never) => number) | undefined) => string[] & never[]);
        splice: {
            (start: number, deleteCount?: number | undefined): string[];
            (start: number, deleteCount: number, ...items: string[]): string[];
        } & {
            (start: number, deleteCount?: number | undefined): never[];
            (start: number, deleteCount: number, ...items: never[]): never[];
        };
        unshift: ((...items: string[]) => number) & ((...items: never[]) => number);
        indexOf: ((searchElement: string, fromIndex?: number | undefined) => number) & ((searchElement: never, fromIndex?: number | undefined) => number);
        lastIndexOf: ((searchElement: string, fromIndex?: number | undefined) => number) & ((searchElement: never, fromIndex?: number | undefined) => number);
        every: ((callbackfn: (value: string, index: number, array: string[]) => unknown, thisArg?: any) => boolean) & ((callbackfn: (value: never, index: number, array: never[]) => unknown, thisArg?: any) => boolean);
        some: ((callbackfn: (value: string, index: number, array: string[]) => unknown, thisArg?: any) => boolean) & ((callbackfn: (value: never, index: number, array: never[]) => unknown, thisArg?: any) => boolean);
        forEach: ((callbackfn: (value: string, index: number, array: string[]) => void, thisArg?: any) => void) & ((callbackfn: (value: never, index: number, array: never[]) => void, thisArg?: any) => void);
        map: (<U>(callbackfn: (value: string, index: number, array: string[]) => U, thisArg?: any) => U[]) & (<U_1>(callbackfn: (value: never, index: number, array: never[]) => U_1, thisArg?: any) => U_1[]);
        filter: {
            <S extends string>(callbackfn: (value: string, index: number, array: string[]) => value is S, thisArg?: any): S[];
            (callbackfn: (value: string, index: number, array: string[]) => unknown, thisArg?: any): string[];
        } & {
            <S_1 extends never>(callbackfn: (value: never, index: number, array: never[]) => value is S_1, thisArg?: any): S_1[];
            (callbackfn: (value: never, index: number, array: never[]) => unknown, thisArg?: any): never[];
        };
        reduce: {
            (callbackfn: (previousValue: string, currentValue: string, currentIndex: number, array: string[]) => string): string;
            (callbackfn: (previousValue: string, currentValue: string, currentIndex: number, array: string[]) => string, initialValue: string): string;
            <U_2>(callbackfn: (previousValue: U_2, currentValue: string, currentIndex: number, array: string[]) => U_2, initialValue: U_2): U_2;
        } & {
            (callbackfn: (previousValue: never, currentValue: never, currentIndex: number, array: never[]) => never): never;
            (callbackfn: (previousValue: never, currentValue: never, currentIndex: number, array: never[]) => never, initialValue: never): never;
            <U_3>(callbackfn: (previousValue: U_3, currentValue: never, currentIndex: number, array: never[]) => U_3, initialValue: U_3): U_3;
        };
        reduceRight: {
            (callbackfn: (previousValue: string, currentValue: string, currentIndex: number, array: string[]) => string): string;
            (callbackfn: (previousValue: string, currentValue: string, currentIndex: number, array: string[]) => string, initialValue: string): string;
            <U_4>(callbackfn: (previousValue: U_4, currentValue: string, currentIndex: number, array: string[]) => U_4, initialValue: U_4): U_4;
        } & {
            (callbackfn: (previousValue: never, currentValue: never, currentIndex: number, array: never[]) => never): never;
            (callbackfn: (previousValue: never, currentValue: never, currentIndex: number, array: never[]) => never, initialValue: never): never;
            <U_5>(callbackfn: (previousValue: U_5, currentValue: never, currentIndex: number, array: never[]) => U_5, initialValue: U_5): U_5;
        };
        find: {
            <S_2 extends string>(predicate: (this: void, value: string, index: number, obj: string[]) => value is S_2, thisArg?: any): S_2 | undefined;
            (predicate: (value: string, index: number, obj: string[]) => unknown, thisArg?: any): string | undefined;
        } & {
            <S_3 extends never>(predicate: (this: void, value: never, index: number, obj: never[]) => value is S_3, thisArg?: any): S_3 | undefined;
            (predicate: (value: never, index: number, obj: never[]) => unknown, thisArg?: any): undefined;
        };
        findIndex: ((predicate: (value: string, index: number, obj: string[]) => unknown, thisArg?: any) => number) & ((predicate: (value: never, index: number, obj: never[]) => unknown, thisArg?: any) => number);
        fill: ((value: string, start?: number | undefined, end?: number | undefined) => string[] & never[]) & ((value: never, start?: number | undefined, end?: number | undefined) => string[] & never[]);
        copyWithin: ((target: number, start: number, end?: number | undefined) => string[] & never[]) & ((target: number, start: number, end?: number | undefined) => string[] & never[]);
        entries: (() => IterableIterator<[number, string]>) & (() => IterableIterator<[number, never]>);
        keys: (() => IterableIterator<number>) & (() => IterableIterator<number>);
        values: (() => IterableIterator<string>) & (() => IterableIterator<never>);
        includes: ((searchElement: string, fromIndex?: number | undefined) => boolean) & ((searchElement: never, fromIndex?: number | undefined) => boolean);
        flatMap: (<U_6, This = undefined>(callback: (this: This, value: string, index: number, array: string[]) => U_6 | readonly U_6[], thisArg?: This | undefined) => U_6[]) & (<U_7, This_1 = undefined>(callback: (this: This_1, value: never, index: number, array: never[]) => U_7 | readonly U_7[], thisArg?: This_1 | undefined) => U_7[]);
        flat: (<A, D extends number = 1>(this: A, depth?: D | undefined) => {
            done: A;
            recur: A extends readonly (infer InnerArr)[] ? {
                done: InnerArr;
                recur: InnerArr extends readonly (infer InnerArr)[] ? {
                    done: InnerArr;
                    recur: InnerArr extends readonly (infer InnerArr)[] ? {
                        done: InnerArr;
                        recur: InnerArr extends readonly (infer InnerArr)[] ? {
                            done: InnerArr;
                            recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                done: InnerArr;
                                recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                    done: InnerArr;
                                    recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                        done: InnerArr;
                                        recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                            done: InnerArr;
                                            recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                done: InnerArr;
                                                recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                    done: InnerArr;
                                                    recur: InnerArr extends readonly (infer InnerArr)[] ? any[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]]]]]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                                }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]]]]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                            }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]]]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                        }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                    }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                            }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                        }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]]]] extends -1 ? "done" : "recur"] : InnerArr;
                    }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]]] extends -1 ? "done" : "recur"] : InnerArr;
                }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D]] extends -1 ? "done" : "recur"] : InnerArr;
            }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D] extends -1 ? "done" : "recur"] : A;
        }[D extends -1 ? "done" : "recur"][]) & (<A_1, D_1 extends number = 1>(this: A_1, depth?: D_1 | undefined) => {
            done: A_1;
            recur: A_1 extends readonly (infer InnerArr)[] ? {
                done: InnerArr;
                recur: InnerArr extends readonly (infer InnerArr)[] ? {
                    done: InnerArr;
                    recur: InnerArr extends readonly (infer InnerArr)[] ? {
                        done: InnerArr;
                        recur: InnerArr extends readonly (infer InnerArr)[] ? {
                            done: InnerArr;
                            recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                done: InnerArr;
                                recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                    done: InnerArr;
                                    recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                        done: InnerArr;
                                        recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                            done: InnerArr;
                                            recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                done: InnerArr;
                                                recur: InnerArr extends readonly (infer InnerArr)[] ? {
                                                    done: InnerArr;
                                                    recur: InnerArr extends readonly (infer InnerArr)[] ? any[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]]]]]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                                }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]]]]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                            }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]]]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                        }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                    }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                                }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                            }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]]]]] extends -1 ? "done" : "recur"] : InnerArr;
                        }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]]]] extends -1 ? "done" : "recur"] : InnerArr;
                    }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]]] extends -1 ? "done" : "recur"] : InnerArr;
                }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1]] extends -1 ? "done" : "recur"] : InnerArr;
            }[[-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][D_1] extends -1 ? "done" : "recur"] : A_1;
        }[D_1 extends -1 ? "done" : "recur"][]);
    };
    permissionLevels: ((permissionLevels: import("../..").PermissionLevels) => import("../..").PermissionLevels) & (() => import("../..").PermissionLevels);
    production: boolean;
    readyMessage: (string & ((client: import("@klasa/core").Client) => string)) | (((client: import("@klasa/core").Client) => string) & ((client: import("@klasa/core").Client) => string));
    providers: {
        [x: string]: unknown;
        default: string;
    };
    settings: {
        gateways: {
            [x: string]: {
                schema: (schema: Schema) => Schema;
            };
            clientStorage: {
                schema: ((schema: Schema) => Schema) & (() => Schema);
            };
            guilds: {
                schema: ((schema: Schema) => Schema) & (() => Schema);
            };
            users: {
                schema: ((schema: Schema) => Schema) & (() => Schema);
            };
        };
        preserve: boolean;
    };
    schedule: {
        interval: number;
    };
    rest: {
        userAgentAppendix: string;
        offset: number;
        retries: number;
        timeout: number;
        version: number;
        api: string;
        cdn: string;
    };
};
export declare const MENTION_REGEX: {
    userOrMember: RegExp;
    channel: RegExp;
    emoji: RegExp;
    role: RegExp;
    snowflake: RegExp;
};
export declare const DATATYPES: [string, QueryBuilderDatatype][];
export declare const OPTIONS: Required<QueryBuilderEntryOptions>;
