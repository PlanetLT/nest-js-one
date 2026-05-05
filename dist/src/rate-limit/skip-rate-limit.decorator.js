"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkipRateLimit = void 0;
const common_1 = require("@nestjs/common");
const rate_limit_constants_1 = require("./rate-limit.constants");
const SkipRateLimit = () => (0, common_1.SetMetadata)(rate_limit_constants_1.SKIP_RATE_LIMIT_KEY, true);
exports.SkipRateLimit = SkipRateLimit;
//# sourceMappingURL=skip-rate-limit.decorator.js.map