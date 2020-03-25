import datetime
# import yelpRequests as yelp
from djangoTravelPlanner.Backend import yelpRequests as yelp

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
        #print(business["name"] + ": ")
        #print(business["hours"])

    # Call helper to perform algorithm X times and take best result


# Semi-random Greedy algorithm
# At a given time X, choose an activity Y randomly where the chance to select Y 
# is proportional to its value or 0 if it cannot be done at that time + travel time 
# from the last event. Once Y is scheduled, repeat starting at Y’s end time.
# Do this until no activity can be scheduled or the end of the schedule is reached. 
# If the end of the schedule is not reached, check each time until some activity can 
# be scheduled, and repeat from the top.


x = datetime.datetime(2020, 3, 22)
y = datetime.datetime.now()
bus = [{'name': 'The Jolly Scholar', 'timeToSpend': 1, 'address': 'Thwing Ctr 11111 Euclid Ave Cleveland, OH 44106', 'rating': 4.0, 'id': 'wzj2cMpiDJW0HB3iCvCOYA', 'price': '$', 'url': 'https://www.yelp.com/biz/the-jolly-scholar-cleveland?adjust_creative=dQvSn56-m0sDVZemOiNI2w&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=dQvSn56-m0sDVZemOiNI2w', 'value': 4.0}, {'name': 'ABC the Tavern', 'timeToSpend': 1, 'address': '11434 Uptown Ave Cleveland, OH 44106', 'rating': 3.5, 'id': 'uYl_QBtb7bXhu9sgb4kCrg', 'price': '$', 'url': 'https://www.yelp.com/biz/abc-the-tavern-cleveland-4?adjust_creative=dQvSn56-m0sDVZemOiNI2w&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=dQvSn56-m0sDVZemOiNI2w', 'value': 3.5}, {'name': 'The Fairmount', 'timeToSpend': 1, 'address': '2448 Fairmount Blvd Cleveland Heights, OH 44106', 'rating': 4.0, 'id': 'g5zVkPRW2umfpCuDkan7tQ', 'price': '$$', 'url': 'https://www.yelp.com/biz/the-fairmount-cleveland-heights?adjust_creative=dQvSn56-m0sDVZemOiNI2w&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=dQvSn56-m0sDVZemOiNI2w', 'value': 2.0}, {'name': 'Townhall', 'timeToSpend': 1, 'address': '1909 W 25th St Cleveland, OH 44113', 'rating': 4.0, 'id': 'LNsZJP6jZ11e0tDljOLPiQ', 'price': '$$', 'url': 'https://www.yelp.com/biz/townhall-cleveland-2?adjust_creative=dQvSn56-m0sDVZemOiNI2w&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=dQvSn56-m0sDVZemOiNI2w', 'value': 2.0}, {'name': 'Punch Bowl Social Cleveland', 'timeToSpend': 1, 'address': '1086 W 11th St Cleveland, OH 44113', 'rating': 3.5, 'id': '9SrZRDl7-ZfuENCo0DjfsQ', 'price': '$$', 'url': 'https://www.yelp.com/biz/punch-bowl-social-cleveland-cleveland?adjust_creative=dQvSn56-m0sDVZemOiNI2w&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=dQvSn56-m0sDVZemOiNI2w', 'value': 1.75}]
distances = [[0, 219, 228, 528, 1042, 961], [292, 0, 209, 356, 963, 973], [231, 127, 0, 408, 1090, 1047], [596, 521, 493, 0, 1281, 1237], [969, 1093, 1090, 1194, 0, 402], [1033, 1156, 1154, 1272, 423, 0]]
createSchedule(bus, distances, x, y, 6, 1)


