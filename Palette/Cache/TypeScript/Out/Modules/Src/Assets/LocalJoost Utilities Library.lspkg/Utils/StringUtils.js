"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StringUtils {
    static appendUrlParameters(source, parameters) {
        if (source.indexOf('?') === -1) {
            return source + '?' + parameters;
        }
        else {
            return source + '&' + parameters;
        }
    }
    static base64Encode(str) {
        return Base64.encode(this.stringToUint8Array(str));
    }
    static stringToUint8Array(str) {
        const arr = new Uint8Array(str.length);
        for (let i = 0; i < str.length; i++) {
            arr[i] = str.charCodeAt(i);
        }
        return arr;
    }
}
exports.default = StringUtils;
//# sourceMappingURL=StringUtils.js.map