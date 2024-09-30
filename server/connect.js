import { MongoClient } from 'mongodb';


    const uri = "mongodb+srv://rglazer:Radish@farmstand.bt6b1l7.mongodb.net/test";
    const client = new MongoClient(uri);

    try {
        console.log("Connecting to database...");
        await client.connect();
        console.log("Connected!");
        //await listDatabases(client);
     
    } catch (e) {
        console.error(e);
    }
    finally {
        await client.close();
    }

export {client};


