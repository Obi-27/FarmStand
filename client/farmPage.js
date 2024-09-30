import { Stand, Listing } from './stand.js';
import { Product, ListingProduct } from './product.js';
import * as crud from './crud.js';

const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))

//the table to add products to
const productTable = document.getElementById("product-table-body");
const body = document.body;
const urlParams = new URLSearchParams(window.location.search);

//this function creates an HTML element "tag" with a string id and array of class names, and appends it to the "parent" element
function createObject(tag, id, parent, class_names) {
    let obj = document.createElement(tag);
    class_names.forEach(class_name => obj.classList.add(class_name));
    (id)?obj.setAttribute("id", id):null; 
    parent.appendChild(obj);
    return obj;
}


//this function takes an array of strings of information about an ites, and creates a product with the information
function create_Product(info_array) {
    let product = new Product(info_array[0],info_array[1],info_array[2])
    return product
}

//this function takes an item of class product and adds a row to the product table
function add_To_Product_List(item) {   
    //create a new table row
    let table_row = createObject("tr", '', document.getElementById("product-table-body"), []);
    //each "td" element is a column of the product table

    let product_name = createObject("td",'',table_row,[]);

    let product_price = createObject("td",'',table_row,[]);
    let product_description = createObject("td",'',table_row,[]);

    
    product_name.innerHTML = item.name;
    product_price.innerHTML = '$' + item.price;
    product_description.innerHTML = item.description;
}

//creates Navbar at top of page
function createNavBar() {
    let page = document.getElementById("page-content");
    let navbar = createObject("nav", '', page, ["navbar", "navbar-expand-xxl", "bg-dark"]);
    let container = createObject("div", '', navbar, ["container-fluid"])
    //set navbar logo
    let logo = createObject("a", '', container, ["navbar-brand"])
    let image = createObject("img", '', logo, ["align-text-center"])
    image.setAttribute("src", "docs/ui-design/farmIcon.png")
    image.setAttribute("height", "50")
    image.setAttribute("width", "50")
    image.setAttribute("alt", "Farmstead Logo")

    //set navbar links
    
}

//creates the websites header
function createHeader(name, tagline) {
    let page = document.getElementById("page-content");
    let header = createObject("header", '', page, ["py-5", "border-bottom"]);
    let textArea = createObject("div", '', header, ["container-fluid", "text-center"]);
    let farmName = createObject("h1", '', textArea, []);
    farmName.textContent = name;
    let aboutFarm = createObject("p", '', textArea, []);
    aboutFarm.textContent = tagline
}



//create the grid that will contain all of the page content
function createGrid() {
    let page = document.getElementById("page-content");
    let container = createObject("div", '', page, ["container-fluid", "py-2"])
    let row = createObject("div",'main-row', container, ["row"]);
    createObject("div", 'column-1', row, ["col-lg-8"]);
    createObject("div", 'column-2', row, ["col-lg-4"]);
}

// create the product table
function createProductTable() {
    let productTableCard = createObject("div",'', document.getElementById("column-1"), ["card", "mb-4"]);
    let cardHeader = createObject("div", '', productTableCard, ["card-header"]);
    cardHeader.textContent = "Product List";
    let cardBody = createObject("div", '', productTableCard, ["card-body"]);
    let table = createObject("table", '', cardBody, ["table", "my-2"]);
    let table_title = createObject("thead", '', table, []);
    let table_body = createObject("tbody", 'product-table-body', table, []);
    let table_row = createObject("tr",'',table_title,[]);
    let productTitle = createObject("th",'',table_row,[]);
    productTitle.textContent = "Item";
    let priceTitle = createObject("th",'',table_row,[]);
    priceTitle.textContent = "Price";
    let descriptionTitle = createObject("th",'',table_row,[]);
    descriptionTitle.textContent = "Description";
}

//creates the searchBar card
function createFarmImage(url) {
    let imageBody = createObject("div", '', document.getElementById("column-2"), []);
    imageBody.innerHTML = `<img src="${url}" alt="Farm Image" width="470vw"></img>`;
}

//creates the farm Information card
function createFarmInfo(contact, address){
    let farmcCard = createObject("div", '', document.getElementById("column-2"), ["card", "mb-4"])
    let cardHeader = createObject("div", '', farmcCard, ["card-header"]);
    cardHeader.textContent = "Farm Information"
    let cardBody = createObject("div", '', farmcCard, ["card-body"]);
    contact = contact.replace("\n", "<br />");
    console.log(contact);
    let info = `${contact} <br /> ${address}`;
    cardBody.innerHTML = info;
}

//this function takes all of the information from the stand and calls the functions to create the farm page
function createPage(stand) {
    body.append(createObject("div",'page-content',body,["container-fluid"]));
    // createNavBar();
    createHeader(stand.name, stand.tagline);
    createGrid();
    createProductTable();
    createFarmImage(stand.image_url);
    createFarmInfo(stand.about, stand.address);
    let productList = stand.products;
    Object.keys(productList).forEach((item) => add_To_Product_List(productList[item]));
    document.title = "Farmstand - " + stand.name;
}

window.addEventListener("load", async(event) => {
    console.log("About to load window!")
    loadFarm();
})


// let farm = {"name": "Windy Ridge Farm", "products": [{"name": "Rockfish", "description": "the lean flesh of any of various valuable market fish caught among rocks", "price": 6.92}, {"name": "Apricots", "description": "Asian tree having clusters of usually white blossoms and edible fruit resembling the peach", "price": 9.43}, {"name": "Watermelon", "description": "an African melon", "price": 9.21}], "tagline": "Savor the flavor of Rockfish, Apricots, and Watermelon from Windy Ridge Farm", "about": "Windy Ridge Farm Contact:\n Phone: 931-979-1220\n Email: windyridgefarm@umass.edu", "address": "591 Memorial Dr, Chicopee MA 1020", "image_url": "https://media.istockphoto.com/id/1240794556/vector/green-tractor-stencil-vector-illustration.jpg?s=612x612&w=0&k=20&c=rAM1UmTyE8kEdOEHCkhIKdZdmzCjo_ygKE7wC5toOns=", "farmId": "tlkWVaUuEBcV"};
// console.log("About to load window!")

async function loadFarm(){

    console.log("Window loading...");

    const id = urlParams.get('id');
    const name = await crud.getNameFromId(id);

    try {
        let farm = await crud.read(name);
        console.log("Farm: " + farm)
        createPage(farm)
    } catch (error) {
        console.error(error);
    }
}
//loadFarm();