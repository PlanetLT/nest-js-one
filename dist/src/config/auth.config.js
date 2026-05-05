"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_REFRESH_EXPIRES_IN = exports.JWT_ACCESS_EXPIRES_IN = exports.JWT_REFRESH_SECRET = exports.JWT_ACCESS_SECRET = void 0;
exports.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? 'development-access-secret-change-me';
exports.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? 'development-refresh-secret-change-me';
exports.JWT_ACCESS_EXPIRES_IN = (process.env.JWT_ACCESS_EXPIRES_IN ??
    '15m');
exports.JWT_REFRESH_EXPIRES_IN = (process.env.JWT_REFRESH_EXPIRES_IN ??
    '7d');
//# sourceMappingURL=auth.config.js.map