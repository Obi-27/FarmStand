import { Product, ListingProduct } from "./product.js";

//Stand is used on the individual stand page
class Stand {
  constructor(stand_name) {
    console.assert(typeof stand_name == "string");
    this.name = stand_name;
    this.tagline = "";
    this.about = "";
    this.contact_info = "";
    this.products = {};
    this.image_url = "";
  }
}

//Listing is used on the listing page for all stands
class Listing {
  constructor(stand) {
    this.name = stand.name;
    this.tagline = stand.tagline;
    this.listing_products = {}
    Object.values(stand.products).forEach(p => this.listing_products[p.name] = new ListingProduct(p));
  }
}

export { Stand, Listing }