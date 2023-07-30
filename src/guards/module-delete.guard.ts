import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Connection } from "src/server/mongodb/connection";

@Injectable()
export class ModuleDeleteGuard implements CanActivate {

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const client = Connection.getClient();

        const request = context.switchToHttp().getRequest();
        const userId = request.userId;
        const module = request.body?.module;

        const collection = await client.db(module).collection(module + '__module__metadata__');
        const documentMetadata = await collection.findOne({ name: module });
        const owner = documentMetadata.owner;


        if (owner === userId) {
            return true;
        } else {
            throw new UnauthorizedException()
        }
    }

}