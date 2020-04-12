import datetime
import djangoTravelPlanner.Backend.yelpRequests as yelp
#import yelpRequests as yelp
from numpy.random import choice


# makes business["hours"] into a copy of the schedule where each 
# time increment is True if the business is open, and false if not
def formatOpenCloseSchedule(business, hours, yelpStartTime, startDay):
    currDay = startDay
    currTime = yelpStartTime
    # for all time increments in the schedule
    for i in range(len(business["hours"])):
        for timePair in hours[currDay]:
            t1 = timePair[0]
            t2 = timePair[1]
            if t2 == 0:
                t2 = 2359
            if currTime >= t1 and currTime <= t2:
                business["hours"][i] = True

        # end loop work to increment current time and day
        currTime += 5
        if currTime % 100 > 60: # minutes more than 60 means hour shifts up
            currTime += 40
            if currTime / 100.0 >= 24: # time is past the 24 hours in a day
                currTime = currTime % 100
                currDay += 1
                if currDay > 6:
                    currDay = 0


def createSchedule(businesses, travelTimes, startDate, endDate, startDay, endDay):
    # assumes startDate and endDate are datetime objects
    # assumes startDay and endDay are integers representing day of the week 0-6 Monday to Sunday, matching Yelp's API
    startTime = datetime.datetime.timestamp(startDate) / 60 # timestamp gives seconds, this converts to minutes
    endTime = datetime.datetime.timestamp(endDate) / 60 # timestamp gives seconds, this converts to minutes
    minutesPerIncrement = 5
    numIncrements = int((endTime - startTime) / minutesPerIncrement)
    schedule = [-1] * numIncrements # creates an array with a -1 for every 5 minutes from the start time to the end time

    # creates a start time int in the HHMM format that yelp uses for open/close hours
    startTime_YelpFormatted = startDate.hour * 100 + startDate.minute
    # adds open/close schedule to each business
    for business in businesses:
        openCloseSchedule = [False] * numIncrements
        business.update({"hours": openCloseSchedule})
        if "id" in business.keys(): # does not need to do for starting location
            hours = yelp.getYelpHoursForBusiness(business["id"])
            formatOpenCloseSchedule(business, hours, startTime_YelpFormatted, startDay)
        # print(business["name"] + ": ")
        # print(business["hours"])

    numRunTimes = 20
    
    # Call helper to perform algorithm X times and take best result
    bestSchedule = multiScheduler(businesses, travelTimes, schedule, numRunTimes, minutesPerIncrement)
    
    return bestSchedule


def multiScheduler(businesses, travelTimes, schedule, numRunTimes, minutesPerIncrement):
    schedules = [None]*numRunTimes
    
    for i in range(numRunTimes):
        s = scheduleHelper(businesses, travelTimes, schedule.copy(), minutesPerIncrement)
        schedules[i] = s
    
    maxVal = 0.0
    maxValSchedule = None
    for s in schedules:
        s_val = 0.0
        businessesAdded = []
        
        for increment in s:
            
            if increment != -1 and increment not in businessesAdded:

                val = businesses[increment]['value']
                # print('Val: ')
                # print(val)
                s_val += val
                businessesAdded.append(increment)
        
        if s_val >= maxVal:
            maxVal = s_val
            maxValSchedule = s
            
        # print(s_val)
        # print()
        # print(s)

    return maxValSchedule


# Semi-random Greedy algorithm
# At a given time X, choose an activity Y randomly where the chance to select Y 
# is proportional to its value or 0 if it cannot be done at that time + travel time 
# from the last event. Once Y is scheduled, repeat starting at Y’s end time.
# Do this until no activity can be scheduled or the end of the schedule is reached. 
# If the end of the schedule is not reached, check each time until some activity can 
# be scheduled, and repeat from the top.
def scheduleHelper(businesses, travelTimes, schedule, minutesPerIncrement):
    usedBusinesses = [0]

    numIncrements = len(schedule)
    
    prevBusinessIndex = 0
    incrementCounter = 0
    while (incrementCounter < numIncrements):
        # randomly choose a business
        businessIndex, travelTime, timeSpent = randomBusiness(businesses, usedBusinesses, prevBusinessIndex, travelTimes, incrementCounter, minutesPerIncrement)
        
        if businessIndex != -1:
            prevBusinessIndex = businessIndex
            usedBusinesses.append(businessIndex)
            
            startIncrement = int(incrementCounter + travelTime)
            endIncrement = int(startIncrement + timeSpent)
            
            for i in range(startIncrement, endIncrement):
                schedule[i] = businessIndex
            
            incrementCounter = endIncrement
            
        else:
            incrementCounter += 1
    
    return schedule


