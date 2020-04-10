function load() {
  addNewActivityLine();
  setFirstActivityLineDisabled(true);
}

function addNewActivityLine() {

    if (typeof addNewActivityLine.activityID == 'undefined') {
        addNewActivityLine.activityID = 1;
    }

    var ul = document.getElementById("activities");

    var activity = document.createElement("li");
    activity.className = "activity";
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

    var search = document.createElement("input");
    search.type = "button";
    search.value = "s"
    search.id = "search:" + addNewActivityLine.activityID;
    search.onclick = onSearch;
    search.className = "buttonClass";
    activity.appendChild(search);

    var brElement = document.createElement("br");
    brElement.id = "br:" + addNewActivityLine.activityID;
    activity.appendChild(brElement);

    addNewActivityLine.activityID++;
}

function removeActivityLine(event) {

  var cancelId = getEventTargetID(event);
  var id = cancelId.split(":")[1];
  var activityId = "activity:" + id;
  
  document.getElementById(activityId).remove();
}

/* deprecated */
function showMoreDetailsFromButton(event) {
  showMoreDetails(getEventTargetID(event));
}

/* deprecated */
function showMoreDetails(searchID) {
  var button = document.getElementById(searchID);
  var details = document.getElementById('searchResults');
  if (searchID != showMoreDetails.lastID) {
    button.value = '<';
    showMoreDetails.lastID = searchID;
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

function getEventTargetID(event) {
  return event.target.id;
}

/* deprecated */
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
  var yelpChildren = yelpData[1].childNodes;
  var yelpGrandchildren = yelpChildren[3].childNodes;

  yelpChildren[1].src = imageURL;
  yelpGrandchildren[1].href = yelpURL;
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
  var startDate = document.getElementById('startDate');

  if(city.value != "" && startDate.disabled) {
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

function setButtonDisabled(button, disabling) {
  button.style.color = (disabling) ? "rgba(0, 0, 0, 0.4)" : "black";
  button.disabled = disabling;
}

function showResults(yelpResponse, searchIDNum) {
  // move searchResults to appropriate location
  var activities = document.getElementsByClassName("activity");
  var distance = 0;

  for (var i = 0; i < activities.length; i++) {
    if (getIDNum(activities[i]) < searchIDNum) {
      distance++;
    }
  }

  var searchResultsElement = document.getElementById('searchResults');
  distance = distance * 30 + 229;
  searchResultsElement.style.top = "".concat(distance, "px");

  // populate searchResults
  var matches = yelpResponse.matchAll(/\{"name": "([^"]*)",[^\}]* "imgURL": "([^"]*)",[^\}]* "reviewCount": ([0-9]*),[^\}]* "rating": ([0-9\.]*)[^\}]* "url": "([^"]*)"[^\}]* "categories": "([^"]*)"[^\}]* "price": "(\${1,4})",[^\}]* "addressLine1": "([^"]*)"[^\}]* "addressLine2": "([^"]*)"[^\}]*\}/g);
  var results = Array.from(matches);
  
  for (var i = 0; i < results.length; i++) {
    var result = results[i];
    createAndAddResult(result, i, searchIDNum);
  }
}

