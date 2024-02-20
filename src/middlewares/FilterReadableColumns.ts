import { Injectable, NestMiddleware } from "@nestjs/common";
import { Table } from "src/eqmodules/tables/entities/table.entity";
import { isOwner } from "./functions/isOwner";
import { isAdmin } from "./functions/isAdmin";
import { getProfile } from "./functions/getProfile";
import { Column } from "src/eqmodules/columns/entities/column.entity";



@Injectable()
export class FilterReadableColumns implements NestMiddleware {

    constructor() { }

    use(req: any, res: any, next: (error?: any) => void) {
        const originalSend = res.send;
        res.send = async function (body: any) {
            let bodyObject: Array<any> = JSON.parse(body);
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

            Object.keys(bodyObject).forEach(
                (columnId: string) => {
                    if (!bodyObject[columnId]?.permissions?.read?.includes(profile?._id?.toString())) {
                        delete bodyObject[columnId];
                    } 
                }
            )

            originalSend.call(this, JSON.stringify(bodyObject));
        }
        next();
    }

}