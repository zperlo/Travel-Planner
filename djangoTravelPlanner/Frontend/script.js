/*class row {
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
    for (element of this.elements) {
      element.parentNode.removeChild(element);
    }
  }
}*/

var activityLines = []

function addNewActivityLine() {

    // console.log("+ button clicked");

    if (typeof addNewActivityLine.activityID == 'undefined') {
        addNewActivityLine.activityID = 1;
    }

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

    // activityLines[addNewActivityLine.activityID] = (new row(div, addNewActivityLine.activityID));

    addNewActivityLine.activityID++;
}

$(document).ready(function() {
    $("#add").click(function() {
    		var lastField = $("#buildyourform div:last");
        var intId = (lastField && lastField.length && lastField.data("idx") + 1) || 1;
        var fieldWrapper = $("<div class=\"fieldwrapper\" id=\"field" + intId + "\"/>");
        fieldWrapper.data("idx", intId);
        var fName = $("<input type=\"text\" class=\"fieldname\" />");
        var fType = $("<select class=\"fieldtype\"><option value=\"checkbox\">Checked</option><option value=\"textbox\">Text</option><option value=\"textarea\">Paragraph</option></select>");
        var removeButton = $("<input type=\"button\" class=\"remove\" value=\"-\" />");
        removeButton.click(function() {
            $(this).parent().remove();
        });
        fieldWrapper.append(fName);
        fieldWrapper.append(fType);
        fieldWrapper.append(removeButton);
        $("#buildyourform").append(fieldWrapper);
    });
  });
