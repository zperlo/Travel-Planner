/* contains the detail of each activity that is locked in. use
 * activityDict[n][0] to get thr detail of activity n,
 * activityDict[n][1] to get the JSON of activity n,
 * activityDict[n][2] to get the time in minutes
 */ 
var activityDict = {};

/* contains most recent search results for each activity. use
 * resultsDict[m] to get the full array of results for activity
 * m, resultsDict[m][n] to get result n from activity m, and
 * resultDict[m][n][0] to get that result's JSON
 */ 
var resultsDict = {};

function load() {
  addNewActivityLine();
  setFirstActivityLineDisabled(true);
}

/* Dylan look here */
function addNewActivityLine() {

    if (typeof addNewActivityLine.activityID == 'undefined') {
        addNewActivityLine.activityID = 1;
    }

    var ul = document.getElementById("activities");

    var activity = document.createElement("li");
    activity.className = "activity";
    activity.id = "activity:" + addNewActivityLine.activityID;
    ul.appendChild(activity);

    var cancel = document.createElement("button");
    cancel.type = "button";
    cancel.id = "cancel:" + addNewActivityLine.activityID;
    cancel.onclick = onCancelActivity;
    cancel.className = "buttonClass";
    activity.appendChild(cancel);

    var cancelIcon = document.createElement("i");
    cancelIcon.className = "icon-cancel";
    cancel.appendChild(cancelIcon);

    var textField = document.createElement("input");
    textField.type = "text";
    textField.id = "textField:" + addNewActivityLine.activityID;
    textField.className = "field";
    textField.placeholder = "Search...";
    activity.appendChild(textField);

    var search = document.createElement("button");
    search.type = "button";
    search.id = "search:" + addNewActivityLine.activityID;
    search.onclick = onSearch;
    search.className = "buttonClass";
    activity.appendChild(search);

    var searchIcon = document.createElement("i");
    searchIcon.className = "icon-search";
    search.appendChild(searchIcon);

    var brElement = document.createElement("br");
    brElement.id = "br:" + addNewActivityLine.activityID;
    activity.appendChild(brElement);

    addNewActivityLine.activityID++;
}

function removeActivityLine(idNum) {
  var activityId = "activity:" + idNum;  
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

function setFormEnabled(enabling) {
  var city = document.getElementById('city');
  var startDate = document.getElementById('startDate');

  var formElements = document.getElementById("mainForm").children;
  for (var i = 0; i < formElements.length; i++) {
    formElements[i].style.color = (enabling) ? "black" : "rgba(0, 0, 0, 0.4)"; 
    formElements[i].disabled = !enabling;
  }

  var angleBrackets = document.querySelectorAll(".angleBracketHolder .disabledAtStart");
  for (var i = 0; i < angleBrackets.length; i++) {
    angleBrackets[i].style.color = (enabling) ? "black" : "rgba(0, 0, 0, 0.4)"; 
    angleBrackets[i].disabled = !enabling;
  }

  if (enabling) {
    try {
      setFirstActivityLineDisabled(false);
    }
    catch (err) {}
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
  var extraDistance = 0;

  for (var i = 0; i < activities.length; i++) {
    if (activityIsAboveLine(searchIDNum, activities[i])) {
      extraDistance++;
    }
  }

  var searchResultsElement = document.getElementById('searchResults');
  extraDistance = extraDistance * 30 + 229;
  searchResultsElement.style.top = "".concat(extraDistance, "px");

  // populate searchResults
  var matches = yelpResponse.matchAll(/\{"name": "([^"]*)",[^\}]* "imgURL": "([^"]*)",[^\}]* "reviewCount": ([0-9]*),[^\}]* "rating": ([0-9\.]*)[^\}]* "url": "([^"]*)"[^\}]* "categories": "([^"]*)"[^\}]* "price": "((?:[^\"]+){1,4})",[^\}]* "addressLine1": "([^"]*)"[^\}]* "addressLine2": "([^"]*)"[^\}]*\}/g);
  var results = Array.from(matches);
  
  for (var i = 0; i < results.length; i++) {
    var result = results[i];
    createAndAddResult(result, i, searchIDNum);
  }

  var spacer = document.createElement("div");
  spacer.className = 'spacer';
  searchResults.appendChild(spacer);

  resultsDict[searchIDNum] = results;
}

