import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ObjectId } from "mongodb";
import { Connection } from "src/server/mongodb/connection";
import { StructureConfiguration } from "src/structure-configuration";

@Injectable()
export class RowDeleteGuard implements CanActivate {

    constructor(private config: StructureConfiguration){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();
        const module = request.params.module;
        const table = request.params.table;
        const userId = request.userId;
        const client = Connection.getClient();
        const adminDb = client.db('_eq__admin_manager');
        const usersCollection = adminDb.collection('users');
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            throw new UnauthorizedException();
        }
        const db = client.db(module);
        const moduleMetadataColection = db.collection(module + '__module__metadata__');
        const moduleMetadataDocument = await moduleMetadataColection.findOne({ name: module });
        if (moduleMetadataDocument?.owner === userId) {
            return true;
        }
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
        const tableToDelete = db.collection(table);
        const tableToDeleteMetadata = await tableToDelete.findOne({ name__document_md: "document-metadata" });
        const deletePermissions = tableToDeleteMetadata?.table_metadata?.permissions?.delete;
        if (!deletePermissions) {
            throw new UnauthorizedException();
        }
        if (deletePermissions.includes(profile._id.toString())) {
            return true;
        } else {
            throw new UnauthorizedException(); 
        }

    }
}