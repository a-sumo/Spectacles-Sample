"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pose = void 0;
class Pose {
    constructor(rotation, position) {
        this._rotation = rotation;
        this._position = position;
    }
    get rotation() {
        return this._rotation;
    }
    get position() {
        return this._position;
    }
    set rotation(value) {
        this._rotation = value;
    }
    set position(value) {
        this._position = value;
    }
    static fromTransform(transform) {
        return new Pose(transform.getWorldRotation(), transform.getWorldPosition());
    }
}
exports.Pose = Pose;
//# sourceMappingURL=Pose.js.map