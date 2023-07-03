import { Injectable, NestMiddleware } from "@nestjs/common";
import { ObjectId } from "mongodb";
import { Connection } from "src/server/mongodb/connection";


@Injectable()
export class FilterUserModules implements NestMiddleware {

    use(req: any, res: any, next: (error?: any) => void) {
        const originalSend = res.send;
        res.send = async function (body: any) {
            let bodyObject = JSON.parse(body);
            const userId = req?.userId;
            if (!userId || !Array.isArray(bodyObject)) {
                originalSend.call(this, JSON.stringify({}));
                return;
            }
            let filteredModulesByUser = bodyObject.filter(
                (db) => {
                    return db?.owner === userId;
                }
            );

            let restOfModules = bodyObject.filter(
                (db) => {
                    return !filteredModulesByUser.includes(db);
                }
            );

            const client = Connection.getClient();
            const user = await client.db('_eq__admin_manager').collection('users').findOne({ _id: new ObjectId(userId) });

            const foreignModules = await Promise.all(
                restOfModules.map(
                    async (m: any) => {
                        const foreignUser = await client.db(m.name).collection('__users_module_table__').findOne(
                            { Email: user?.Email }
                        );
                        return {
                            module: m,
                            foreignUser: foreignUser
                        }
                    }
                )
            );

            const filteredForeignModules = foreignModules.filter(
                (fm: any) => {
                    return fm?.foreignUser !== undefined && fm?.foreignUser !== null;
                }
            )
                .map(
                    (fm: any) => {
                        return fm.module;
                    }
                );

            const modulesResult = [].concat(filteredModulesByUser, filteredForeignModules);

            originalSend.call(this, JSON.stringify(modulesResult));
        }
        next();
    }


}