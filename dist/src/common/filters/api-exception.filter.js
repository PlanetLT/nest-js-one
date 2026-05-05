"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const httpStatusTitles = {
    [common_1.HttpStatus.BAD_REQUEST]: 'Bad Request',
    [common_1.HttpStatus.UNAUTHORIZED]: 'Unauthorized',
    [common_1.HttpStatus.FORBIDDEN]: 'Forbidden',
    [common_1.HttpStatus.NOT_FOUND]: 'Not Found',
    [common_1.HttpStatus.CONFLICT]: 'Conflict',
    [common_1.HttpStatus.TOO_MANY_REQUESTS]: 'Too Many Requests',
    [common_1.HttpStatus.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
};
let ApiExceptionFilter = class ApiExceptionFilter {
    catch(exception, host) {
        const response = host.switchToHttp().getResponse();
        const body = this.buildResponse(exception);
        response.status(body.statusCode).json(body);
    }
    buildResponse(exception) {
        if (exception instanceof common_1.HttpException) {
            const statusCode = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            if (typeof exceptionResponse === 'string') {
                return {
                    message: exceptionResponse,
                    title: this.getTitle(statusCode, exception.name),
                    statusCode,
                };
            }
            return {
                message: exceptionResponse.message ?? exception.message,
                title: exceptionResponse.title ??
                    exceptionResponse.error ??
                    this.getTitle(statusCode, exception.name),
                statusCode,
            };
        }
        return {
            message: 'Internal server error',
            title: 'Internal Server Error',
            statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        };
    }
    getTitle(statusCode, fallback) {
        return httpStatusTitles[statusCode] ?? fallback;
    }
};
exports.ApiExceptionFilter = ApiExceptionFilter;
exports.ApiExceptionFilter = ApiExceptionFilter = __decorate([
    (0, common_1.Catch)()
], ApiExceptionFilter);
//# sourceMappingURL=api-exception.filter.js.map