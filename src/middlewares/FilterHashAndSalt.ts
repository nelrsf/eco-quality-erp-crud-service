import { Injectable, NestMiddleware } from "@nestjs/common";



@Injectable()
export class FilterHashAndSalt implements NestMiddleware {

    constructor() { }

    use(req: any, res: any, next: (error?: any) => void) {
        const originalSend = res.send;
        res.send = async function (body: any) {
            if(req.params.module === '_eq__admin_manager' && req.params.table === 'users'){
                let bodyObject = JSON.parse(body);
                delete bodyObject.salt;
                delete bodyObject.password;
                originalSend.call(this, JSON.stringify(bodyObject));
            }
        }
        next();
    }


}