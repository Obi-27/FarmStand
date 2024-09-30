import { Stand, Listing } from './stand.js';
import { Product, ListingProduct } from './product.js';

let db = null;

let serverAddress = "http://127.0.0.1"
let serverPort = "3000"

window.addEventListener('load', async (event) => {
  console.log("loading");
  db = new PouchDB('mydb');

  try {
    const result = await db.allDocs({
      include_docs: true,
      attachments: true,
    });
    // Display the documents in the output element
    if (result !== undefined) {
    }
    result.rows.forEach((row) => {
      const id = row.doc._id;
      const value = row.doc.value;
      console.log("id: ", id, "value: ", value);
    });
  } catch (err) {
    console.log(err);
  }
});


export async function getAllStands() {
  const response = await fetch(`${serverAddress}:${serverPort}/readAll`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data;
}

// CRUD create function to create a new stand in pouchDB
export async function addStand(stand) {
  // try {
  //     var response = await db.put({
  //       _id: stand.name,
  //       value: stand,
  //     });
  //   } catch (err) {
  //     console.log(err);
  //   }
  const response = await fetch(`${serverAddress}:${serverPort}/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(stand),
  });
  const data = await response.json();
  return data;
}

export async function idExists(id) {
  try {
    const response = await fetch(`${serverAddress}:${serverPort}/idExists/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    //If the id exists, the response will be true
    const data = await response.json();
    return data.exists;
  }
  catch (err) {
    return true;
  }

}

export async function nameExists(name) {



  try {
    const response = await fetch(`${serverAddress}:${serverPort}/nameExists/${name}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    //If the name exists, the response will be true
    const data = await response.json();
    return data.exists;
  }
  catch (err) {
    return true;
  }

}



// delete function to delete specified stand from database. Will return true if succesful. False otherwise. 
export async function removeStand(name) {
  try {
    const response = await fetch(`${serverAddress}:${serverPort}/delete/${name}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    return data.success;
  }
  catch (err) {
    console.log(err);
    return false;
  }
}
// deletes everything in pouchDB
export async function destroy() {
  if (db !== null) {
    await db.destroy();
  } else {
    console.log("database doesnt exist");
  }
}

// CRUD update function to update the specified stand

//name is the name of the stand that is being updated, stand is the stand data replacing the old one
export async function updateStand(stand) {
    try {
      const response = await fetch(`${serverAddress}:${serverPort}/update/${stand.farmId}`, {
          method: 'PUT',
          headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify(stand),
    });
      const data = await response.json();
      return data;
    //await db.remove(doc); //removing the version of the stand before updates
    // var response = await db.put({ //create a new id with the name and value of the updated stand
    //   _id: newStand.name,
    //   value: newStand,
    // });
  } catch (err) {
    console.log(err);
  }
}

export async function read(name) {

  try {
    const response = await fetch(`${serverAddress}:${serverPort}/read/${name}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    //If the name exists, the response will be true
    const data = await response.json();
    return data;
  }
  catch (err) {
    return {}
  };
}


//helper function that will get a stands name from its id
export async function getNameFromId(id) {
  const response = await fetch(`${serverAddress}:${serverPort}/nameFromId/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data.result;
}


//helper function to save the name of the stand that user is trying to update
export async function save(name) {
  try {
    var response = await db.put({
      _id: 'readyToUpdate',
      value: name,
    });
  } catch (err) {
    console.log(err);
  }
}

//helper function to retrieve the name of the stand the user is trying to update
export async function unsave(name) {
  try {
    var doc = await db.get(name);
    db.remove(doc);
    return doc;
  } catch (err) {
    return false;
  }
}

export async function store_address(address) {
  try {
    var response = await db.put({
      _id: 'address',
      value: address,
    });
  } catch (err) {
    console.log(err);
  }
}

export async function restore_address(address) {
  try {
    var doc = await db.get(address);
    db.remove(doc);
    return doc;
  } catch (err) {
    return false;
  }
}
// CRUD read function
export async function readStand(name) {
  try {
    var doc = await db.get(name);
    return doc;
  } catch (err) {
    return false;
    console.log(err);
  }
}


