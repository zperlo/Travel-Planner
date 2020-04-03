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
    // expand.onclick = expandActivityLine;
    expand.className = "buttonClass"
    activity.appendChild(expand);

    var brElement = document.createElement("br");
    brElement.id = "br:" + addNewActivityLine.activityID;
    activity.appendChild(brElement);

    // activityLines[addNewActivityLine.activityID];

    addNewActivityLine.activityID++;
}

function removeActivityLine(event) {

  target = event.target
  var cancelId = target.id;  
  var id = cancelId.split(":")[1];
  var activityId = "activity:" + id;
  
  document.getElementById(activityId).remove();
}
