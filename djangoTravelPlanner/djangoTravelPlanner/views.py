from django.http import HttpResponse
from django.shortcuts import render
import djangoTravelPlanner.Backend.yelpRequests as yelp
import json


def homepage(request):
    return render(request, 'homepage.html')

def resultspage(request):
    return render(request, 'results.html')

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