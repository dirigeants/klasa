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
        intents: number | import("@klasa/ws").IntentsFlags | {
            bitfield: number;
        } | (number | import("@klasa/ws").IntentsFlags | {
            bitfield: number;
        })[];
        additionalOptions: {
            [x: string]: unknown;
        };
        gatewayVersion: number;
    };
    pieces: {
        defaults: {
            actions: {
                clientEvent: string;
                once: never;
                emitter: never;
                event: string;
                name: string;
                enabled: boolean;
            };
            events: {
                once: boolean;
                emitter: "options" | "connect" | "ready" | "removeListener" | "user" | "ws" | "channels" | "guilds" | "users" | "dms" | "invites" | "userBaseDirectory" | "pieceStores" | "events" | "actions" | "emojis" | "token" | "registerStore" | "unregisterStore" | "destroy" | "console" | "arguments" | "commands" | "inhibitors" | "finalizers" | "monitors" | "languages" | "providers" | "extendables" | "tasks" | "serializers" | "permissionLevels" | "gateways" | "schedule" | "mentionPrefix" | "settings" | "application" | "invite" | "owners" | "fetchApplication" | "api" | "addListener" | "on" | "once" | "off" | "removeAllListeners" | "setMaxListeners" | "getMaxListeners" | "listeners" | "rawListeners" | "emit" | "listenerCount" | "prependListener" | "prependOnceListener" | "eventNames" | {
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
            commands: {
                autoAliases: boolean;
                bucket: number;
                cooldown: number;
                cooldownLevel: import("../..").CooldownLevel;
                deletable: boolean;
                description: string | ((language: Language) => LanguageValue);
                extendedHelp: string | ((language: Language) => LanguageValue);
                flagSupport: boolean;
                guarded: boolean;
                hidden: boolean;
                nsfw: boolean;
                permissionLevel: number;
                promptLimit: number;
                promptTime: number;
                quotedStringSupport: boolean;
                requiredPermissions: number | import("@klasa/core").PermissionsFlags | {
                    bitfield: number;
                } | (number | import("@klasa/core").PermissionsFlags | {
                    bitfield: number;
                })[];
                requiredSettings: string[];
                runIn: ChannelType[];
                subcommands: boolean;
                usage: string;
                usageDelim: string;
                aliases: string[];
                name: string;
                enabled: boolean;
            };
            extendables: {
                appliesTo: readonly import("../..").Constructor<unknown>[];
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
                name: string;
                enabled: boolean;
            };
            providers: {
                name: string;
                enabled: boolean;
            };
            arguments: {
                aliases: string[];
                name: string;
                enabled: boolean;
            };
            serializers: {
                aliases: string[];
                name: string;
                enabled: boolean;
            };
            tasks: {
                name: string;
                enabled: boolean;
            };
        };
        createFolders: boolean;
        disabledCoreTypes: string[];
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
        prefix: string | string[];
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
            readonly readableEncoding: BufferEncoding;
            readonly readableEnded: boolean;
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
            readonly readableEncoding: BufferEncoding;
            readonly readableEnded: boolean;
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
    owners: string[];
    permissionLevels: (permissionLevels: import("../..").PermissionLevels) => import("../..").PermissionLevels;
    production: boolean;
    readyMessage: string | ((client: import("@klasa/core").Client) => string) | (string & ((client: import("@klasa/core").Client) => string)) | (((client: import("@klasa/core").Client) => string) & string);
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
                schema: (schema: Schema) => Schema;
            };
            guilds: {
                schema: (schema: Schema) => Schema;
            };
            users: {
                schema: (schema: Schema) => Schema;
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
