let d = new Date();
alert("Today's date is " + d);

function displayCity() {
    alert("City: " + document.getElementById("where").value);
}

function addNewActivityLine() {

    if (typeof addNewActivityLine.activityID == 'undefined') {
        addNewActivityLine.activityID = 1;
    }

    console.log("adding new line");

    var div = document.getElementById("newActivity");

    var cancel = document.createElement("input");
    cancel.type = "button";
    cancel.value = "x";
    cancel.id = "cancel" + addNewActivityLine.activityID;
    div.appendChild(cancel);

    var input = document.createElement("input");
    input.type = "text";
    input.id = "activity" + addNewActivityLine.activityID;
    div.appendChild(input);

    div.appendChild(document.createElement("br"));

    addNewActivityLine.activityID++;
}
/*
// Cannot disable the entire form all at once
function disableForm() {

    string location = document.getElementById("where").value;

    alert("City: " + document.getElementById("where").value +
        "\nDate: " + document.getElementById("date").value +
        "\nStart Time: " + document.getElementById("start").value +
        "\nEnd Time: " + document.getElementById("end").value
    );

    document.getElementById("where").disabled = true;
    document.getElementById("date").disabled = true;
    document.getElementById("start").disabled = true;
    document.getElementById("end").disabled = true;
}
*/