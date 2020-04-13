from django.http import HttpResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import djangoTravelPlanner.Backend.yelpRequests as yelp
import djangoTravelPlanner.Backend.googleRequests as googleMaps
import djangoTravelPlanner.Backend.scheduler as scheduler
import djangoTravelPlanner.Backend.valueDetermination as valueDetermination
import json
from datetime import datetime


def homepage(request):
    return render(request, 'homepage.html')

def resultspage(request):
    schedule = request.session.get('schedule', 'No schedule found')
    context = {
        'schedule': schedule
    }
    return render(request, 'results.html', context=context)

def testcall(request):
    #Get the variable(s)
    text = request.POST['text']
    city = request.POST['city']

    #Do whatever with the input variable
    response = json.dumps(yelp.searchYelp(text, city))
    #for bus in yelp.searchYelp("Jolly Scholar", "Cleveland, OH"):
    #    response = response + bus["name"] + "\n"

    #Send the response 
    return HttpResponse(response)

@csrf_exempt
def callscheduler(request):
    #Get the variable(s)
    activities = request.POST['activities']

    activities = activities[1:-1]
    activityList = activities.split("},")
    for i in range(len(activityList)):
        if activityList[i][-1] != "}":
            activityList[i] = activityList[i] + "}"
    
    city = request.POST['city']
    #in the format YYYY-MM-DD
    startDate = request.POST['startDate']
    #in the format HH:MM in 24 hour time
    startTime = request.POST['startTime']
    #in the format YYYY-MM-DD
    endDate = request.POST['endDate']
    endTime = request.POST['endTime']

    dateFormat = '%Y-%m-%d %H:%M'
    startString = startDate + " " + startTime
    startDatetime = datetime.strptime(startString, dateFormat)
    endString = endDate + " " + endTime
    endDatetime = datetime.strptime(endString, dateFormat)

    startDay = startDatetime.weekday()
    endDay = endDatetime.weekday()

    businessList = []
    startLocation = {
        "name": "Starting location",
        "address": city
    }
    businessList.append(startLocation)

    locationList = []
    locationList.append(city)

    for activityJSON in activityList:
        activity = json.loads(activityJSON)
        businessList.append(activity)
        locationList.append(activity["address"])

    distances = googleMaps.getDistanceMatrix(locationList)

    valueDetermination.determineValue(businessList)

    schedule = scheduler.createSchedule(businessList, distances, startDatetime, endDatetime, startDay, endDay)

    response = schedule
    request.session['schedule'] = schedule

    #Send the response 
    return HttpResponse(response)