/* Dylan look here */
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
  title.id = "resultName:".concat(resultIDNum);
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
  if (resultPrice == "?") {
    price.title = "No price data";
    price.innerHTML = resultPrice;
  }
  else {
    price.innerHTML = parsePrice(resultPrice);
  }
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

  var selectButton = document.createElement("button");
  selectButton.type="button"
  selectButton.className = "buttonClass";
  selectButton.id = "selectButton:".concat(activityIDNum, ':', resultIDNum);
  selectButton.onclick = onResultSelect;
  buttonHolder.appendChild(selectButton);

  var selectIcon = document.createElement("i");
  selectIcon.className = "icon-plus";
  selectButton.appendChild(selectIcon);
}

function parsePrice(priceStr) {
  var pounds = priceStr.match(/\\u00a3/g)?.length;
  if (pounds) {
    return "£".repeat(pounds);
  }
  var euros = priceStr.match(/\\u20ac/g)?.length;
  if (euros) {
    return "€".repeat(euros);
  }
  var yen = priceStr.match(/\\uffe5/g)?.length;
  if (yen) {
    return "¥".repeat(yen);
  }
  return priceStr;
}

function noResults(search, city, id) {
  destroyPreviousResults();

  var searchResults = document.getElementById('searchResults');

  // move searchResults to appropriate location
  var activities = document.getElementsByClassName("activity");
  var extraDistance = 0;

  for (var i = 0; i < activities.length; i++) {
    if (activityIsAboveLine(id, activities[i])) {
      extraDistance++;
    }
  }

  var searchResultsElement = document.getElementById('searchResults');
  extraDistance = extraDistance * 30 + 229;
  searchResultsElement.style.top = "".concat(extraDistance, "px");

  // populate
  var noResults = document.createElement("div");
  noResults.id = "noResults:".concat(id, ":0");
  noResults.className = "noResults";
  searchResults.appendChild(noResults);

  var message = document.createElement("p");
  message.className = "noResultsMsg";
  if (search == "") {
    message.innerHTML = "no results near ".concat("\"", city, "\"");
  }
  else {
    message.innerHTML = "no results for ".concat("\"", search, "\"", " near ", "\"", city, "\"");
  }
  noResults.appendChild(message);

  var spacer = document.createElement("div");
  spacer.className = 'spacer';
  searchResults.appendChild(spacer);
}

function destroyPreviousResults() {
  var searchResults = document.getElementById("searchResults");
  removeChildren(searchResults);
}

function getIDNum(element) {
  return element.id.split(/:(.+)/)[1];
}

function onCityKeyUp(keyboardEvent) {
  setFormEnabled(true);

  var city = document.getElementById("city");
  var key = keyboardEvent.key;

  if (key == "Enter") {
    city.blur();
  }
}

function onCityBlur() {
  validateLocation();
}

function onCancelActivity(event) {
  var id = getIDNum(event.target);
  var results = document.getElementById('searchResults');
  var firstResult = results.firstElementChild;
  var activeActivityLineID = firstResult?.id.split(':')[1];

  removeActivityLine(id);
  unstageResult(id);

  if (id == activeActivityLineID) {
    destroyPreviousResults();
  }
  else if (parseInt(id) < parseInt(activeActivityLineID)) {
    var distanceFromTop = results.style.top;
    var intDistance = parseInt(distanceFromTop.substring(0, distanceFromTop.indexOf("px")));
    intDistance = intDistance - 30;
    results.style.top = "".concat(intDistance, "px");
  }
}

