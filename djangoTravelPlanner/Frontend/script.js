//let d = new Date();
//alert("Today's date is " + d);

function displayCity() {
    alert("City: " + document.getElementById("where").value);
}

class row {
  elements = [];
  id = -1;

  constructor(div, id) {
    this.id = id;

    var button = document.createElement("input");
    button.type = "button";
    button.value = "x";
    button.id = "cancel" + id;
    div.appendChild(button);
    this.elements.push(button);

    var textfield = document.createElement("input");
    textfield.type = "text";
    textfield.id = "activity" + id;
    div.appendChild(textfield);
    this.elements.push(textfield);

    var linebreak = document.createElement("br");
    div.appendChild(linebreak);
    this.elements.push(linebreak);

    button.addEventListener("click", this.delete);

    console.log("adding new line with id " + id);
  }

  delete(elementArray) {
    this.elements.forEach(element => element.parentNode.removeChild(element));
    /*for (element of this.elements) {
      element.parentNode.removeChild(element);
    }*/
  }
}

var activityLines = []

function addNewActivityLine() {

    if (typeof addNewActivityLine.activityID == 'undefined') {
        addNewActivityLine.activityID = 1;
    }

    var div = document.getElementById("newActivity");

    /*var cancel = document.createElement("input");
    cancel.type = "button";
    cancel.value = "x";
    cancel.id = "cancel" + addNewActivityLine.activityID;
    div.appendChild(cancel);*/

    /*var input = document.createElement("input");
    input.type = "text";
    input.id = "activity" + addNewActivityLine.activityID;
    div.appendChild(input);*/

    /*div.appendChild(document.createElement("br"));*/

    activityLines[addNewActivityLine.activityID] = (new row(div, addNewActivityLine.activityID));

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
