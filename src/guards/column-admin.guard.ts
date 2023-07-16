import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ObjectId } from "mongodb";
import { Connection } from "src/server/mongodb/connection";

@Injectable()
export class ColumnAdminGuard implements CanActivate {

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();
        const module = request.body.module;
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
        if(moduleMetadataDocument?.owner === userId){
            return true;
        }
        const usersModuleCollection = db.collection('__users_module_table__');
        const userPerModule = await usersModuleCollection.findOne({ Email: user.Email });
        if (!userPerModule) {
            throw new UnauthorizedException();
        }
        const profilesCollection = db.collection('__profiles_module_table__');
        const profile = await profilesCollection.findOne({ Nombre: userPerModule.Perfil });
        if(profile.EsAdmin){
            return true;
        } else {
            throw new UnauthorizedException();
        };
    }
}