function onSearch(event) {
  destroyPreviousResults();

  var buttons = document.getElementsByClassName("buttonClass");

  for (var i = 0; i < buttons.length; i++) {
    if (buttons[i].id.match(/^collapseSearch:[0-9]+$/g)) {
      transformIntoSearchButton(buttons[i]);
    }
    else if (buttons[i].id.match(/^collapseDetail:[0-9]+$/g)) {
      transformIntoExpandDetailButton(buttons[i]);
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
  var id = getIDNum(event.target);

  populateResultToField(id);
  stageResult(id);
  destroyPreviousResults();
}

function onTimeFieldKeyUp(event) {
  var field = event.target;
  removeLeadingZeros(field);
  validateTimeSpent(getIDNum(field));
}

function onExpandDetail(event) {
  destroyPreviousResults();

  var id = getIDNum(event.target);

  var searchResults = document.getElementById('searchResults');

  // move searchResults to appropriate location
  var activities = document.getElementsByClassName("activity");
  var extraDistance = 0;

  for (var i = 0; i < activities.length; i++) {
    if (activityIsAboveLine(id, activities[i])) {
      extraDistance++;
    }
  }

  extraDistance = extraDistance * 30 + 229;
  searchResults.style.top = "".concat(extraDistance, "px");

  // collapse any open detail or search
  var buttons = document.getElementsByClassName("buttonClass");

  for (var i = 0; i < buttons.length; i++) {
    if (buttons[i].id.match(/^collapseSearch:[0-9]+$/g)) {
      transformIntoSearchButton(buttons[i]);
    }
    else if (buttons[i].id.match(/^collapseDetail:[0-9]+$/g)) {
      transformIntoExpandDetailButton(buttons[i]);
    }
  }

  // populate
  searchResults.appendChild(activityDict[id][0]);

  var spacer = document.createElement("div");
  spacer.className = 'spacer';
  searchResults.appendChild(spacer);

  // transform button
  var button = document.getElementById('expandDetail:'.concat(id));
  transformIntoCollapseDetailButton(button);
}

function onCollapseDetail(event) {
  destroyPreviousResults();

  var id = getIDNum(event.target);
  var button = document.getElementById("collapseDetail:".concat(id));
  transformIntoExpandDetailButton(button);
}

function transformIntoExpandDetailButton(button) {
  var idNum = getIDNum(button);

  removeChildren(button);

  var expandIcon = document.createElement("i");
  expandIcon.className = "icon-expand";
  button.appendChild(expandIcon);

  button.id = "expandDetail:".concat(idNum);
  button.onclick = onExpandDetail;
}

function transformIntoCollapseDetailButton(button) {
  var idNum = getIDNum(button);

  removeChildren(button);

  var collapseIcon = document.createElement("i");
  collapseIcon.className = "icon-collapse";
  button.appendChild(collapseIcon);

  button.id = "collapseDetail:".concat(idNum);
  button.onclick = onCollapseDetail;  
}

function transformIntoCollapseSearchButton(button) {
  var idNum = getIDNum(button);

  removeChildren(button);

  var collapseIcon = document.createElement("i");
  collapseIcon.className = "icon-collapse";
  button.appendChild(collapseIcon);

  button.id = "collapseSearch:".concat(idNum);
  button.onclick = onCollapseSearch;
}

function transformIntoSearchButton(button) {
  var idNum = getIDNum(button);

  removeChildren(button);

  var searchIcon = document.createElement("i");
  searchIcon.className = "icon-search";
  button.appendChild(searchIcon);

  button.id = "search:".concat(idNum);
  button.onclick = onSearch;
}

function transformIntoResultSelectButton(button) {
  var idNum = getIDNum(button);

  removeChildren(button);

  var selectIcon = document.createElement("i");
  selectIcon.className = "icon-plus";
  button.appendChild(selectIcon);

  button.id = "selectButton:".concat(idNum);
  button.onclick = onResultSelect;
}

function transformIntoConfirmTimeButton(button) {
  var idNum = getIDNum(button);

  removeChildren(button);

  var confirmIcon = document.createElement("i");
  confirmIcon.className = "icon-check";
  button.appendChild(confirmIcon);

  button.id = "confirm:".concat(idNum);
  button.onclick = onConfirmTime;
}

function removeChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.lastChild);
  }
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
  var confirmButton = document.getElementById("confirm:".concat(idNum));

  var digitsOnlyRegex = /^[0-9]*$/;

  var hValid = hours.value.match(digitsOnlyRegex);
  var mValid = minutes.value.match(digitsOnlyRegex);

  valid = (hValid && mValid) && !(hours.value == "" && minutes.value == "");

  // validate fields if true, invalidate if false
  setFieldInvalidated(hours, !hValid);
  setFieldInvalidated(minutes, !mValid);

  // disable confirm if invalid, enable if valid
  setButtonDisabled(confirmButton, !valid);
}

