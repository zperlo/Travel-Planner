import requests
import json
#from secrets import yelpKey as apiKey
from djangoTravelPlanner.Backend.secrets import yelpKey as apiKey

#apiKey = secrets.yelpKey
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
                "imgURL": business["image_url"],
                "reviewCount": business["review_count"],
                "rating": business["rating"],
                "id": business["id"],
                # "price": business["price"],
                "url": business["url"]
            }
            cat = business["categories"][0]["title"]
            i = 1
            while i < len(business["categories"]):
                cat = cat + ", " + business["categories"][i]["title"]
                i = i + 1
            busDict.update({"categories": cat})

            if "price" in business.keys():
                busDict.update({"price": business["price"]})
            else:
                busDict.update({"price": "$"})

            addressLine1 = business["location"]["address1"]
            if business["location"]["address2"]:
                addressLine1 += " " + business["location"]["address2"]
            if business["location"]["address3"]:
                addressLine1 += " " + business["location"]["address3"]
            busDict.update({"addressLine1": addressLine1})

            addressLine2 = business["location"]["city"]
            if business["location"]["state"]:
                addressLine2 += ", " + business["location"]["state"]
            if business["location"]["country"]:
                addressLine2 += ", " + business["location"]["country"]
            if business["location"]["zip_code"]:
                addressLine2 += ", " + business["location"]["zip_code"]
            busDict.update({"addressLine2": addressLine2})

            businessResults.append(busDict)

    return businessResults

#for bus in searchYelp("Jolly Scholar", "Cleveland, OH"):
#    print(bus["name"])
#    print(bus["id"])
#    print(bus["categories"])

def getYelpHoursForBusiness(businessId):
    url = "https://api.yelp.com/v3/businesses/"

    response = requests.get(url + businessId, headers=header)
    jsonObject = json.loads(response.text)

    # Day is from 0 to 6, representing day of the week from Monday to Sunday
    # is_overnight means whether the business opens overnight or not. 
        # When this is true, the end time will be lower than the start time.

    # each day has a list of tuples of open and close times
    # since stores can have multiple open/close times in a day, so can these lists
    hours = {
        0: [],
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: []
    }

    #print(jsonObject["name"])
    #print(jsonObject["hours"][0]["open"])
    for dayInJson in jsonObject["hours"][0]["open"]:
        # add any hours past midnight to the next day
        if dayInJson["is_overnight"]:
            currList = hours[dayInJson["day"]]
            currList.append((int(dayInJson["start"]), 0000))
            hours.update({dayInJson["day"]: currList})

            tomorrow = (dayInJson["day"] + 1)
            if tomorrow > 6:
                tomorrow = 0
            tomList = hours[tomorrow]
            tomList.append((0000, int(dayInJson["end"])))
            hours.update({tomorrow: tomList})
        else:
            currList = hours[dayInJson["day"]]
            currList.append((int(dayInJson["start"]), int(dayInJson["end"])))
            hours.update({dayInJson["day"]: currList})
    
    return hours

#print(getYelpHoursForBusiness("wzj2cMpiDJW0HB3iCvCOYA")) # Jolly scholar to test open past midnight