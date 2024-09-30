# # import openai
# # import os

# # # set up OpenAI API credentials
# # os.environ["OPENAI_API_KEY"] = "SECRET"
# # openai.api_key = os.environ["OPENAI_API_KEY"]

# # # generate description using GPT-2
# # def generate_description(farm_name):
# #     prompt = f"Generate a description of {farm_name} based on its name."
# #     response = openai.Completion.create(
# #         engine="text-davinci-002",
# #         prompt=prompt,
# #         max_tokens=1024,
# #         n=1,
# #         stop=None,
# #         temperature=0.7,
# #     )
# #     description = response.choices[0].text.strip()
# #     return description

# # # example usage
# # description = generate_description("Blue Sky Farm")
# # print(description)

# import gpt_2_simple as gpt2

# # download the pre-trained GPT-2 model
# model_name = "124M"
# # gpt2.download_gpt2(model_name=model_name)

# # generate description using GPT-2
# def generate_description(farm_name):
#     prompt = f"Generate a description of {farm_name} based on its name."
#     sess = gpt2.start_tf_sess()
#     gpt2.load_gpt2(sess, model_name=model_name)
#     description = gpt2.generate(sess, prefix=prompt, length=1024, temperature=0.7, return_as_list=True)[0]
#     return description.strip()

# # example usage
# description = generate_description("Blue Sky Farm")
# print(description)

import nltk
from nltk.corpus import wordnet as wn

def food_description(food_item):
    # Get the synsets for the food item
    synsets = wn.synsets(food_item, pos=wn.NOUN)
    
    # Choose the first synset and get its definition
    if synsets:
        definition = synsets[0].definition()
        return f"{food_item} is {definition}."
    else:
        return f"Sorry, I couldn't find a description for {food_item}."

# Example usage
print(food_description("apricots"))