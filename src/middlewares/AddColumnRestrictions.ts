import { Injectable, NestMiddleware } from "@nestjs/common";
import { addColumnRestriciton } from "./functions/addColumnRestrictions";



@Injectable()
export class AddColumnRestrictions implements NestMiddleware {

    use(req: any, res: any, next: (error?: any) => void) {
        const originalSend = res.send;
        res.send = async function (body: any) {
            let bodyObject = JSON.parse(body);
            await addColumnRestriciton(bodyObject)
            originalSend.call(this, JSON.stringify(bodyObject));
        }
        next();
    }
}