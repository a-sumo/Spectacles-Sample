"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VectorUtils = void 0;
class VectorUtils {
    static scalar3(x) {
        return new vec3(x, x, x);
    }
    /**
 * Calculates the signed angle between two vectors around an axis
 * @param from Starting vector
 * @param to Target vector
 * @param axis Reference axis to determine sign
 * @returns Signed angle in degrees
 */
    static getSignedAngle(from, to, axis) {
        // Get the unsigned angle
        from = from.normalize();
        to = to.normalize();
        const unsignedAngle = Math.acos(Math.min(1, Math.max(-1, from.dot(to)))) * (180 / Math.PI);
        // Determine the sign using the cross product and axis
        const cross = from.cross(to);
        const sign = Math.sign(cross.dot(axis));
        return unsignedAngle * sign;
    }
}
exports.VectorUtils = VectorUtils;
//# sourceMappingURL=VectorUtils.js.map