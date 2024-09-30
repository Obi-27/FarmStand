import { Stand, Listing } from './stand.js';
import { Product, ListingProduct } from './product.js';

import * as crud from './crud.js';

// Setting up map
const mapboxgl = window.mapboxgl;
const MapboxGeocoder = window.MapboxGeocoder;
console.log("Were here!")
const access_token = 'pk.eyJ1IjoiemFjaG03MTE1IiwiYSI6ImNsaDlmYTd6cTA2dDIzdG9pNDJrNGxldmEifQ.Dd04Jw0u9SktyqkJj0YM4g';

mapboxgl.accessToken = access_token;
const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    // other options
});

let farmAddress = "";
geocoder.on('result', async function (event) {
    farmAddress = event.result.place_name;
});


// Empty stand to fill with user input
let stand = new Stand("");
const body = document.body;
const queryString = window.location.search;
console.log(queryString);
let saved = null;
let update = null;

window.addEventListener("load", async(event) => {
    createObject("div",'page-content',body,["container-fluid"]);
    createSearchColumns();
    createSearchForFarm();
    createAddFarm();
});


function createObject(tag, id, parent, class_names) {
    let obj = document.createElement(tag);
    class_names.forEach(class_name => obj.classList.add(class_name));
    (id) ? obj.setAttribute("id", id) : null;
    parent.appendChild(obj);
    return obj;
}

function createAddFarm() {
    let card = createObject("div", '', document.getElementById("add-col"), ["card"]);
    let header = createObject("div", '', card, ["card-header", "text-center"]);
    header.innerHTML = 'Add a new Farm';
    let body = createObject("div", '', card, ["card-body", "text-center"]);
    let button = createObject("button", 'create-a-farm', body, ["btn", "btn-outline-secondary"]);
    button.innerHTML = "Create a Farm"

    document.getElementById("create-a-farm").addEventListener("click", removeSearchAndAdd);
}

/**
 * This function creates the card that allows a user to search for an existing farm
 */
function createSearchForFarm() {
    let card = createObject("div", '', document.getElementById("search-col"), ["card"]);
    let header = createObject("div", '', card, ["card-header", "text-center"]);
    header.innerHTML = 'Search for your farm';
    let body = createObject("div", '', card, ["card-body"]);
    let inputGroup = createObject("div", '', body, ["input-group"]);
    let input = createObject("input", 'farm-search-name', inputGroup, ["form-control", "rounded"])
    input.setAttribute("type", "search");
    input.setAttribute("placeholder", "Enter your farm's name")
    let button  = createObject("button", 'farm-search', inputGroup, ["btn", "btn-outline-primary"])
    
    button.innerHTML = "Update Existing Stand";
    
    button.addEventListener("click", async (event) => {
        let inputName = input.value;
        let match = false;
        await crud.save(inputName);
        try {
            let farms = await crud.getAllStands();
            for(const farm in farms) {
                if(inputName.toLowerCase() === farms[farm].name.toLowerCase()) {
                    match = true;
                    saved = await crud.unsave('readyToUpdate');
                    console.log("TITLE", saved);
                    if (saved) {
                        console.log(saved.value);
                        update = await crud.read(farms[farm].name);
                        console.log("FARm", update);
                    }
                    removeSearchAndAdd();
                } 
            }
            
        } catch(err) {
            console.log(err)
        }
        if(match == false) {
            window.alert(`No stand with the name "${inputName}" exists`);
        }
    })
}

function createSearchColumns() {
    let row = createObject("div", 'search-row', document.getElementById("page-content"), ["row", "my-5"]);
    let col1 = createObject("div", 'search-col', row, ["col-lg-5"])
    let col2 = createObject("div", '', row, ["col-lg-2", "my-5"])
    let col3 = createObject("div", 'add-col', row, ["col-lg-5"])
    let middle = createObject("h2", '', col2, ["text-center"])
    middle.innerHTML = "OR"
}


/**
 * This function is called when the user either decides to create a new stand or edit an old stand
 * This function removes the search and create farm card, and replaces them with the stand editing page
 */
function removeSearchAndAdd() {
    let row = document.getElementById("search-row");
    row.remove();
    createPage();
    
}

/**
 * This function is called when the user goes back from the stand editing page, and wants to edit or create another stand
 * This function removes the stand editing page
 */
function removeAddStand() {
    let row1 = document.getElementById("create-row-1");
    let row2 = document.getElementById("create-row-2");
    let row3 = document.getElementById("create-row-3");

    row1.remove();
    row2.remove();
    row3.remove();
}


