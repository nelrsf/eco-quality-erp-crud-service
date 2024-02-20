import { ObjectId } from "mongodb";
import { Connection } from "src/server/mongodb/connection";
import { StructureConfiguration } from "src/structure-configuration";

export async function getProfile(module: string, userId: string){

    const config = new StructureConfiguration();
    const client = Connection.getClient();
    const adminDb = client.db('_eq__admin_manager');
    const usersCollection = adminDb.collection('users');
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
        return false;
    }
    const db = client.db(module);
    const moduleMetadataColection = db.collection(module + '__module__metadata__');
    const moduleMetadataDocument = await moduleMetadataColection.findOne({ name: module });
    if (moduleMetadataDocument?.owner === userId) {
        return;
    }
    const usersModuleCollection = db.collection(config.constants.usersTable);
    const userPerModule = await usersModuleCollection.findOne({ Email: user.Email });
    if (!userPerModule) {
        return;
    }
    const profilesCollection = db.collection(config.constants.profiesTable);
    return await profilesCollection.findOne({ Nombre: userPerModule.Perfil });
}