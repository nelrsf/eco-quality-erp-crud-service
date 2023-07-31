import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ObjectId } from "mongodb";
import { Connection } from "src/server/mongodb/connection";
import { StructureConfiguration } from "src/structure-configuration";

@Injectable()
export class ModuleAdminGuard implements CanActivate {

    constructor(private config: StructureConfiguration){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const userId = request.userId;
        const owner = request.body?.owner;

        if (owner === userId) {
            return true;
        }

        const module = request.body?.name;
        const client = Connection.getClient();

        const collection = await client.db('_eq__admin_manager').collection('users');
        const user = await collection.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            throw new UnauthorizedException('Error en la validación de permisos');
        }
        const userPerModuleCollection = await client.db(module).collection(this.config.constants.usersTable);
        const userPerModule = await userPerModuleCollection.findOne({ Email: user.Email });
        const profileRestrictions = await userPerModuleCollection.findOne({ __rows_restrictions__data__: "rows_restrictions" });
        const profile = profileRestrictions.data.find((profileRes) => profileRes.rowId === userPerModule._id.toString());
        const profileCollection = await client.db(module).collection(this.config.constants.profiesTable);
        const profileObject = await profileCollection.findOne({
            _id: new ObjectId(profile.rowIdRestriction
            )
        });

        if (!profileObject.EsAdmin) {
            throw new UnauthorizedException()
        }

        return true;
    }

}