from pulp import *

def createSchedule(businesses, travelTimes, startDate, endDate):
    problem = LpProblem("Schedule Activities", LpMaximize)
    globalStartTime = 0.0
    globalStartDay = startDate # TODO: capture day of week from start date
    globalEndTime = endDate # convert to number of seconds since start time
    globalEndDay = endDate # TODO: capture day of week from end date

    # create enough variables for start and end time of each activity
    activityStartEnd = LpVariable.dicts("activityStartEnd", list(range(2*len(businesses))))

    activities = []
    for i in range(len(businesses)):
        # variable for each activity to say if it is scheduled or not
        activities.append(LpVariable("activity " + str(i), cat="Binary"))
    
    goal = sum([businesses[i]["value"] * activities[i] for i in range(len(businesses))])
    problem += goal

    for i in range(len(businesses)):
        # activities must be scheduled later than global start + travel time and scheduled earlier than global end
        c1 = activityStartEnd[2*i] * activities[i] >= (globalStartTime + travelTimes[0][i+1]) * activities[i]
        c2 = activityStartEnd[2*i + 1] * activities[i] >= (globalStartTime + travelTimes[0][i+1]) * activities[i]
        problem += c1
        problem += c2
        c3 = activityStartEnd[2*i] * activities[i] <= globalEndTime * activities[i]
        c4 = activityStartEnd[2*i + 1] * activities[i] <= globalEndTime * activities[i]
        problem += c3
        problem += c4
        # must spend required amount of time at activity (or 0 if not scheduled)
        c5 = activityStartEnd[2*i + 1] - activityStartEnd[2*i] == businesses[i]["timeToSpend"] * activities[i]
        problem += c5

        # constraints based on open/close times

        # constraints based on travel times and non-overlapping
        '''
        for j in range(businesses):
            if j != i:
                # x start must be after y end + travel time from y to x
                activityStartEnd[2*i] * (activities[i] + activities[j] - 1) >= (activityStartEnd[2*j + 1] + travelTimes[j+1][i+1]) * (activities[i] + activities[j] - 1)
                # OR y start must be after x end + travel time from x to y
                activityStartEnd[2*j] * (activities[i] + activities[j] - 1) >= (activityStartEnd[2*i + 1] + travelTimes[i+1][j+1]) * (activities[i] + activities[j] - 1)
                # OR one of them must be not scheduled -- included in above expressions
        '''
    
    print(problem)
    problem.solve()
    print(LpStatus[problem.status])

bus = [{'name': 'The Jolly Scholar', 'timeToSpend': 1, 'address': 'Thwing Ctr 11111 Euclid Ave Cleveland, OH 44106', 'rating': 4.0, 'id': 'wzj2cMpiDJW0HB3iCvCOYA', 'price': '$', 'url': 'https://www.yelp.com/biz/the-jolly-scholar-cleveland?adjust_creative=dQvSn56-m0sDVZemOiNI2w&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=dQvSn56-m0sDVZemOiNI2w', 'value': 4.0}, {'name': 'ABC the Tavern', 'timeToSpend': 1, 'address': '11434 Uptown Ave Cleveland, OH 44106', 'rating': 3.5, 'id': 'uYl_QBtb7bXhu9sgb4kCrg', 'price': '$', 'url': 'https://www.yelp.com/biz/abc-the-tavern-cleveland-4?adjust_creative=dQvSn56-m0sDVZemOiNI2w&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=dQvSn56-m0sDVZemOiNI2w', 'value': 3.5}, {'name': 'The Fairmount', 'timeToSpend': 1, 'address': '2448 Fairmount Blvd Cleveland Heights, OH 44106', 'rating': 4.0, 'id': 'g5zVkPRW2umfpCuDkan7tQ', 'price': '$$', 'url': 'https://www.yelp.com/biz/the-fairmount-cleveland-heights?adjust_creative=dQvSn56-m0sDVZemOiNI2w&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=dQvSn56-m0sDVZemOiNI2w', 'value': 2.0}, {'name': 'Townhall', 'timeToSpend': 1, 'address': '1909 W 25th St Cleveland, OH 44113', 'rating': 4.0, 'id': 'LNsZJP6jZ11e0tDljOLPiQ', 'price': '$$', 'url': 'https://www.yelp.com/biz/townhall-cleveland-2?adjust_creative=dQvSn56-m0sDVZemOiNI2w&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=dQvSn56-m0sDVZemOiNI2w', 'value': 2.0}, {'name': 'Punch Bowl Social Cleveland', 'timeToSpend': 1, 'address': '1086 W 11th St Cleveland, OH 44113', 'rating': 3.5, 'id': '9SrZRDl7-ZfuENCo0DjfsQ', 'price': '$$', 'url': 'https://www.yelp.com/biz/punch-bowl-social-cleveland-cleveland?adjust_creative=dQvSn56-m0sDVZemOiNI2w&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=dQvSn56-m0sDVZemOiNI2w', 'value': 1.75}]
distances = [[0, 219, 228, 528, 1042, 961], [292, 0, 209, 356, 963, 973], [231, 127, 0, 408, 1090, 1047], [596, 521, 493, 0, 1281, 1237], [969, 1093, 1090, 1194, 0, 402], [1033, 1156, 1154, 1272, 423, 0]]
createSchedule(bus, distances, 0.0, 172800.0)