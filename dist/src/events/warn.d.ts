import { Event } from '@klasa/core';
export default class extends Event {
    run(warning: string | Error): void;
    init(): void;
}
