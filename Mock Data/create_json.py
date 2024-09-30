import random
from nltk.corpus import wordnet as wn
import json
import string

def getListItems(file_name):
    contents = ""
    with open("Mock Data/" + file_name, 'r') as f:
        contents = f.read()
    # Split the contents into a list of strings
    lines = contents.splitlines()
    return lines

def getDescription(name):
    synsets = wn.synsets(name, pos=wn.NOUN)
    
    # Choose the first synset and get its definition
    if synsets:
        definition = synsets[0].definition()
        return definition
    
    #No definition of this food
    return "A staple of our farm - you're sure to enjoy!"


#We have switched to using about for both the tagline and description
# def getTagline(products, farm_name):
#     templates = [
#     "Fresh {product1}, {product2}, and {product3} from {farm_name}",
#     "Discover the taste of {product1}, {product2}, and {product3} at {farm_name}",
#     "Get your fill of {product1}, {product2}, and {product3} at {farm_name}",
#     "Savor the flavor of {product1}, {product2}, and {product3} from {farm_name}",
#     "Experience the goodness of {product1}, {product2}, and {product3} at {farm_name}"
#     ]

#     tagline_template = random.choice(templates)

#     # Replace placeholders with actual values
#     tagline = tagline_template.format(product1=products[0], product2=products[1], product3=products[2], farm_name=farm_name)
#     return tagline

def generateFarmDescription(farm_name, products):
    # Generate a random description template
    templates = [
        "{farm_name} offers the freshest {product1}, {product2}, and {product3} around.",
        "At {farm_name}, you'll find the tastiest {product1}, {product2}, and {product3} in town.",
        "If you're looking for {product1}, {product2}, and {product3}, look no further than {farm_name}.",
        "Get your fill of delicious {product1}, {product2}, and {product3} at {farm_name}.",
        "Experience the goodness of {product1}, {product2}, and {product3} at {farm_name}.",
        "Fresh {product1}, {product2}, and {product3} from {farm_name}!",
        "Discover the taste of {product1}, {product2}, and {product3} at {farm_name}!",
        "Get your fill of {product1}, {product2}, and {product3} at {farm_name}!",
        "Savor the flavor of {product1}, {product2}, and {product3} from {farm_name}!",
        "Experience the goodness of {product1}, {product2}, and {product3} at {farm_name}!"
    ]
    
    description_template = random.choice(templates)
    
    # Replace placeholders with actual values
    description = description_template.format(product1=products[0], product2=products[1], product3=products[2], farm_name=farm_name)
    
    return description

import random

#Generate random 12 digit FarmID just like when a new farm is created on the website.
def generateFarmID():
    length = 12
    characters = string.ascii_letters + string.digits
    random_string = ''.join(random.choice(characters) for _ in range(length))
    return random_string

def generateContactInfo(farm_name):
    # Generate a random phone number
    phone = f"{random.randint(100, 999)}-{random.randint(100, 999)}-{random.randint(1000, 9999)}"
    
    # Generate a random email address
    email = f"{farm_name.lower().replace(' ', '')}@umass.edu"

    # Combine all information into a string
    contact_info_str = f"{farm_name} Contact:\n Phone: {phone}\n Email: {email}"
    
    return contact_info_str

def createFarmObject(farm_name, all_foods, address, all_image_addresses):
    farm = {"name": farm_name}
    foods = random.sample(all_foods, 3)
    products = []
    for food_name in foods:
        food = {"name": food_name}
        food["description"] = getDescription(food_name)
        food["price"] = round(random.uniform(0.99, 12.99), 2)
        # food["quantity"] = "lb" #Took out quantity - not helpful
        products.append(food)
    farm["products"] = products
    # farm["tagline"] = getTagline(foods, farm_name) #Tagline has been combined with about
    farm["tagline"] = generateFarmDescription(farm_name, foods)
    farm["about"] = generateContactInfo(farm_name)
    farm["address"] = address
    farm["image_url"] = random.choice(all_image_addresses)
    farm["farmId"] = generateFarmID()
    return farm


def main():
    all_farm_names = getListItems("farm_names.txt")
    all_foods = getListItems("foods.txt")
    all_addresses = getListItems("addresses.txt")
    all_image_addresses = getListItems("image_addresses.txt")
    json_list = []
    for i, farm in enumerate(all_farm_names):
        json_list.append(createFarmObject(farm, all_foods, all_addresses[i], all_image_addresses))

    with open("Mock Data/farms.json", 'w') as f:
        f.write(json.dumps(json_list))
    with open("client/farms.json", 'w') as f:
        f.write(json.dumps(json_list))

main()