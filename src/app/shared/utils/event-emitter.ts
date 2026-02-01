/**
 * The event emitter class (Replicates node.js EventEmitter)
 */

export class EventEmitter {
    /** Map of event listeners */
    private listeners = new Map<string, Array<(data: any) => void>>();

    /**
     * Constructor
     */

    constructor() {}

    /**
     * Registers an event listener
     * @param event The event
     * @param listener The listener function
     */

    on(event: string, listener: (data: any) => void) {
        if (!this.listeners.has(event)) this.listeners.set(event, []);
        this.listeners.get(event)!.push(listener);
    }

    /**
     * Emits an event
     * @param event The event
     * @param data The data to pass to listeners
     */

    emit(event: string, data: any) {
        const listeners = this.listeners.get(event);
        if (listeners) {
            for (const listener of listeners) listener(data);
        }
    }
}
