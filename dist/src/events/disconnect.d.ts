import { Event } from '@klasa/core';
export default class extends Event {
    run(error: {
        code: number;
        reason: string;
    }): void;
}
