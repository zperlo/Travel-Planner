var activityLines = []

function addNewActivityLine() {

    if (typeof addNewActivityLine.activityID == 'undefined') {
        addNewActivityLine.activityID = 1;
    }

    var div = document.getElementById("activities");

    var activity = document.createElement("activity");
    activity.id = "activity:" + addNewActivityLine.activityID;
    div.appendChild(activity);

    var cancel = document.createElement("input");
    cancel.type = "button";
    cancel.value = "x";
    cancel.id = "cancel:" + addNewActivityLine.activityID;
    cancel.onclick = removeActivityLine;
    cancel.className = "buttonClass";
    activity.appendChild(cancel);

    var textField = document.createElement("input");
    textField.type = "text";
    textField.id = "textField:" + addNewActivityLine.activityID;
    textField.className = "field";
    activity.appendChild(textField);

    var expand = document.createElement("input");
    expand.type = "button";
    expand.value = ">"
    expand.id = "expand:" + addNewActivityLine.activityID;
    expand.onclick = showMoreDetails;
    expand.className = "buttonClass"
    activity.appendChild(expand);

    var brElement = document.createElement("br");
    brElement.id = "br:" + addNewActivityLine.activityID;
    activity.appendChild(brElement);

    // activityLines[addNewActivityLine.activityID];

    addNewActivityLine.activityID++;
}

function removeActivityLine(event) {

  var cancelId = getEventID(event);
  var id = cancelId.split(":")[1];
  var activityId = "activity:" + id;
  
  document.getElementById(activityId).remove();
}

function showMoreDetails(event) {
  
  var buttons = document.getElementsByClassName("buttonClass");

  for (var i = 0; i < buttons.length; i++) {
    if (buttons[i].id.match(/^expand:[0-9]+$/)) {
      buttons[i].value = '>';
    }
  }

  var expandID = getEventID(event);
  var button = document.getElementById(expandID);
  var details = document.getElementById('moreDetails');
  if (expandID != showMoreDetails.lastID) {
    button.value = '<';
    showMoreDetails.lastID = expandID;
    populateDetails(
      "Spread Bagelry",
      "3.5",
      "538",
      "$$",
      "Breakfast & Brunch, Bagels, Sandwiches",
      "262 S 20th St",
      "Philadelphia, PA 19103",
      "https://s3-media0.fl.yelpcdn.com/bphoto/NwenshmRDzryFAPVbXZgJg/o.jpg");
    details.style.visibility = 'visible';
  }
  else {
    button.value = '>';
    showMoreDetails.lastID = "";
    details.style.visibility = 'hidden';
  }

}

function getEventID(event) {
  return event.target.id;
}

function populateDetails(name, rating, reviewCount, price, categories, addressLine1, addressLine2, imageURL) {
  var details = document.getElementById('moreDetails');
  var divs = details.childNodes;

  console.log('details children:');
  console.log(divs);

  var children = divs[1].childNodes;

  console.log('div children:');
  console.log(children);

  // update name
  children[1].textContent = name;

  // update rating
  children[3].src = getRatingImageStaticPath(rating);
}

function getRatingImageStaticPath(rating) {

  var infix = rating.charAt(0);
  if (rating.includes('.')) {
    infix += "_half";
  }

  str = "{% static 'resources\\yelpStars\\large_".concat(infix, "@2x.png' %}");
  console.log(str);
  return str;
}
