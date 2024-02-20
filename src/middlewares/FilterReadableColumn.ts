import { Injectable, NestMiddleware } from "@nestjs/common";
import { Table } from "src/eqmodules/tables/entities/table.entity";
import { isOwner } from "./functions/isOwner";
import { isAdmin } from "./functions/isAdmin";
import { getProfile } from "./functions/getProfile";
import { Column } from "src/eqmodules/columns/entities/column.entity";



@Injectable()
export class FilterReadableColumn implements NestMiddleware {

    constructor() { }

    use(req: any, res: any, next: (error?: any) => void) {
        const originalSend = res.send;
        res.send = async function (body: any) {
            let bodyObject: any = JSON.parse(body);
            if (!bodyObject) {
                originalSend.call(this, JSON.stringify(bodyObject));
                return;
            }
            const isUserOwner = await isOwner(req.params.module, req.userId);
            const isUserAdmin = await isAdmin(req.params.module, req.userId);

            if(isUserAdmin || isUserOwner){
                originalSend.call(this, JSON.stringify(bodyObject));
                return;
            }
            const profile = await getProfile(req.params.module, req.userId)


            if(!bodyObject?.permissions?.read?.includes(profile?._id?.toString())){
                originalSend.call(this, JSON.stringify({}));
                return;
            }


            originalSend.call(this, JSON.stringify(bodyObject));
        }
        next();
    }

}