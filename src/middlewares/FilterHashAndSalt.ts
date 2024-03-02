import { Injectable, NestMiddleware } from "@nestjs/common";



@Injectable()
export class FilterHashAndSalt implements NestMiddleware {

    use(req: any, res: any, next: (error?: any) => void) {
        if (req.url.includes("/_eq__admin_manager/users")) {
            const originalSend = res.send;
            res.send = async function (body: any) {
                let bodyObject = JSON.parse(body);
                delete bodyObject?.salt;
                delete bodyObject?.password;
                originalSend.call(this, JSON.stringify(bodyObject));
            }
        }
        next();
    }


}