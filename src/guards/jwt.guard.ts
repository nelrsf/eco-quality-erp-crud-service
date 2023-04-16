import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import axios from 'axios';

@Injectable()
export class JwtGuard implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    let token = request.headers.authorization;

    if (!token) {
      throw new HttpException('Token no suministrado', HttpStatus.UNAUTHORIZED);
    }

    token = token.replace("Bearer ", "")

    try {
      const response = await axios.post('http://localhost:3001/auth/validate', {  }, {
        headers: {
            Authorization: token
        }
      });
      if (!response.data.id) {
        throw new HttpException('Token invalido', HttpStatus.UNAUTHORIZED);
      }
    } catch (error) {
      if (error.response.status === HttpStatus.UNAUTHORIZED) {
        throw new HttpException('Token invalido', HttpStatus.UNAUTHORIZED);
      }
      throw new HttpException('Error en la validación del token', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return next.handle();
  }
}
