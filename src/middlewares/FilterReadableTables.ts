import { Injectable, NestMiddleware } from "@nestjs/common";
import { Table } from "src/eqmodules/tables/entities/table.entity";
import { isOwner } from "./functions/isOwner";
import { isAdmin } from "./functions/isAdmin";
import { getProfile } from "./functions/getProfile";



@Injectable()
export class FilterReadableTables implements NestMiddleware {

    constructor() { }

    use(req: any, res: any, next: (error?: any) => void) {
        const originalSend = res.send;
        res.send = async function (body: any) {
            let bodyObject: Array<any> = JSON.parse(body);
            if (!bodyObject) {
                originalSend.call(this, JSON.stringify(bodyObject));
                return;
            }

            if (!Array.isArray(bodyObject)) {
                originalSend.call(this, JSON.stringify(bodyObject));
                return;
            }

            const isUserOwner = await isOwner(req.params.module, req.userId);
            const isUserAdmin = await isAdmin(req.params.module, req.userId);

            if(isUserAdmin || isUserOwner){
                originalSend.call(this, JSON.stringify(bodyObject));
                return;
            }
            let filteredTables = [];
            const profile = await getProfile(req.params.module, req.userId)

            bodyObject.forEach(
                (table: Table) => {
                    if (!table?.permissions?.read?.includes(profile?._id?.toString())) {
                        return;
                    } 
                    filteredTables.push(table);
                }
            )

            originalSend.call(this, JSON.stringify(filteredTables));
        }
        next();
    }

}