/**
 * This function creates the Navbar and links at the top of the page
 */
function createNavBar() {
    let page = document.getElementById("page-content");
    let navbar = createObject("nav", '', page, ["nav", "nav-borders", "nav-tabs"]);

    let homeLink = createObject("a", '', navbar, ["nav-link"]);
    homeLink.setAttribute("href", "./homepage.html");
    homeLink.innerHTML = "Home";
    homeLink.addEventListener("click",(event) => {
        removeAddStand();
    });

    let listingPage = createObject("a", '', navbar, ["nav-link"]);
    listingPage.setAttribute("href", "./listings.html");
    listingPage.innerHTML = "Farm Listings";
    listingPage.addEventListener("click", (event) => {
        removeAddStand();
    });

    let createFarm = createObject("a", '', navbar, ["nav-link", "active"]);
    createFarm.innerHTML = "Create a Farm";
    createFarm.setAttribute("href", "./createFarm.html")
    createFarm.addEventListener("click", (event) => {
        removeAddStand();
    });

    createObject("hr", '', page, []);

    //set navbar links
}

/**
 * This function creates the HTML gtif that the edit stand page is built upon
 */
function createGrid() {
    let page = document.getElementById("page-content");
    let row = createObject("div", '', page, ["row"]);
    let row2 = createObject("div", '', page, ["row"]);
    let row3 = createObject("div", '', page, ["row"])
    let col11 = createObject("div", 'column-1', row, ["col-xl-4"]);
    let col12 = createObject("div", 'column-2', row, ["col-xl-8"]);
    let col21 = createObject("div", 'bottom-column', row2, ["col"]);
    let col31 = createObject("div", 'save-column', row3, ["col-md-6", "container", "text-center"])
}

/**
 * This function creates the farm picture card 
 */
function createFarmPicture() {
    let column = document.getElementById("column-1")
    let card = createObject("div", '', column, ["card"]);
    let header = createObject("div", '', card, ["card-header"]);
    header.innerHTML = "Farm Profile"
    let body = createObject("div", '', card, ["card-body", "text-center"]);
    let profileImage = createObject("img", 'profileImage', body, ["rounded-circle"]);
    if (saved) { // if we are updating an existing farm
        profileImage.setAttribute("src", update.image_url);
    } else {
        profileImage.setAttribute("src", "./docs/ui-design/farmIcon.png");
    }

    let info = createObject("div", '', body, ["mb-4", "py-1"])
    info.innerHTML = "Farm Image";
    let imagelabel = createObject("label", 'im', body, ["mb-4", "py-1"]);
    imagelabel.innerHTML = "Enter an image url"

    let uploadInput = createObject("input", 'upload-Image', imagelabel, ["form-control"]);
    if (saved) {
        uploadInput.setAttribute("value", update.image_url);
    }
}

/**
 * This function creates the card where the user can look at or edit all of their farms information
 */
function createInfoCard() {
    let column = document.getElementById("column-2");
    let card = createObject("div", '', column, ["card"]);
    let header = createObject("div", '', card, ["card-header"]);
    header.innerHTML = "Farm Details";
    let body = createObject("div", '', card, ["card-body", "text-center"]);
    let formOutline = createObject("form", 'farm-info', body, [])

    let farmName = createObject("div", 'mb-3', formOutline, []);
    let farmNameLabel = createObject("label", '', farmName, []);
    farmNameLabel.innerHTML = "Enter Farm Name";

    let farmNameInput = createObject("input", 'name_input', farmName, ["form-control"]);
    if (saved) { // if we are updating a farm
        farmNameInput.setAttribute("value", update.name);
    }
    let farmTag = createObject("div", 'mb-3', formOutline, []);
    let farmTagLabel = createObject("label", '', farmTag, []);
    farmTagLabel.innerHTML = "Enter Farm Tagline";

    let farmTagInput = createObject("input", 'tag_input', farmTag, ["form-control"]);
    if (saved) { // if we are updating a farm
        farmTagInput.setAttribute("value", update.tagline);
    }

    let farmAbout = createObject("div", 'mb-3', formOutline, ["form-group"]);
    let farmAboutLabel = createObject("label", '', farmAbout, []);
    farmAboutLabel.innerHTML = "Enter Some extra information about your farm";

    let farmAboutTextbox = createObject("input", 'about_input', farmAbout, ["form-control"]);
    farmAboutTextbox.setAttribute("rows", "8");
    if (saved) { // if we are updating a farm
        farmAboutTextbox.setAttribute("value", update.about);
    }
    let farmAddress = createObject("div", 'mb-3', formOutline, []);
    let farmAddressLabel = createObject("label", '', farmAddress, []);
    farmAddressLabel.innerHTML = "Enter Address";
    //TODO: Enable Farm Address Textbox to be an address selector. 
    let addressFinder = farmAddress.appendChild(geocoder.onAdd(null),);
    addressFinder.setAttribute('class', 'custom-geocoder-class');
    if(saved){
       geocoder._inputEl.value = update.address;
    }
}



