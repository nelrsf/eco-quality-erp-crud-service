import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus, CanActivate } from '@nestjs/common';
import { Observable } from 'rxjs';
import axios from 'axios';
require('dotenv').config();


@Injectable()
export class JwtGuard implements CanActivate {


  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let token = request.headers.authorization;

    if (!token) {
      throw new HttpException('Token no suministrado', HttpStatus.UNAUTHORIZED);
    }

    token = token.replace("Bearer ", "");

    try {
      const response = await axios.post(process.env.AUTH_URL, {  }, {
        headers: {
            Authorization: token
        }
      });
      if (!response.data.id) {
        return false;
      };
      request.userId = response.data.id;
    } catch (error) {
      return false;
    }

    return true;
  }
}
