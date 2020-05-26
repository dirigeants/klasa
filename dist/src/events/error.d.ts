import { Event } from '@klasa/core';
export default class extends Event {
    run(error: Error): void;
    init(): void;
}