function setFieldInvalidated(field, invalidating) {
  var border = (invalidating) ? "rgb(255, 94, 0)" : "rgb(255, 196, 0)";
  var bg = (invalidating) ? "rgb(255, 94, 0, 0.4)" : "inherit";

  field.style.borderColor = border;
  field.style.backgroundColor = bg;
}

function setFieldLockedIn(field, locking, strict) {
  if (locking && strict) {
    field.disabled = true;
    field.style.color = "black";
  }

  var weight = (locking) ? "bold" : "normal";
  var border = (locking) ? "rgb(157, 204, 46)" : "rgb(255, 196, 0)";
  var bg = (locking) ? "rgba(157, 204, 46, 0.4)" : "inherit";

  field.style.fontWeight = weight;
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
  // prompts have confirm buttons iff they are open
  var button = document.getElementById('confirm:'.concat(idNum));

  // iff a prompt is open (confirm button is truthy), close it
  if (button) {
    button.style.top = "-31px";
    setButtonDisabled(button, false);
    transformIntoResultSelectButton(button);

    var result = document.getElementById('searchResult:'.concat(idNum));
    result.style.backgroundColor = "inherit";

    var span = document.getElementById('howLongLabel:'.concat(idNum));
    span.style.opacity = "0";

    var div = document.getElementById('timeInput:'.concat(idNum));
    div.style.opacity = "0";
  }
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

function populateResultToField(wholeID) {
  var idPair = wholeID.split(':');
  var activityID = idPair[0];
  var resultID = idPair[1];

  var resultName = document.getElementById('resultName:'.concat(resultID));
  var activityField = document.getElementById('textField:'.concat(activityID));

  setFieldLockedIn(activityField, true, true);
  activityField.value = resultName.textContent;

  var collapseSearchButton = document.getElementById('collapseSearch:'.concat(activityID));

  transformIntoExpandDetailButton(collapseSearchButton);
}

function stageResult(wholeID) {
  var innerDict = {};

  var idPair = wholeID.split(':');

  var result = document.getElementById('searchResult:'.concat(wholeID));
  var detail = resultToDetail(result);
  innerDict[0] = detail;


  var JSON = resultsDict[idPair[0]][idPair[1]];
  innerDict[1] = JSON;

  var hours = document.getElementById('hours:'.concat(wholeID)).value;
  var minutes = document.getElementById('minutes:'.concat(wholeID)).value;
  var timeSpentInMinutes = hours * 60 + minutes;
  innerDict[2] = timeSpentInMinutes;

  activityDict[idPair[0]] = innerDict;
}

function unstageResult(id) {
  delete activityDict[id];
}

function resultToDetail(result) {
  var detail = result.cloneNode(true);

  var selectUI = detail.querySelector(".selectUI");

  var timeFields = selectUI.querySelectorAll(".field");
  var hours = timeFields[0].value;
  var minutes = timeFields[1].value;

  var visitTime = "";
  if (hours) {
    visitTime = visitTime.concat(hours, "h ");
  }
  if (minutes) {
    visitTime = visitTime.concat(minutes, "m");
  }

  selectUI.firstElementChild.remove();

  selectUI.style.paddingLeft = "8px";
  selectUI.innerHTML = "visiting for...<br>".concat(visitTime.trim());

  detail.style.backgroundColor = "inherit";

  return detail;
}

function createScheduleAndRedirect() {
  createSchedule();
}

function relativeRedirect(path) {
  window.location.href = path;
}

function activityIsAboveLine(searchIDstr, activity) {
  try {
    activityID = parseInt(getIDNum(activity));
    searchID = parseInt(searchIDstr);
    return activityID < searchID;
  }
  catch (err) {
    console.log("invalid activity or search ID");
    console.log(error);
    return false;
  }
}