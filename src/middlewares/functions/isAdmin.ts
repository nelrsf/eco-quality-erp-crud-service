import { ObjectId } from "mongodb";
import { Connection } from "src/server/mongodb/connection";
import { StructureConfiguration } from "src/structure-configuration";

export async function isAdmin(module: string, userId: string): Promise<boolean> {
    if (!module || !userId) {
        return false;
    }

    const config = new StructureConfiguration();
    const client = Connection.getClient();
    const adminDb = client.db('_eq__admin_manager');
    const usersCollection = adminDb.collection('users');
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
        return false;
    }
    const db = client.db(module);

    const usersModuleCollection = db.collection(config.constants.usersTable);
    const userPerModule = await usersModuleCollection.findOne({ Email: user.Email });
    if (!userPerModule) {
        return false;
    }
    const profilesCollection = db.collection(config.constants.profiesTable);
    const profile = await profilesCollection.findOne({ Nombre: userPerModule.Perfil });
    return profile.EsAdmin === true;
}