function createAndAddResult(result, resultIDNum, activityIDNum) {

  var resultName = result[1];
  var resultRating = result[4];
  var resultReviewCount = result[3];
  var resultPrice = result[7];
  var resultCategories = result[6];
  var resultAddressLine1 = result[8];
  var resultAddressLine2 = result[9];
  var resultImageURL = result[2];
  var resultYelpURL = result[5];

  var section = document.getElementById("searchResults");

  var searchResult = document.createElement("div");
  searchResult.id = "searchResult:".concat(activityIDNum, ':', resultIDNum);
  searchResult.className = "searchResult";
  section.appendChild(searchResult);

  var leftSideDetails = document.createElement("div");
  leftSideDetails.className = "leftSideDetails";
  searchResult.appendChild(leftSideDetails);

  var title = document.createElement("h2");
  title.innerHTML = resultName;
  leftSideDetails.appendChild(title);

  var yelpStars = document.createElement("img");
  yelpStars.className = "yelpStars";
  yelpStars.src = getRatingImagePath(resultRating);
  yelpStars.alt = "";
  leftSideDetails.appendChild(yelpStars);

  var totalReviews = document.createElement("span");
  totalReviews.className = "totalReviews";
  totalReviews.innerHTML = resultReviewCount.concat(" Reviews");
  leftSideDetails.appendChild(totalReviews);

  var br = document.createElement("br");
  leftSideDetails.appendChild(br);

  var price = document.createElement("span");
  price.className = "price";
  price.innerHTML = resultPrice;
  leftSideDetails.appendChild(price);

  var bullet = document.createElement("span");
  bullet.className = "bullet";
  bullet.innerHTML = ">";
  leftSideDetails.appendChild(bullet);

  var categories = document.createElement("span");
  categories.className = "categories";
  categories.innerHTML = resultCategories;
  leftSideDetails.appendChild(categories);

  var br2 = document.createElement("br");
  leftSideDetails.appendChild(br2);

  var address1 = document.createElement("span");
  address1.className = "address";
  address1.innerHTML = resultAddressLine1;
  leftSideDetails.appendChild(address1);

  var br3 = document.createElement("br");
  leftSideDetails.appendChild(br3);

  var address2 = document.createElement("span");
  address2.className = "address";
  address2.innerHTML = resultAddressLine2;
  leftSideDetails.appendChild(address2);

  var vl = document.createElement("div");
  vl.className = "vl";
  searchResult.appendChild(vl);

  var yelpImagery = document.createElement("div");
  yelpImagery.className = "yelpImagery";
  searchResult.appendChild(yelpImagery);

  var frame = document.createElement("div");
  frame.className = "frame";
  yelpImagery.appendChild(frame);

  var yelpPhoto = document.createElement("img");
  yelpPhoto.className = "yelpPhoto";
  yelpPhoto.src = resultImageURL;
  yelpPhoto.alt = "";
  frame.appendChild(yelpPhoto);

  var glass = document.createElement("div");
  glass.className = "glass";
  frame.appendChild(glass);

  var link = document.createElement("a");
  link.href = resultYelpURL;
  link.target = '_blank';
  glass.appendChild(link);

  var yelpLogo = document.createElement("img");
  yelpLogo.className = "yelpLogo";
  yelpLogo.src = 'Frontend\\resources\\yelpLogo.png';
  yelpLogo.alt = "Yelp Logo";
  link.appendChild(yelpLogo);

  var selectUI = document.createElement("div");
  selectUI.className = "selectUI";
  searchResult.appendChild(selectUI);

  var selectControls = document.createElement("div");
  selectControls.className = "selectControls";
  selectUI.appendChild(selectControls);

  var howLongLabel = document.createElement("span");
  howLongLabel.id = "howLongLabel:".concat(activityIDNum, ':', resultIDNum);
  howLongLabel.innerHTML = "How long will you spend here?";
  selectControls.appendChild(howLongLabel);

  var timeInput = document.createElement("div");
  timeInput.className = "timeInput";
  timeInput.id = "timeInput:".concat(activityIDNum, ':', resultIDNum);
  selectControls.appendChild(timeInput);

  var hourField = document.createElement("input");
  hourField.className = "field";
  hourField.id = "hours:".concat(activityIDNum, ':', resultIDNum);
  hourField.type = "text";
  hourField.placeholder = "0";
  hourField.onkeyup = onTimeFieldKeyUp;
  timeInput.appendChild(hourField);

  var hourLabel = document.createElement("span");
  hourLabel.className = "hourLabel";
  hourLabel.innerHTML = "h";
  timeInput.appendChild(hourLabel);

  var minuteField = document.createElement("input");
  minuteField.className = "field";
  minuteField.id = "minutes:".concat(activityIDNum, ':', resultIDNum);
  minuteField.type = "text";
  minuteField.placeholder = "0";
  minuteField.onkeyup = onTimeFieldKeyUp;
  timeInput.appendChild(minuteField);

  var minuteLabel = document.createElement("span");
  minuteLabel.className = "minuteLabel";
  minuteLabel.innerHTML = "m";
  timeInput.appendChild(minuteLabel);

  var buttonHolder = document.createElement("div");
  buttonHolder.className = "buttonHolder";
  selectControls.appendChild(buttonHolder);

  var selectButton = document.createElement("input");
  selectButton.type = "button";
  selectButton.value = "+";
  selectButton.className = "buttonClass";
  selectButton.id = "selectButton:".concat(activityIDNum, ':', resultIDNum);
  selectButton.onclick = onResultSelect;
  buttonHolder.appendChild(selectButton);
}

function noResults(search, city) {
  console.log("No results for ".concat("\"", search, "\"", " in ", "\"", city, "\""));
}

