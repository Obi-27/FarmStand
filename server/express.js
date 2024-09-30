import exp from 'constants';
import express, { json } from 'express';
import * as path from 'path';
import * as url from 'url';
import { MongoClient } from 'mongodb';
import { client } from './connect.js';
import cors from 'cors';





const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientFilePath = getClientPath();
const UIPath = getUIPath();


async function createStand() {

}

async function readStand() {

}

async function updateStand() {

}

async function deleteStand() {

}




const app = express();


app.use(cors());

const port = 3000;
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use('/', express.static(clientFilePath))
app.use("/docs/ui-design", express.static(UIPath))

function getClientPath() {
    let directory = __dirname.split('/');
    directory.pop();
    directory.push("client");
    return directory.join("/");
}

function getUIPath() {
    let directory = __dirname.split('/');
    directory.pop();
    directory.push("docs");
    directory.push("ui-design");
    return directory.join("/");
}


app.post("/create", async (req, res) => {
    console.log("working")
    const options = req.body;
    console.log(options);
    res.status(200)
    try {
        await client.connect();
        const result = await client.db("farmstand").collection("stands").insertOne(options);
        res.status(200).json({ insertedId: result.insertedId });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e });
    } finally {
        await client.close();
    }

});

app.get("/read/:name", async (req, res) => {
    var name = req.params.name;
   // name = name.toLowerCase();
    console.log(name);
    try {
        await client.connect();
        let matches = await client.db("farmstand").collection("stands").find({ name: name}).toArray();
        if (matches.length > 1) {
            res.status(500).json({ error: "Multiple stands" });
        } 
        else if (matches.length < 0 ){
            res.status(500).json({ error: "No stands found" });
        }
        else {
            res.status(200).json(matches[0]);
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e });
    } finally {
        await client.close();
    }
});


app.get("/readAll", async (req, res) => {
    try {
        await client.connect();
        const result = await client.db("farmstand").collection("stands").find().sort({name: 1}).toArray();
        res.status(200).json(result);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e });
    } finally {
        await client.close();
    }
});

app.get("/idExists/:id", async (req, res) => {
    const id = req.params.id;
    try {
        await client.connect();
        let matches = await client.db("farmstand").collection("stands").find({ farmId: id }).toArray();
        if (matches.length > 0) {
            res.status(200).json({ exists: true });
        } else {
            res.status(200).json({ exists: false });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e });
    } finally {
        await client.close();
    }
});


app.get("/nameExists/:name", async (req, res) => {
    const name = req.params.name;
    try {
        await client.connect();
        let matches = await client.db("farmstand").collection("stands").find({ name: name }).toArray();
        if (matches.length > 0) {
            res.status(200).json({ exists: true });
        } else {
            res.status(200).json({ exists: false });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e });
    } finally {
    
        await client.close();
    }
});


app.put("/update/:id", async (req, res) => {
    const id = req.params.id;
    const stand = req.body;
    try {
        await client.connect();
        for(let i in Object.entries(stand)){
            let [key, value] = Object.entries(stand)[i];
            await client.db("farmstand").collection("stands").updateOne({farmId: stand.farmId},{$set:{[key]:value }});
        }
        res.status(200).json({ success: true});
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e });
    } finally {
        await client.close();
    }
});

app.get("/nameFromId/:id", async (req, res) => {

    const id = req.params.id;
    try {
        await client.connect();
        let matches = await client.db("farmstand").collection("stands").find({ farmId: id }).toArray();
        if (matches.length > 1) {
            res.status(500).json({ error: "Multiple stands" });
        } 
        else if (matches.length < 0 ){
            res.status(500).json({ error: "No stands found" });
        }
        else if (matches.length == 1){
            res.status(200).json({result: matches[0].name});
        }
        else{
            res.status(500).json({ error: "No stands found" });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e });
    } finally {
        await client.close();
    }
});




app.delete("/delete/:name", async (req, res) => {
    //console.log("Deleting...")
    const name = req.params.name;
    try {
        await client.connect();
        const result = await client.db("farmstand").collection("stands").deleteMany({ name: name });
        //console.log(result);
        res.status(200).json({ success: true });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e });
    } finally {
        await client.close();
    }
});



app.get('*',function (req, res) {
    res.redirect('/homepage.html');
});


app.listen(port, (err) => {
    if (err) {
        console.log("There was an error: ", err);
        return;
    }
    console.log(`Server started on port ${port}`);
});