function createformGrid() {
    let form = document.getElementById("farm-info")

}

/**
 * This function creates the card where the user can add, edit or remove products from their farm
 */
function createAddProductCard() {
    let column = document.getElementById("bottom-column");

    // Create container for product rows
    let productContainer = document.createElement("div");
    productContainer.id = "product-container";
    column.appendChild(productContainer);

    // Create wrapper for Add Product button
    let buttonWrapper = document.createElement("div");
    buttonWrapper.classList.add("text-center", "my-4");
    column.appendChild(buttonWrapper);

    // Create Add Product button
    if(saved){
        for(let i = 0; i < update.products.length; i++){
            restoreProductRow(update.products[i].name, update.products[i].description, update.products[i].price);
        }
    }
    let submit = document.createElement("button");
    submit.classList.add("delete-add-button");
//    submit.setAttribute("style", "margin-right: 200;");

    let addButtonImage = createObject("img", 'deleteButtonImage', body, ["rounded-circle"]);
    addButtonImage.setAttribute("src", "https://cdn-icons-png.flaticon.com/512/668/668115.png");
    addButtonImage.setAttribute("height", "50");
    addButtonImage.setAttribute("width", "50");
    addButtonImage.setAttribute("style", "margin-top: 22px;")
    submit.appendChild(addButtonImage);
     
    buttonWrapper.appendChild(submit);
    submit.addEventListener('click', () => {
        addProductRow()
    });
}

async function saveStand() {
    let nameConflict = await crud.nameExists(document.getElementById("name_input").value);
    let stand = new Stand("")
    if (nameConflict) {
        alert("Farm name already exists. Please choose a different name.");
    }
    else {
        stand.name = document.getElementById("name_input").value;
        stand.tagline = document.getElementById("tag_input").value;
        stand.image_url = document.getElementById("upload-Image").value;
        stand.about = document.getElementById("about_input").value;
        stand.address = farmAddress;
        try{
            stand.farmId = await generateID();
            if (saved) {
                await crud.updateStand(saved.value, stand)
            } else {
                await crud.addStand(stand);
            }
            window.location.href = "listings.html";
        }
        catch (error){
            alert("Internal server error");
        }
    }
}


async function createSaveButton() {
    let column = document.getElementById("save-column");
    let saveButton = createObject("button", 'save-stand', column, ["btn", "btn-primary", "mx-4"]);
    saveButton.innerHTML = "Save";
    saveButton.addEventListener("click", async (event) => {
        let nameConflict = await crud.nameExists(document.getElementById("name_input").value);
        if (nameConflict && !saved) {
    
            alert("Farm name already exists. Please choose a different name.");
        }
        else {
            stand.name = document.getElementById("name_input").value;
            stand.tagline = document.getElementById("tag_input").value;
            stand.image_url = document.getElementById("upload-Image").value;
            stand.about = document.getElementById("about_input").value;
            stand.address = geocoder._inputEl.value;
            let products = [];
            for (let i = 0; i < productRows.length; i++) {
                let row = productRows[i];
                console.log(row)
                let productNameInput = row.querySelector('.product-name-input');
                let productNameValue = productNameInput.value;
                let productPriceInput = row.querySelector('.product-price-input');
                let productPriceValue = parseFloat(productPriceInput.value);
                let productAboutInput = row.querySelector('.product-about-input');
                let productAboutValue = productAboutInput.value;            
    
                let product = {
                    name: productNameValue,
                    description: productAboutValue,
                    price: productPriceValue
                };
                products.push(product);
            }
            
            stand.products = products;
    
            try{
                if (saved) {
                    stand.farmId = update.farmId;
                    await crud.updateStand(stand);
                } else {
                    stand.farmId = await generateID();
                    await crud.addStand(stand);
                }
                window.location.href = "homepage.html";
            }
            catch (error){
                alert("Internal server error");
            }
        }
    
    });
}