function destroyPreviousResults() {
  var section = document.getElementById("searchResults");
  var searchResults = section.childNodes;
  while (searchResults.length){ // cheeky
    searchResults[0].remove();
  }
}

function getIDNum(element) {
  return element.id.split(/:(.+)/)[1];
}

function onSearch(event) {
  destroyPreviousResults();

  var buttons = document.getElementsByClassName("buttonClass");

  for (var i = 0; i < buttons.length; i++) {
    if (buttons[i].id.match(/^collapseSearch:[0-9]+$/)) {
      transformIntoSearchButton(buttons[i]);
    }
  }

  analyzeText(event);

  var id = getEventTargetID(event);
  var button = document.getElementById(id);
  transformIntoCollapseSearchButton(button);
}

function onCollapseSearch(event) {
  destroyPreviousResults();
  
  var id = getEventTargetID(event);
  var button = document.getElementById(id);
  transformIntoSearchButton(button);
}

function onResultSelect(event) {
  var id = getIDNum(event.target);
  closeSiblingPrompts(id);
  promptForTimeSpent(id);
}

function onConfirmTime(event) {

}

function transformIntoCollapseSearchButton(button) {
  var idNum = getIDNum(button);

  button.value = "<";
  button.id = "collapseSearch:".concat(idNum);
  button.onclick = onCollapseSearch;
}

function transformIntoSearchButton(button) {
  var idNum = getIDNum(button);

  button.value = "s";
  button.id = "search:".concat(idNum);
  button.onclick = onSearch;
}

function transformIntoResultSelectButton(button) {
  var idNum = getIDNum(button);

  button.value = "+";
  button.id = "selectButton:".concat(idNum);
  button.onclick = onResultSelect;
}

function transformIntoConfirmTimeButton(button) {
  button.value = "v";
  // button.onclick = onConfirmSearch;
}

function onTimeFieldKeyUp(event) {
  var field = event.target;
  removeLeadingZeros(field);
  validateTimeSpent(getIDNum(field));
}

function removeLeadingZeros(field) {
  while (field.value.startsWith('0')) {
    field.value = field.value.substring(1);
  }
}

function validateTimeSpent(idNum) {
  var valid = true;
  var hours = document.getElementById("hours:".concat(idNum));
  var minutes = document.getElementById("minutes:".concat(idNum));
  var confirmButton = document.getElementById("selectButton:".concat(idNum));

  var digitsOnlyRegex = /^[0-9]*$/;

  var hValid = hours.value.match(digitsOnlyRegex);
  var mValid = minutes.value.match(digitsOnlyRegex);

  valid = (hValid && mValid) && !(hours.value == "" && minutes.value == "");

  // validate fields if true, invalidate if false
  setFieldValidated(hours, hValid);
  setFieldValidated(minutes, mValid);

  // disable confirm if invalid, enable if valid
  setButtonDisabled(confirmButton, !valid);
}

function setFieldValidated(field, validating) {
  var border = (validating) ? "rgb(255, 196, 0)" : "rgb(255, 94, 0)";
  var bg = (validating) ? "inherit" : "rgb(255, 94, 0, 0.4)";

  field.style.borderColor = border;
  field.style.backgroundColor = bg;
}

function promptForTimeSpent(idNum) {
  var result = document.getElementById('searchResult:'.concat(idNum));
  result.style.backgroundColor = "rgb(255, 237, 175)";

  var span = document.getElementById('howLongLabel:'.concat(idNum));
  span.style.opacity = "1";

  var div = document.getElementById('timeInput:'.concat(idNum));
  div.style.opacity = "1";

  var button = document.getElementById('selectButton:'.concat(idNum));
  button.style.top = "0px";
  setButtonDisabled(button, true);
  transformIntoConfirmTimeButton(button);
}

function closePrompt(idNum) {
  var result = document.getElementById('searchResult:'.concat(idNum));
  result.style.backgroundColor = "inherit";

  var span = document.getElementById('howLongLabel:'.concat(idNum));
  span.style.opacity = "0";

  var div = document.getElementById('timeInput:'.concat(idNum));
  div.style.opacity = "0";

  var button = document.getElementById('selectButton:'.concat(idNum));
  button.style.top = "-31px";
  setButtonDisabled(button, false);
  transformIntoResultSelectButton(button);
}

function closeSiblingPrompts(idNum) {
  var results = document.getElementsByClassName("searchResult");

  for (var i = 0; i < results.length; i++) {
    var siblingID = getIDNum(results[i]);
    if (siblingID != idNum) {
      closePrompt(siblingID);
    }
  }
}