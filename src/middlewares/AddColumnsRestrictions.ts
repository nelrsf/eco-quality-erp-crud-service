import { Injectable, NestMiddleware } from "@nestjs/common";
import { addColumnRestriciton } from "./functions/addColumnRestrictions";



@Injectable()
export class AddColumnsRestrictions implements NestMiddleware {

    use(req: any, res: any, next: (error?: any) => void) {
        const originalSend = res.send;
        res.send = async function (body: any) {
            let bodyObject = JSON.parse(body);
            const promises = Object.keys(bodyObject).map(async (k) => {
                await addColumnRestriciton(bodyObject[k]);
            });
            await Promise.all(promises);
            originalSend.call(this, JSON.stringify(bodyObject));
        }
        next();
    }
}