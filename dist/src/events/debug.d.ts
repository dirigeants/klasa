import { Event } from '@klasa/core';
export default class extends Event {
    run(warning: Error): void;
    init(): void;
}
