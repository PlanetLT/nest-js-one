import { CanActivate } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class UserGuard implements CanActivate {
    canActivate(): boolean | Promise<boolean> | Observable<boolean>;
}
