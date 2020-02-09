def sortByValue(businesses):
    for business in businesses:
        if "value" not in business.keys():
            business.update({"value": 0})
    
    return sorted(businesses, key=lambda k: k["value"], reverse=True)

def determineValue(businesses):
    for business in businesses:
        priceInt = len(business["price"])
        val = business["rating"] * business["timeToSpend"] / priceInt
        business.update({"value": val})

def getValueAndSort(businesses):
    determineValue(businesses)
    return sortByValue(businesses)

#businesses = [{'name': 'The Jolly Scholar', 'timeToSpend': 1, 'address': 'Thwing Ctr 11111 Euclid Ave Cleveland, OH 44106', 'rating': 4.0, 'id': 'wzj2cMpiDJW0HB3iCvCOYA', 'price': '$', 'url': 'https://www.yelp.com/biz/the-jolly-scholar-cleveland?adjust_creative=dQvSn56-m0sDVZemOiNI2w&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=dQvSn56-m0sDVZemOiNI2w'}, {'name': 'ABC the Tavern', 'timeToSpend': 1, 'address': '11434 Uptown Ave Cleveland, OH 44106', 'rating': 3.5, 'id': 'uYl_QBtb7bXhu9sgb4kCrg', 'price': '$', 'url': 'https://www.yelp.com/biz/abc-the-tavern-cleveland-4?adjust_creative=dQvSn56-m0sDVZemOiNI2w&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=dQvSn56-m0sDVZemOiNI2w'}, {'name': 'The Fairmount', 'timeToSpend': 1, 'address': '2448 Fairmount Blvd Cleveland Heights, OH 44106', 'rating': 4.0, 'id': 'g5zVkPRW2umfpCuDkan7tQ', 'price': '$$', 'url': 'https://www.yelp.com/biz/the-fairmount-cleveland-heights?adjust_creative=dQvSn56-m0sDVZemOiNI2w&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=dQvSn56-m0sDVZemOiNI2w'}, {'name': 'Townhall', 'timeToSpend': 1, 'address': '1909 W 25th St Cleveland, OH 44113', 'rating': 4.0, 'id': 'LNsZJP6jZ11e0tDljOLPiQ', 'price': '$$', 'url': 'https://www.yelp.com/biz/townhall-cleveland-2?adjust_creative=dQvSn56-m0sDVZemOiNI2w&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=dQvSn56-m0sDVZemOiNI2w'}, {'name': 'Punch Bowl Social Cleveland', 'timeToSpend': 1, 'address': '1086 W 11th St Cleveland, OH 44113', 'rating': 3.5, 'id': '9SrZRDl7-ZfuENCo0DjfsQ', 'price': '$$', 'url': 'https://www.yelp.com/biz/punch-bowl-social-cleveland-cleveland?adjust_creative=dQvSn56-m0sDVZemOiNI2w&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=dQvSn56-m0sDVZemOiNI2w'}]
#sortedBus = getValueAndSort(businesses)
#for business in sortedBus:
#    print(business["name"])
#    print(business["value"])