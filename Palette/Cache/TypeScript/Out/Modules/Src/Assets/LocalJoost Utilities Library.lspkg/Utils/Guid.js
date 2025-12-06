"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Guid = void 0;
class Guid {
    static newGuid() {
        var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        return guid;
    }
}
exports.Guid = Guid;
//# sourceMappingURL=Guid.js.map