import * as crud from './crud.js';
import { Stand } from './stand.js';

window.addEventListener('load', async (event) =>{
    let farms = await crud.getAllStands(); // load in all stands
    //console.log(farms);
    for(let i =0; i < farms.length; i++){ // display all stands on listings page
        createStand(farms[i]);
    }
});
    

async function createStand(stand) {
    // Get a reference to the listing container
    const listingContainer = document.getElementById('listing-container');

    // Check if the last row is full
    let lastRow = listingContainer.lastElementChild;
    if (!lastRow || lastRow.children.length === 3) {
        // Create a new row
        lastRow = document.createElement('div');
        lastRow.className = 'row';
        listingContainer.appendChild(lastRow);
    }

    // Create a new column for the stand
    let col = document.createElement('div');
    col.className = 'col-md-4';

    // Create the stand card
    let item = document.createElement("div");
    item.classList.add("card", "mb-3", "listing");

    let box = document.createElement("div");
    if (i % 2 == 0) {
        box.classList.add("greybox");
    }
    if (i % 2 == 1) {
        box.classList.add("whitebox");
    }
    let container = document.createElement("div");
    container.classList.add("container");

    let row = document.createElement("div");
    row.classList.add("row", "no-gutters");

    let itemImageDiv = document.createElement("div");
    itemImageDiv.classList.add("col-md-12");
    let itemImage = document.createElement("img");
    itemImage.classList.add("card-img");
    itemImage.alt = "Listing Image";
    itemImage.src = stand.image_url;
    if (stand.image_url == null || stand.image_url == "" || stand.image_url == undefined) {
        itemImage.src = "https://www.libertyhillfarm.com/wp-content/uploads/2021/06/lhf-homepage-002.jpg";
    }
    else{
        itemImage.src = stand.image_url;
    }
    itemImage.setAttribute("id", "stand_image");
    itemImageDiv.append(itemImage);

    let cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    cardBody.setAttribute("id", stand.name);

    let header = document.createElement("h5");
    header.classList.add("card-title");
    header.innerText = stand.name; // Use innerText instead of value

    let tag = document.createElement("p");
    tag.classList.add("card-text");
    tag.innerText = stand.tagline; // Use innerText instead of value

    let contact = document.createElement("p");
    contact.classList.add("card-text");
    if (stand.contact_info == null || stand.contact_info == "" || stand.contact_info == undefined) {
        contact.innerText = "";
    }
    else{
        contact.innerText = stand.contact_info;
    }
     cardBody.append(header, tag, contact);
     row.append(itemImageDiv);
     item.addEventListener("click", async (event) => {
         const standId = stand.farmId;
         window.location.href = `farmpage.html?id=${standId}`;
     });
     container.append(row);
     box.append(container);
     item.append(box, cardBody);

     col.appendChild(item);
     lastRow.appendChild(col);
}

// document.getElementById("update").addEventListener("click", async (event) => {
//     let standName = document.getElementById("standToUpdate").value;
//     let nameConflict = await crud.nameExists(standName);
//     if (!nameConflict) {
//         alert(standName + " does not exist. Click 'New Stand!' to create a new stand.");
//     }
//     else {
//         await crud.save(standName);
//         let stand_update = await crud.read(standName);
//         console.log(stand_update);
//         await crud.store_address(stand_update.address);
//         window.location.href = 'createFarm.html';
//     }
// });

// document.getElementById("delete").addEventListener("click", async (event) => {
//     let standName = document.getElementById("standToDelete").value;
//     let nameConflict = await crud.nameExists(standName);
//     if (!nameConflict) {
//         alert(standName + " does not exist. Click 'New Stand!' to create a new stand.");
//     }
//     else {
//         //console.log(standName + " removing");
//         let success = await crud.removeStand(standName);
//         if (success){
//             window.location.reload();
//         }
//         else{
//             alert("Error: Could not remove stand");
//         }
//     }
// });

let i = 0;

function createTestDiv(){
    console.log("Creating test div!");
}

