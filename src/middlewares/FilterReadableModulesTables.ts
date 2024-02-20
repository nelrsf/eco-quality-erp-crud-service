import { Injectable, NestMiddleware } from "@nestjs/common";
import { Table } from "src/eqmodules/tables/entities/table.entity";
import { isOwner } from "./functions/isOwner";
import { isAdmin } from "./functions/isAdmin";
import { getProfile } from "./functions/getProfile";
import { deleteUnauthorizedTables } from "./functions/deleteUnauthorizedTables";

@Injectable()
export class FilterReadableModulesTables implements NestMiddleware {
    constructor() { }

    use(req: any, res: any, next: (error?: any) => void) {
        const originalSend = res.send;
        res.send = async function (body: any) {
            let bodyObject: Array<any>;
            try {
                bodyObject = JSON.parse(body);
            } catch (error) {
                originalSend.call(this, JSON.stringify([]));
                return;
            }

            if (!Array.isArray(bodyObject)) {
                originalSend.call(this, JSON.stringify([]));
                return;
            }

            // Usar Promise.all para esperar que todas las promesas se resuelvan
            const filteredDataPromises = bodyObject.map(async (module: any) => {

                const isUserOwner = await isOwner(module.name, req.userId);
                const isUserAdmin = await isAdmin(module.name, req.userId);
    
                if (isUserAdmin || isUserOwner) {
                    return module;
                }

                const profile = await getProfile(module?.name, req.userId);
                module.tables = deleteUnauthorizedTables(module?.tables, profile);
                return module;
            });

            // Esperar a que todas las promesas en filteredDataPromises se resuelvan
            Promise.all(filteredDataPromises).then((filteredData) => {
                originalSend.call(this, JSON.stringify(filteredData));
            }).catch((error) => {
                console.error('Error procesando los módulos:', error);
                originalSend.call(this, JSON.stringify([]));
            });
        };
        next();
    }
}
