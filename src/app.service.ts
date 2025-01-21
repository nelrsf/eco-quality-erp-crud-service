import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  formatResponse(data: any) {
    return {
      status: 'success',
      data: data,
    };
  }
}
