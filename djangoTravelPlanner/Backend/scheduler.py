from pulp import *

def createSchedule(businesses, travelTimes, startDate, endDate):
    problem = LpProblem("Schedule Activities", LpMaximize)
    globalStartTime = 0
    globalStartDay = startDate # TODO: capture day of week from start date
    globalEndTime = endDate # convert to number of seconds since start time
    globalEndDay = endDate # TODO: capture day of week from end date

    # create enough variables for start and end time of each activity
    activityStartEnd = LpVariable.dicts("activityStartEnd", list(range(2*len(businesses))), cat="Integer")

    activities = []
    for i in range(businesses):
        # variable for each activity to say if it is scheduled or not
        activities.append(LpVariable("activity " + i, cat="Binary"))
    
    goal = sum([businesses[i]["value"] * activities[i] for i in businesses])

    for i in range(businesses):
        # activities must be scheduled later than global start + travel time
        c1 = activityStartEnd[2*i] * activities[i] >= (globalStartTime + travelTimes[0][i+1]) * activities[i]
        c2 = activityStartEnd[2*i + 1] * activities[i] >= (globalStartTime + travelTimes[0][i+1]) * activities[i]
        # must spend required amount of time at activity (or 0 if not scheduled)
        c3 = activityStartEnd[2*i + 1] - activityStartEnd[2*i] == businesses[i]["timeToSpend"] * activities[i]

        # constraints based on open/close times

        # constraints based on travel times and non-overlapping
        for j in range(businesses):
            if j != i:
                # x start must be after y end + travel time from y to x
                activityStartEnd[2*i] * (activities[i] + activities[j] - 1) >= (activityStartEnd[2*j + 1] + travelTimes[j+1][i+1]) * (activities[i] + activities[j] - 1)
                # OR y start must be after x end + travel time from x to y
                activityStartEnd[2*j] * (activities[i] + activities[j] - 1) >= (activityStartEnd[2*i + 1] + travelTimes[i+1][j+1]) * (activities[i] + activities[j] - 1)
                # OR one of them must be not scheduled -- included in above expressions
