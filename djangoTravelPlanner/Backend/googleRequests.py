import googlemaps
import json

# takes a list of location strings and returns a 2D array of the driving time in seconds
# from each point to each other point
# every row is one origin to every destination (including itself)
# ie travelTimes[0][0] = 0 = travelTimes[3][3] etc
def getDistanceMatrix(locations):
    apiKey = "AIzaSyDiX_Gbk5kU1D6Sz29Jdu8LIf94QT2W3T8"
    gmaps = googlemaps.Client(key=apiKey)

    response = gmaps.distance_matrix(locations, locations)

    travelTimes = []
    for origin in response["rows"]:
        travelTimesFromOrigin = []
        for destination in origin["elements"]:
            travelTimesFromOrigin.append(destination["duration"]["value"])
        travelTimes.append(travelTimesFromOrigin)
    
    return travelTimes

# sample locations are for Indian Flame, Tandul, and Paradise Biryani Pointe
# sampleLocationList = ["11607 Euclid Ave Cleveland, OH 44106", "2505 Professor Ave Cleveland, OH 44113", "6679 Wilson Mills Rd Gates Mills, OH 44040"]
# sampleResponse = getDistanceMatrix(sampleLocationList)
# sampleResponse = {'destination_addresses': ['11607 Euclid Ave, Cleveland, OH 44106, USA', '2505 Professor Ave, Cleveland, OH 44113, USA', '6679 Wilson Mills Rd, Gates Mills, OH 44040, USA'], 'origin_addresses': ['11607 Euclid Ave, Cleveland, OH 44106, USA', '2505 Professor Ave, Cleveland, OH 44113, USA', '6679 Wilson Mills Rd, Gates Mills, OH 44040, USA'], 'rows': [{'elements': [{'distance': {'text': '1 m', 'value': 0}, 'duration': {'text': '1 min', 'value': 0}, 'status': 'OK'}, {'distance': {'text': '12.0 km', 'value': 11955}, 'duration': {'text': '17 mins', 'value': 1007}, 'status': 'OK'}, {'distance': {'text': '15.4 km', 'value': 15354}, 'duration': {'text': '26 mins', 'value': 1551}, 'status': 'OK'}]}, {'elements': [{'distance': {'text': '15.2 km', 'value': 15187}, 'duration': {'text': '19 mins', 'value': 1128}, 'status': 'OK'}, {'distance': {'text': '1 m', 'value': 0}, 'duration': {'text': '1 min', 'value': 0}, 'status': 'OK'}, {'distance': {'text': '35.5 km', 'value': 35523}, 'duration': {'text': '27 mins', 'value': 1600}, 'status': 'OK'}]}, {'elements': [{'distance': {'text': '30.7 km', 'value': 30717}, 'duration': {'text': '26 mins', 'value': 1551}, 'status': 'OK'}, {'distance': {'text': '37.1 km', 'value': 37144}, 'duration': {'text': '25 mins', 'value': 1528}, 'status': 'OK'}, {'distance': {'text': '1 m', 'value': 0}, 'duration': {'text': '1 min', 'value': 0}, 'status': 'OK'}]}], 'status': 'OK'}