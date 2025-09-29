import { Injectable, NestMiddleware } from "@nestjs/common";
import { Table } from "src/eqmodules/tables/entities/table.entity";
import { isOwner } from "./functions/isOwner";
import { isAdmin } from "./functions/isAdmin";
import { getProfile } from "./functions/getProfile";




@Injectable()
export class FilterReadableTable implements NestMiddleware {

    constructor() { }

    use(req: any, res: any, next: (error?: any) => void) {
        const originalSend = res.send;
        res.send = async function (body: any) {
            let bodyObject: any = JSON.parse(body);
            if (!bodyObject) {
                originalSend.call(this, JSON.stringify(bodyObject));
                return;
            }

            if (bodyObject?.table_metadata?.permissions) {
                bodyObject.table_metadata.permissions.userAccess = {};
            } else if(bodyObject?.table_metadata){
                bodyObject.table_metadata.permissions = {
                    userAccess: {}
                };
            }else {
                originalSend.call(this, JSON.stringify(bodyObject));
                return;
            }

            const isUserOwner = await isOwner(req.params.module, req.userId);
            const isUserAdmin = await isAdmin(req.params.module, req.userId);


            if (isUserAdmin || isUserOwner) {
                bodyObject.table_metadata.permissions.userAccess.edit = true;
                bodyObject.table_metadata.permissions.userAccess.read = true;
                bodyObject.table_metadata.permissions.userAccess.delete = true;
                bodyObject.table_metadata.permissions.isAdmin = isUserAdmin;
                bodyObject.table_metadata.permissions.isOwner = isUserOwner;
                originalSend.call(this, JSON.stringify(bodyObject));
                return;
            }
            const profile = await getProfile(req.params.module, req.userId)


            if (!bodyObject?.table_metadata.permissions?.read?.includes(profile?._id?.toString())) {
                originalSend.call(this, {});
                return;
            } else {
                bodyObject.table_metadata.permissions.read = [profile?._id?.toString()];
                Object.assign(bodyObject.table_metadata.permissions.userAccess, { read: true });
            }

            if (bodyObject.table_metadata?.permissions?.edit?.includes(profile?._id?.toString())) {
                bodyObject.table_metadata.permissions.edit = [profile?._id?.toString()];
                Object.assign(bodyObject.table_metadata.permissions.userAccess, { edit: true });
            }

            if (bodyObject.table_metadata?.permissions?.delete?.includes(profile?._id?.toString())) {
                bodyObject.table_metadata.permissions.delete = [profile?._id?.toString()];
                Object.assign(bodyObject.table_metadata.permissions.userAccess, { delete: true });
            }


            originalSend.call(this, JSON.stringify(bodyObject));
        }
        next();
    }

}

