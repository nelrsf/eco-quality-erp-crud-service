import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ObjectId } from "mongodb";
import { isOwner } from "src/middlewares/functions/isOwner";
import { Connection } from "src/server/mongodb/connection";
import { StructureConfiguration } from "src/structure-configuration";

@Injectable()
export class TableReadGuard implements CanActivate {

    constructor(private config: StructureConfiguration) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();
        const module = request.params.module;
        const table = request.params.table;
        const value = request.params?.value;
        const id = request.params.id;
        const userId = request.userId;
        if (table === "users" && id === userId) {
            return true;
        }
        const client = Connection.getClient();
        const adminDb = client.db('_eq__admin_manager');
        const usersCollection = adminDb.collection('users');
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
        if (table === this.config.constants.usersTable && user.Email === value) {
            return true;
        }
        if (!user) {
            throw new UnauthorizedException();
        }
        const isUserOwner = await isOwner(module, userId);
        if (isUserOwner) {
            return true;
        }
        const db = client.db(module);
        const usersModuleCollection = db.collection(this.config.constants.usersTable);
        const userPerModule = await usersModuleCollection.findOne({ Email: user.Email });
        if (!userPerModule) {
            throw new UnauthorizedException();
        }
        const profilesCollection = db.collection(this.config.constants.profiesTable);
        const profile = await profilesCollection.findOne({ Nombre: userPerModule.Perfil });
        if (!profile) {
            throw new UnauthorizedException();
        };

        if (table === this.config.constants.profiesTable && userPerModule?.Perfil === value) {
            return true;
        }
        const tableToRead = db.collection(table);
        const tableToReadMetadata = await tableToRead.findOne({ name__document_md: "document-metadata" });
        const tableReadPermissions = tableToReadMetadata?.table_metadata
            ?.permissions?.read;
        if (tableReadPermissions?.includes(profile._id.toString())) {
            return true;
        }
        const moduleToRead = db.collection(module + '__module__metadata__');
        const moduleToReadMetadata = await moduleToRead.findOne({ name: module });
        const readPermissions = moduleToReadMetadata?.permissions?.read;
        if (!readPermissions) {
            throw new UnauthorizedException();
        }
        if (readPermissions.includes(profile._id.toString())) {
            return true;
        } else {
            throw new UnauthorizedException();
        }

    }
}