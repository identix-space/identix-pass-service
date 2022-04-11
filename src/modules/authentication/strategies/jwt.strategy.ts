import {ExtractJwt, Strategy} from 'passport-jwt';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable} from '@nestjs/common';
import {jwtConstants} from '../constants';
import {ValidationPayloadType, ValidationPayloadResponseType} from "../types";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: ValidationPayloadType): Promise<ValidationPayloadResponseType> {
    const {sub: id, username, firstName, secondName, middleName,
      department, position, phone, internalTelephone, mobilePhone, email, userRole: role} = payload;

    return {id, username, firstName, secondName, middleName,
      department, position, phone, internalTelephone, mobilePhone, email, role};
  }
}
