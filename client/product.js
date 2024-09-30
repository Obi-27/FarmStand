//A product contains all the information for one
//product displayed on the individual stand page
class Product {
  constructor(product_name, product_price, product_unit) {
    this.name = product_name;
    this.price = product_price;
    this.product_unit = product_unit;
    this.about = "";
  }
}
  
//A listing product contains less information than
//a full product. This is used on the listing page
//for all items.
class ListingProduct {
  constructor(product) {
    this.name = product.name;
    this.price = product.price;
    this.listing_product_unit = product.product_unit;
  }
}

export { Product, ListingProduct }