/**
 * This function creates the delete button at the bottom of the page, as well as a pop up that asks for confirmation before deleting the stand
 * @returns early if the stand to be deleted does not exist
 */
function createDeleteButton() {
    let column = document.getElementById("save-column");
    if(!saved){
        return;
    }
    let deleteButton = createObject("button", 'delete-stand', column, ["btn", "btn-danger", "mx-4"]);
    deleteButton.innerHTML = "Delete Stand";
    deleteButton.setAttribute("type", "button");
    deleteButton.setAttribute("data-bs-toggle", "modal");
    deleteButton.setAttribute("data-bs-target", "#deleteModal");

    let modal = createObject("div", 'deleteModal', body, ["modal", "fade"])
    modal.setAttribute("aria-labelledby","deleteModal")
    modal.setAttribute("aria-hidden", "true")
    modal.setAttribute("tabindex", "-1")

    let dialogue = createObject("div", '', modal, ["modal-dialog"])

    let content = createObject("div", '' , dialogue, ["modal-content"])

    let header = createObject("div", '', content, ["modal-header"])
    let title = createObject("h5", '', header, ["modal-title"])
    title.innerHTML = "Are you sure you want to delete this stand?"
    let xButton = createObject("button", '', header, ["btn-close"])
    xButton.setAttribute("data-bs-dismiss", "modal")
    xButton.setAttribute("aria-label", "close")

    let footer = createObject("div", '', content, ["modal-footer"])
    let closeButton = createObject("button", '', footer, ["btn"])
    closeButton.innerHTML = "Close"
    closeButton.setAttribute("data-bs-dismiss", "modal")
    let deleteForReal = createObject("button", '', footer, ["btn", "btn-danger"])
    deleteForReal.innerHTML = "Confirm Delete"
    deleteForReal.addEventListener("click", deleteStand)
}

/**
 * This is the handler funciton that is passed into the event listener for the delete stand button. This function first checks if this stand
 * exists, and if so, deletes it. If the stand does not exists, it displays an alert and does nothing
 */
async function deleteStand() {
    let standName = update.name;
    let nameConflict = await crud.nameExists(standName);
    if (!nameConflict) {
        alert(standName + " does not exist. Click 'New Stand!' to create a new stand.");
    }
    else {
        let success = await crud.removeStand(standName);
        if (success){
            window.location.href = 'homepage.html';
        }
        else{
            alert("Error: Could not remove stand");
        }
    }
}

/**
 * This function calls all of the functions that creates the individual parts for the stand editing page
 */
function createPage() {
    createGrid();
    createFarmPicture();
    createInfoCard();
    createAddProductCard();
    if(!saved){
        addProductRow();
    }
    createSaveButton();
    if(saved){
        createDeleteButton();
    }

}

/**
 * This funciton generates a random id for a farm whenever a new stand is created
 * @returns id 
 */
async function generateID() {
    let id = "";
    while (true){
        id = "";
        let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 12; i++) {
            id += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        try {
            let idConflict = await crud.idExists(id);
            if (!idConflict){
                return id;
            }
        }catch (error){
            console.error(error);
        }
    }
}

let productRows = [];

// Called if we are updating an existing stand
function restoreProductRow(name, description, price) {
    let newRow = document.createElement("div");
    newRow.classList.add("row", "my-2");

    let nameCol = document.createElement("div");
    nameCol.classList.add("col-md-4", "form-group");
    let priceCol = document.createElement("div");
    priceCol.classList.add("col-md-1", "form-group");
    let aboutCol = document.createElement("div");
    aboutCol.classList.add("col-md-4", "form-group");

    let productNameLabel = document.createElement("label");
    productNameLabel.innerHTML = "Product Name:";
    let productName = document.createElement("input");
    productName.classList.add("form-control", "product-name-input");
    productName.type = "text";
    
    let productPriceLabel = document.createElement("label");
    productPriceLabel.innerHTML = "Price:";
    let productPrice = document.createElement("input");
    productPrice.classList.add("form-control", "product-price-input");
    productPrice.type = "text";


    let productAboutLabel = document.createElement("label");
    productAboutLabel.innerHTML = "About this product:";
    let productAboutInput = document.createElement("input");
    productAboutInput.classList.add("form-control", "product-about-input");
    productAboutInput.type = "text";
    
     nameCol.appendChild(productNameLabel);
     nameCol.appendChild(productName);
     priceCol.appendChild(productPriceLabel);
     priceCol.appendChild(productPrice);
     aboutCol.appendChild(productAboutLabel);
     aboutCol.appendChild(productAboutInput);

     newRow.appendChild(nameCol);
     newRow.appendChild(priceCol);
     newRow.appendChild(aboutCol);

     let deleteButton = document.createElement("button");
     deleteButton.innerHTML = "-";
     deleteButton.classList.add("btn", "btn-danger", "my-2");
     deleteButton.style.width = "50px";
     deleteButton.style.height = "50px";
     deleteButton.style.borderRadius = "50%";
     deleteButton.style.padding = "0";
     deleteButton.style.fontSize = "30px";
     deleteButton.style.lineHeight = "1";
     deleteButton.addEventListener("click", () => {
         newRow.remove();
         let index = productRows.indexOf(newRow);
         if (index > -1) {
             productRows.splice(index, 1);
         }
     });

     let deleteCol = document.createElement("div");
     deleteCol.classList.add("col-md-1", "form-group");
     deleteCol.style.display = "flex";
     deleteCol.style.alignItems = "center";
     deleteCol.appendChild(deleteButton);

      newRow.appendChild(deleteCol);

      let container = document.getElementById("product-container");
      container.appendChild(newRow);

      // Add new row element to array
      productRows.push(newRow);
      productName.value = name;
      productAboutInput.value = description;
      productPrice.value = price;
}


