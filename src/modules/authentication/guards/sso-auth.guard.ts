import {Injectable, ExecutionContext} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {Observable} from 'rxjs';

@Injectable()
export class SsoAuthGuard extends AuthGuard('sso') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const skipAuthentication =
      process.env.SKIP_AUTHENTICATION && process.env.SKIP_AUTHENTICATION === "true";

    if (skipAuthentication) {
      return true;
    }

    return super.canActivate(context);
  }
}