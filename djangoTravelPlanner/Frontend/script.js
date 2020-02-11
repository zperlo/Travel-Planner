let d = new Date();
//alert("Today's date is " + d);

function displayCity() {
    alert("City: " + document.getElementById("where").value);
}

// Cannot disable the entire form all at once
function disableForm() {
    document.getElementById("where").disabled = true;
    document.getElementById("date").disabled = true;
    document.getElementById("start").disabled = true;
    document.getElementById("end").disabled = true;
}