import { Event } from '@klasa/core';
export default class extends Event {
    run(failure: string | Error): void;
    init(): void;
}