# Given a list of business dictionaries, randomly choose a business
# where the chance to pick a business is 0 if it cannot be done at the currentTime
# and is proportional to its value if available
def randomBusiness(businesses, usedBusinesses, prevBusinessIndex, travelTimes, currentTime, minutesPerIncrement):
    businessWeights = [0]*len(businesses)

    # loop through business and check for
    # true at this time + travel time AND true until time + travel time + timeToSpend
    for index, business in enumerate(businesses):
        if index not in usedBusinesses:
        
            businessHours = business['hours']
            timeToSpend = int(int(business['timeToSpend']) / minutesPerIncrement)
            businessTravelTime = int(travelTimes[prevBusinessIndex][index] / minutesPerIncrement)
            
            checkTime = (currentTime + businessTravelTime)
            if checkTime < len(businessHours) and businessHours[checkTime]:

                tempTime = currentTime + businessTravelTime
                while tempTime <= currentTime + businessTravelTime + timeToSpend and tempTime < len(businessHours):

                    if not businessHours[tempTime]:
                        break
                    else:
                        if tempTime == currentTime + businessTravelTime + timeToSpend:
                            businessWeights[index] = business['value']        
                        
                        tempTime += 1

    sumWeights = sum(businessWeights)
    if sumWeights == 0:
        return -1, -1, -1
    
    normalizedBusinessWeights = []
    for weight in businessWeights:
        normalizedBusinessWeights.append(weight / sumWeights)
    
    # randomly choose
    businessIndex = choice(range(len(businesses)), 1, p=normalizedBusinessWeights)[0]
    travelTime = travelTimes[prevBusinessIndex][businessIndex] / minutesPerIncrement
    timeSpent = int(businesses[businessIndex]['timeToSpend']) / minutesPerIncrement

    return businessIndex, travelTime, timeSpent


#x = datetime.datetime(2020, 3, 22)
#y = datetime.datetime(2020, 3, 24)
#bus = [{'name': 'Start', 'address':'1611 E 115th St Cleveland, OH 44106'},
#       {'name': 'The Jolly Scholar', 'timeToSpend': 60, 'address': 'Thwing Ctr 11111 Euclid Ave Cleveland, OH 44106', 'rating': 4.0, 'id': 'wzj2cMpiDJW0HB3iCvCOYA', 'price': '$', 'url': 'https://www.yelp.com/biz/the-jolly-scholar-cleveland?adjust_creative=dQvSn56-m0sDVZemOiNI2w&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=dQvSn56-m0sDVZemOiNI2w', 'value': 4.0}, 
#       {'name': 'ABC the Tavern', 'timeToSpend': 60, 'address': '11434 Uptown Ave Cleveland, OH 44106', 'rating': 3.5, 'id': 'uYl_QBtb7bXhu9sgb4kCrg', 'price': '$', 'url': 'https://www.yelp.com/biz/abc-the-tavern-cleveland-4?adjust_creative=dQvSn56-m0sDVZemOiNI2w&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=dQvSn56-m0sDVZemOiNI2w', 'value': 3.5}, 
#       {'name': 'The Fairmount', 'timeToSpend': 60, 'address': '2448 Fairmount Blvd Cleveland Heights, OH 44106', 'rating': 4.0, 'id': 'g5zVkPRW2umfpCuDkan7tQ', 'price': '$$', 'url': 'https://www.yelp.com/biz/the-fairmount-cleveland-heights?adjust_creative=dQvSn56-m0sDVZemOiNI2w&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=dQvSn56-m0sDVZemOiNI2w', 'value': 2.0}, 
#       {'name': 'Townhall', 'timeToSpend': 60, 'address': '1909 W 25th St Cleveland, OH 44113', 'rating': 4.0, 'id': 'LNsZJP6jZ11e0tDljOLPiQ', 'price': '$$', 'url': 'https://www.yelp.com/biz/townhall-cleveland-2?adjust_creative=dQvSn56-m0sDVZemOiNI2w&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=dQvSn56-m0sDVZemOiNI2w', 'value': 2.0}, 
#       {'name': 'Punch Bowl Social Cleveland', 'timeToSpend': 60, 'address': '1086 W 11th St Cleveland, OH 44113', 'rating': 3.5, 'id': '9SrZRDl7-ZfuENCo0DjfsQ', 'price': '$$', 'url': 'https://www.yelp.com/biz/punch-bowl-social-cleveland-cleveland?adjust_creative=dQvSn56-m0sDVZemOiNI2w&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=dQvSn56-m0sDVZemOiNI2w', 'value': 1.75}]
#distances = [[0, 219, 228, 528, 1042, 961], [292, 0, 209, 356, 963, 973], [231, 127, 0, 408, 1090, 1047], [596, 521, 493, 0, 1281, 1237], [969, 1093, 1090, 1194, 0, 402], [1033, 1156, 1154, 1272, 423, 0]]
#sched = createSchedule(bus, distances, x, y, 6, 1)

#print('Chosen Schedule:')
#print(sched)
