function load() {
    addResults();
  }

function addResults(){
    if(!schedule || schedule == "" || schedule == "No schedule found" || schedule[0] == null){
        console.log("no schedule");
    } else {
        var newschedule = schedule.split("&#x27;, ");
        scheduleActivity(newschedule);
    }
}

function scheduleActivity(schedule){
    var results = [];
    for (var i = 0; i < schedule.length; i++) {
        results.push(schedule[i].match(/[\[]*&#x27;([A-Z][\S ]+): starts on ([A-Z]\w+, [A-Z]\w+ [0-9]+), at ([0-9]+:[0-9]+ [A-Z]+) and ends on ([A-Z]\w+, [A-Z]\w+ [0-9]+), at ([0-9]+:[0-9]+ [A-Z]+) at address ([\S ]+, [\S]+ [0-9]+).*/));
        console.log(results);
    }

    var section = document.getElementById("itinerary");
    var section2 = document.getElementById("angleBracketItinerary");
    var currentDay = "";

    for (var i = 0; i < results.length; i++){
        var resultName = results[i][1];
        var resultStartDate = results[i][2];
        var resultStartTime = results[i][3];
        var resultEndTime = results[i][5];

        if (currentDay == "" || resultStartDate != currentDay){
            currentDay = resultStartDate;
            var daySep = document.createElement("div");
            daySep.className = "daySeparator";
            section.appendChild(daySep);

            var daySpan = document.createElement("span");
            daySpan.innerHTML = resultStartDate;
            daySep.appendChild(daySpan);

            // Second copy for angle bracket holder

            var daySep2 = document.createElement("div");
            daySep2.className = "daySeparator";
            section2.appendChild(daySep2);

            var daySpan2 = document.createElement("span");
            daySpan2.innerHTML = resultStartDate;
            daySep2.appendChild(daySpan2);
        }
    
        var itineraryItem = document.createElement("itineraryItem");
        section.appendChild(itineraryItem);
    
        var timeRange = document.createElement("h3");
        timeRange.innerHTML = resultStartTime + " > " + resultEndTime;
        itineraryItem.appendChild(timeRange);
    
        var nameSpan = document.createElement("span");
        nameSpan.innerHTML = resultName;
        itineraryItem.appendChild(nameSpan);

        var br = document.createElement("br");
        section.appendChild(br);

        // Second copy for angle bracket holder

        var itineraryItem2 = document.createElement("itineraryItem");
        section2.appendChild(itineraryItem2);
    
        var timeRange2 = document.createElement("h3");
        timeRange2.innerHTML = resultStartTime + " > " + resultEndTime;
        itineraryItem2.appendChild(timeRange2);
    
        var nameSpan2 = document.createElement("span");
        nameSpan2.innerHTML = resultName;
        itineraryItem2.appendChild(nameSpan2);

        var br2 = document.createElement("br");
        section2.appendChild(br2);
    }

    var br = document.createElement("br");
    section.appendChild(br);

    var br2 = document.createElement("br");
    section2.appendChild(br2);

    var angleh2 = document.createElement("h2");
    angleh2.innerHTML = ">";
    section2.appendChild(angleh2);

    var mapsh2 = document.createElement("h2");
    mapsh2.innerHTML = "Google Maps Route";
    section.appendChild(mapsh2);

    var mapsEmbedLink = "https://www.google.com/maps/embed/v1/directions";
    var key = "?key=" + googleKey;
    var formattedStartLoc = startingLocation.replace(/ /g, '+');
    var origin = "&origin=" + formattedStartLoc;

    var waypoints = "";
    for (var i = 0; i < results.length - 1; i++){
        if (i == 0){
            waypoints = "&waypoints="
        } else {
            waypoints = waypoints + "|";
        }
        var formattedAddress = (results[i][1] + "," + results[i][6]).replace(/ /g, '+').replace(/&/g, "");
        waypoints = waypoints + formattedAddress;
    }
    var formattedDest = (results[results.length - 1][1] + "," + results[results.length - 1][6]).replace(/ /g, '+').replace(/&/g, "");
    var destination = "&destination=" + formattedDest;

    mapsEmbedLink = mapsEmbedLink + key + origin + waypoints + destination;

    var mapsEmbed = document.createElement("iframe");
    mapsEmbed.className = 'map';
    mapsEmbed.src = mapsEmbedLink;
    section.appendChild(mapsEmbed);

    var br3 = document.createElement("br");
    section.appendChild(br3);

    var emptyDiv = document.createElement("div");
    section.appendChild(emptyDiv);
}