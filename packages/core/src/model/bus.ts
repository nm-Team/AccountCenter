import log from './logger';

class EventBus {
    private listeners: { [key: string]: Function[] } = {};

    public on(event: string, listener: Function) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(listener);
    }

    public once(event: string, listener: Function) {
        const onceListener = (...args: any[]) => {
            listener(...args);
            this.off(event, onceListener);
        };
        this.on(event, onceListener);
    }

    public off(event: string, listener: Function) {
        if (!this.listeners[event]) {
            return;
        }
        this.listeners[event] = this.listeners[event].filter((l) => l !== listener);
    }

    public emit(event: string, ...args: any[]) {
        log('BUS', event, ...args);
        if (!this.listeners[event]) {
            return;
        }
        this.listeners[event].forEach((listener) => {
            listener(...args);
        });
    }
}

const bus = new EventBus();

export default bus;
