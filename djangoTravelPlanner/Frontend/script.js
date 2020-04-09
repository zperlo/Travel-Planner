var activityLines = []

function load() {
  addNewActivityLine();
}

function addNewActivityLine() {

    if (typeof addNewActivityLine.activityID == 'undefined') {
        addNewActivityLine.activityID = 1;
    }

    var ul = document.getElementById("activities");

    var activity = document.createElement("activity");
    activity.id = "activity:" + addNewActivityLine.activityID;
    ul.appendChild(activity);

    var cancel = document.createElement("input");
    cancel.type = "button";
    cancel.value = "x";
    cancel.id = "cancel:" + addNewActivityLine.activityID;
    cancel.onclick = removeActivityLine;
    cancel.className = "buttonClass disabledAtStart";
    cancel.disabled = true;
    activity.appendChild(cancel);

    var textField = document.createElement("input");
    textField.type = "text";
    textField.id = "textField:" + addNewActivityLine.activityID;
    textField.className = "field disabledAtStart";
    textField.disabled = true;
    activity.appendChild(textField);

    var expand = document.createElement("input");
    expand.type = "button";
    expand.value = ">"
    expand.id = "expand:" + addNewActivityLine.activityID;
    expand.onclick = analyzeText;
    expand.className = "buttonClass disabledAtStart"
    expand.disabled = true;
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
  var details = document.getElementById('searchResults');
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
      "https://s3-media0.fl.yelpcdn.com/bphoto/NwenshmRDzryFAPVbXZgJg/o.jpg",
      "https://www.yelp.com/biz/spread-bagelry-philadelphia-2?osq=spread+bagelry");
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

function populateDetails(name, rating, reviewCount, price, categories, addressLine1, addressLine2, imageURL, yelpURL) {
  var details = document.getElementById('searchResults');
  var divs = details.childNodes;

  var leftSideInfo = divs[1].childNodes[1].childNodes;

  leftSideInfo[1].textContent = name;
  leftSideInfo[3].src = getRatingImagePath(rating);
  leftSideInfo[5].textContent = reviewCount.concat(" Reviews");
  leftSideInfo[9].textContent = price;
  leftSideInfo[13].textContent = categories;
  leftSideInfo[17].textContent = addressLine1;
  leftSideInfo[21].textContent = addressLine2;

  var yelpData = divs[1].childNodes[5].childNodes;

  yelpData[1].src = imageURL;
  yelpData[3].href = yelpURL;
}

function getRatingImagePath(rating) {

  var infix = rating.charAt(0);
  if (rating.includes('.')) {
    infix += "_half";
  }

  var str = "Frontend\\resources\\yelpStars\\large_".concat(infix, "\@2x.png");
  return str;
}