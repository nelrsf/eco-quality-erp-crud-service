import { ObjectId } from "mongodb";
import { Connection } from "src/server/mongodb/connection";

export async function isOwner(module: string, userId: string): Promise<boolean> {
    if (!module || !userId) {
        return false;
    }
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
    return moduleMetadataDocument?.owner === userId;
}