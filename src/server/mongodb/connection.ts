import { MongoClient } from "mongodb";
require('dotenv').config();

export class Connection {

    private static client: MongoClient;

    private constructor() { }

    public static getClient(): any {
        if(!this.client){
            const dbConnectionUrl = process.env.DATABASE_URL;
            this.client = new MongoClient(dbConnectionUrl, {
              maxConnecting: 10,
            });
        } 
        return this.client;
    }

}