// Called if we are creating a new stand
function addProductRow() {
    let newRow = document.createElement("div");
    newRow.classList.add("row", "my-2");

    let nameCol = document.createElement("div");
    nameCol.classList.add("col-md-4", "form-group");
    let priceCol = document.createElement("div");
    priceCol.classList.add("col-md-1", "form-group");
    let aboutCol = document.createElement("div");
    aboutCol.classList.add("col-md-4", "form-group");

    let productNameLabel = document.createElement("label");
    productNameLabel.innerHTML = "Product Name:";
    let productName = document.createElement("input");
    productName.classList.add("form-control", "product-name-input");
    productName.type = "text";
    
    let productPriceLabel = document.createElement("label");
    productPriceLabel.innerHTML = "Price:";
    let productPrice = document.createElement("input");
    productPrice.classList.add("form-control", "product-price-input");
    productPrice.type = "text";


    let productAboutLabel = document.createElement("label");
    productAboutLabel.innerHTML = "About this product:";
    let productAboutInput = document.createElement("input");
    productAboutInput.classList.add("form-control", "product-about-input");
    productAboutInput.type = "text";
    
     nameCol.appendChild(productNameLabel);
     nameCol.appendChild(productName);
     priceCol.appendChild(productPriceLabel);
     priceCol.appendChild(productPrice);
     aboutCol.appendChild(productAboutLabel);
     aboutCol.appendChild(productAboutInput);

     newRow.appendChild(nameCol);
     newRow.appendChild(priceCol);
     newRow.appendChild(aboutCol);

    let deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-add-button");
    let deleteButtonImage = createObject("img", 'deleteButtonImage', body, ["rounded-circle"]);
    deleteButtonImage.setAttribute("src", "https://cdn-icons-png.flaticon.com/512/5974/5974627.png");
    deleteButtonImage.setAttribute("height", "30");
    deleteButtonImage.setAttribute("width", "30");
    deleteButtonImage.setAttribute("style", "margin-top: 22px; margin-right: 10px;")

     
    //https://cdn-icons-png.flaticon.com/512/5244/5244842.png
    
    
    //  deleteButton.innerHTML = "-";
    //  deleteButton.classList.add("btn", "btn-danger", "my-2");
    //  deleteButton.style.width = "50px";
    //  deleteButton.style.height = "50px";
    //  deleteButton.style.borderRadius = "50%";
    //  deleteButton.style.padding = "0";
    //  deleteButton.style.fontSize = "30px";
    //  deleteButton.style.lineHeight = "1";
    deleteButton.appendChild(deleteButtonImage);
     deleteButton.addEventListener("click", () => {
         newRow.remove();
         let index = productRows.indexOf(newRow);
         if (index > -1) {
             productRows.splice(index, 1);
         }
     });

     let deleteCol = document.createElement("div");
     deleteCol.classList.add("col-md-1", "form-group");
     deleteCol.style.display = "flex";
     deleteCol.style.alignItems = "center";
     deleteCol.appendChild(deleteButton);

      newRow.appendChild(deleteCol);

      let container = document.getElementById("product-container");
      container.appendChild(newRow);

      // Add new row element to array
      productRows.push(newRow);
}







