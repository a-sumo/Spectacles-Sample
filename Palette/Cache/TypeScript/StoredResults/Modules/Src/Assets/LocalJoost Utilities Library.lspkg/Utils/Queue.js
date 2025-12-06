"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = void 0;
class Queue {
    constructor() {
        this.items = [];
    }
    enqueue(item) {
        this.items.push(item);
    }
    dequeue() {
        return this.items.shift();
    }
    peek() {
        return this.any() ? this.items[0] : undefined;
    }
    isEmpty() {
        return !this.any();
    }
    get length() {
        return this.items.length;
    }
    any() {
        return this.items.length > 0;
    }
    clear() {
        this.items = [];
    }
}
exports.Queue = Queue;
//# sourceMappingURL=Queue.js.map