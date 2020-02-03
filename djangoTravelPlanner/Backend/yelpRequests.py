import requests
import json

apiKey = "QKjeccnBl0xBNg_mva_17mpIHR7wIDuhgmkXw7TlArCFfg4-xkvtGIWoGQFcqk9QzgYtxhJgjcuRL3Tr5jhyFeRQM3YEiNlPGzVHTj783QXVftr_bIwG8hb5H_guXnYx"
header = {"Authorization": "Bearer %s" % apiKey}

def searchYelp(searchTermStr, locationStr, maxNumResults = 10):
    url = "https://api.yelp.com/v3/businesses/search"

    parameters = {
        "term": searchTermStr, # this is the seach term
        "location": locationStr,
        "limit": maxNumResults # how many search results are returned for the user to choose from
    }

    response = requests.get(url, params=parameters, headers=header)
    # print(response.status_code)
    jsonObject = json.loads(response.text)
    # print(json.dumps(jsonObject, indent=4)) # print whole json response

    businessResults = []

    # puts all relevant info into a dictionary and appends the dictionary to businessResults
    # does not include open/close hours, must get those from the Business Details endpoint
    for business in jsonObject["businesses"]:
        if business["is_closed"] == False:
            busDict = {
                "name": business["name"],
                "address": " ".join(business["location"]["display_address"]),
                "rating": business["rating"],
                "id": business["id"],
                "price": business["price"],
                "url": business["url"]
            }
            businessResults.append(busDict)

    return businessResults

# for bus in searchYelp("Indian Flame", "Cleveland, OH"):
    # print(bus["name"])