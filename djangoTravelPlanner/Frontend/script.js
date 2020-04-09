function load() {
  addNewActivityLine();
  setFirstActivityLineDisabled(true);
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
    // expand.onclick = analyzeText;
    expand.onclick = showMoreDetailsFromButton;
    expand.className = "buttonClass";
    activity.appendChild(expand);

    var brElement = document.createElement("br");
    brElement.id = "br:" + addNewActivityLine.activityID;
    activity.appendChild(brElement);

    addNewActivityLine.activityID++;
}

function removeActivityLine(event) {

  var cancelId = getEventID(event);
  var id = cancelId.split(":")[1];
  var activityId = "activity:" + id;
  
  document.getElementById(activityId).remove();
}

function showMoreDetailsFromButton(event) {
  showMoreDetails(getEventID(event));
}

function showMoreDetails(expandID) {
  
  var buttons = document.getElementsByClassName("buttonClass");

  for (var i = 0; i < buttons.length; i++) {
    if (buttons[i].id.match(/^expand:[0-9]+$/)) {
      buttons[i].value = '>';
    }
  }

  var button = document.getElementById(expandID);
  var details = document.getElementById('searchResults');
  if (expandID != showMoreDetails.lastID) {
    button.value = '<';
    showMoreDetails.lastID = expandID;
    // populateDetails(
    //   "Spread Bagelry",
    //   "3.5",
    //   "538",
    //   "$$",
    //   "Breakfast & Brunch, Bagels, Sandwiches",
    //   "262 S 20th St",
    //   "Philadelphia, PA 19103",
    //   "https://s3-media0.fl.yelpcdn.com/bphoto/NwenshmRDzryFAPVbXZgJg/o.jpg",
    //   "https://www.yelp.com/biz/spread-bagelry-philadelphia-2?osq=spread+bagelry");
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
  if (rating.includes('.5')) {
    infix += "_half";
  }

  var str = "Frontend\\resources\\yelpStars\\large_".concat(infix, "\@2x.png");
  return str;
}

function enableForm() {
  var city = document.getElementById('city');

  if(city.value != "") {
    var disabledElements = document.getElementsByClassName("disabledAtStart");
    for (var i = 0; i < disabledElements.length; i++) {
      disabledElements[i].style.color = "black"; 
      disabledElements[i].disabled = false;
    }
    setFirstActivityLineDisabled(false);
  }
}

function setFirstActivityLineDisabled(disabling) {
  var firstActivityLine = document.getElementById("activity:1").childNodes;

  var cssColor = (disabling) ? "rgba(0, 0, 0, 0.4)" : "black";

  for (var i = 0; i < firstActivityLine.length; i++) {
    firstActivityLine[i].style.color = cssColor;
    firstActivityLine[i].disabled = disabling;
  }
}

function populateSearch(yelpResponse) {
  var matches = yelpResponse.matchAll(/\{"name": "([^"]*)",[^\}]* "imgURL": "([^"]*)",[^\}]* "reviewCount": ([0-9]*),[^\}]* "rating": ([0-9\.]*)[^\}]* "url": "([^"]*)"[^\}]* "categories": "([^"]*)"[^\}]* "price": "(\${1,4})",[^\}]* "addressLine1": "([^"]*)"[^\}]* "addressLine2": "([^"]*)"[^\}]*\}/g);
  var results = Array.from(matches);
  
  for (var i = 0; i < results.length; i++) {
    var result = results[i];
    // createAndAddResult()
  }
  result = results[0];
  populateDetails(result[1], result[4], result[3], result[7], result[6], result[8], result[9], result[2], result[5]);
}

function noResults(search, city) {
  console.log("No results for ".concat("\"", search, "\"", " in ", "\"", city, "\""));
}

/* Dear Zach,
 * 
 *  This function is something else I'd like you to
 * implement when you have a minute. As we discussed
 * earlier, createAndAddResult() is analogous to
 * addNewActivityLine(). In the same metaphor, this
 * function is analogous to removeActivityLine().
 * They key differences are when this function is
 * called and its scope.
 *  This function is called every time a new search
 * comes in (see homepage.html:27), as opposed to
 * when the user clicks a button. Because of this,
 * it does not receive an event argument.*
 *  "But with no event argument how will I know what
 * to destroy?" Great question. Our good friend
 * removeActivityLine() is concerned with removing
 * an activity from a list but allowing the rest to
 * remain. This new function is concerned with
 * clearing the previous results to make space for
 * the incoming ones. That is, it doesn't care about
 * specifics -- it just removes everything, leaving
 * an empty <section> in the html.
 * 
 *  Much love,
 *    Djacob
 * 
 *  * Earlier I mentioned to you that every JS
 *    function received an event argument. I
 *    misspoke there. Instead, every JS function
 *    which is triggered by an event such as
 *    onClick or onBlur receives an event argument.
 */

function destroyPreviousResults() {
  // TODO
}