import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus, CanActivate } from '@nestjs/common';
import { Observable } from 'rxjs';
import axios from 'axios';
require('dotenv').config();


@Injectable()
export class JwtGuard implements CanActivate {
  // async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
  //   const request = context.switchToHttp().getRequest();
  //   let token = request.headers.authorization;

  //   if (!token) {
  //     throw new HttpException('Token no suministrado', HttpStatus.UNAUTHORIZED);
  //   }

  //   token = token.replace("Bearer ", "");

  //   try {
  //     const response = await axios.post(process.env.AUTH_URL, {  }, {
  //       headers: {
  //           Authorization: token
  //       }
  //     });
  //     if (!response.data.id) {
  //       throw new HttpException('Token invalido', HttpStatus.UNAUTHORIZED);
  //     };
  //     request.userId = response.data.id;
  //   } catch (error) {
  //     if (error.response.status === HttpStatus.UNAUTHORIZED) {
  //       throw new HttpException('Token invalido', HttpStatus.UNAUTHORIZED);
  //     }
  //     throw new HttpException('Error en la validación del token', HttpStatus.INTERNAL_SERVER_ERROR);
  //   }

  //   return next.handle();
  // }

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
