import { RichDisplay, RichDisplayEmojisObject } from './RichDisplay';
import type { Embed, EmojiResolvable } from '@klasa/core';

export interface RichMenuEmojisObject extends RichDisplayEmojisObject {
    first: never;
    back: never;
    forward: never;
    last: never;
    jump: never;
    info: never;
    stop: never;
    zero: EmojiResolvable;
    one: EmojiResolvable;
    two: EmojiResolvable;
    three: EmojiResolvable;
    four: EmojiResolvable;
    five: EmojiResolvable;
    six: EmojiResolvable;
    seven: EmojiResolvable;
    eight: EmojiResolvable;
    nine: EmojiResolvable;
}

export class RichMenu extends RichDisplay {
    public emojis!: RichMenuEmojisObject;

    public constructor(embed?: Embed) {
        super(embed);

        Object.assign(this.emojis, {
            zero: '0⃣',
            one: '1⃣',
            two: '2⃣',
            three: '3⃣',
            four: '4⃣',
            five: '5⃣',
            six: '6⃣',
            seven: '7⃣',
            eight: '8⃣',
            nine: '9⃣'
        });
    }
}