# REMOVE THE FOLLOWING CODE WHEN NO LONGER USEFUL FOR OBSERVATION
#
# from pulp import *
#
# def createSchedule(businesses, travelTimes, startDate, endDate):
#     problem = LpProblem("Schedule Activities", LpMaximize)
#     globalStartTime = 0.0
#     globalStartDay = startDate # TODO: capture day of week from start date
#     globalEndTime = endDate # convert to number of seconds since start time
#     globalEndDay = endDate # TODO: capture day of week from end date
#
#     # create enough variables for start and end time of each activity
#     activityStartEnd = LpVariable.dicts("activityStartEnd", list(range(2*len(businesses))))
#
#     activities = []
#     for i in range(len(businesses)):
#         # variable for each activity to say if it is scheduled or not
#         activities.append(LpVariable("activity " + str(i), cat="Binary"))
#
#     goal = sum([businesses[i]["value"] * activities[i] for i in range(len(businesses))])
#     problem += goal
#
#     for i in range(len(businesses)):
#         # activities must be scheduled later than global start + travel time and scheduled earlier than global end
#         c1 = activityStartEnd[2*i] * activities[i] >= (globalStartTime + travelTimes[0][i+1]) * activities[i]
#         c2 = activityStartEnd[2*i + 1] * activities[i] >= (globalStartTime + travelTimes[0][i+1]) * activities[i]
#         problem += c1
#         problem += c2
#         c3 = activityStartEnd[2*i] * activities[i] <= globalEndTime * activities[i]
#         c4 = activityStartEnd[2*i + 1] * activities[i] <= globalEndTime * activities[i]
#         problem += c3
#         problem += c4
#         # must spend required amount of time at activity (or 0 if not scheduled)
#         c5 = activityStartEnd[2*i + 1] - activityStartEnd[2*i] == businesses[i]["timeToSpend"] * activities[i]
#         problem += c5
#
#         # constraints based on open/close times
#
#         # constraints based on travel times and non-overlapping
#         '''
#         for j in range(businesses):
#             if j != i:
#                 # x start must be after y end + travel time from y to x
#                 activityStartEnd[2*i] * (activities[i] + activities[j] - 1) >= (activityStartEnd[2*j + 1] + travelTimes[j+1][i+1]) * (activities[i] + activities[j] - 1)
#                 # OR y start must be after x end + travel time from x to y
#                 activityStartEnd[2*j] * (activities[i] + activities[j] - 1) >= (activityStartEnd[2*i + 1] + travelTimes[i+1][j+1]) * (activities[i] + activities[j] - 1)
#                 # OR one of them must be not scheduled -- included in above expressions
#         '''
#
#     print(problem)
#     problem.solve()
#     print(LpStatus[problem.status])
#
# #bus = [{'name': 'The Jolly Scholar', 'timeToSpend': 1, 'address': 'Thwing Ctr 11111 Euclid Ave Cleveland, OH 44106', 'rating': 4.0, 'id': 'wzj2cMpiDJW0HB3iCvCOYA', 'price': '$', 'url': 'https://www.yelp.com/biz/the-jolly-scholar-cleveland?adjust_creative=dQvSn56-m0sDVZemOiNI2w&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=dQvSn56-m0sDVZemOiNI2w', 'value': 4.0}, {'name': 'ABC the Tavern', 'timeToSpend': 1, 'address': '11434 Uptown Ave Cleveland, OH 44106', 'rating': 3.5, 'id': 'uYl_QBtb7bXhu9sgb4kCrg', 'price': '$', 'url': 'https://www.yelp.com/biz/abc-the-tavern-cleveland-4?adjust_creative=dQvSn56-m0sDVZemOiNI2w&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=dQvSn56-m0sDVZemOiNI2w', 'value': 3.5}, {'name': 'The Fairmount', 'timeToSpend': 1, 'address': '2448 Fairmount Blvd Cleveland Heights, OH 44106', 'rating': 4.0, 'id': 'g5zVkPRW2umfpCuDkan7tQ', 'price': '$$', 'url': 'https://www.yelp.com/biz/the-fairmount-cleveland-heights?adjust_creative=dQvSn56-m0sDVZemOiNI2w&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=dQvSn56-m0sDVZemOiNI2w', 'value': 2.0}, {'name': 'Townhall', 'timeToSpend': 1, 'address': '1909 W 25th St Cleveland, OH 44113', 'rating': 4.0, 'id': 'LNsZJP6jZ11e0tDljOLPiQ', 'price': '$$', 'url': 'https://www.yelp.com/biz/townhall-cleveland-2?adjust_creative=dQvSn56-m0sDVZemOiNI2w&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=dQvSn56-m0sDVZemOiNI2w', 'value': 2.0}, {'name': 'Punch Bowl Social Cleveland', 'timeToSpend': 1, 'address': '1086 W 11th St Cleveland, OH 44113', 'rating': 3.5, 'id': '9SrZRDl7-ZfuENCo0DjfsQ', 'price': '$$', 'url': 'https://www.yelp.com/biz/punch-bowl-social-cleveland-cleveland?adjust_creative=dQvSn56-m0sDVZemOiNI2w&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=dQvSn56-m0sDVZemOiNI2w', 'value': 1.75}]
# #distances = [[0, 219, 228, 528, 1042, 961], [292, 0, 209, 356, 963, 973], [231, 127, 0, 408, 1090, 1047], [596, 521, 493, 0, 1281, 1237], [969, 1093, 1090, 1194, 0, 402], [1033, 1156, 1154, 1272, 423, 0]]
# #createSchedule(bus, distances, 0.0, 172800.0)