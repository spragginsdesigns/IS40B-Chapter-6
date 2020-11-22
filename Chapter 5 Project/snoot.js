"use strict"; // interpret document contents in JS Strict mode

/* Global Variables */ 
var twentyNine = document.createDocumentFragment(); 
var thirty = document.createDocumentFragment(); 
var thirtyOne = document.createDocumentFragment(); 
// variable to hold whether or not we should submit
var formValidity = true; 
/* set up node building blocks for selection list of days */ 
function setupDays() {
    var dates = document.getElementById("delivDy").
    getElementsByTagName("option"); 
    twentyNine.appendChild(dates[28].cloneNode(true));
    // add 29th
    thirty.appendChild(dates[28].cloneNode(true));
    thirty.appendChild(dates[29].cloneNode(true)); 
    // add 29th & 30th
    thirtyOne.appendChild(dates[28].cloneNode(true)); 
    thirtyOne.appendChild(dates[29].cloneNode(true));
    thirtyOne.appendChild(dates[30].cloneNode(true));
    // add 29th, 20th and 31st
}
function updateDays() {
    var deliveryDay = document.getElementById("delivDy");
    var dates = deliveryDay.getElementsByTagName("option");
    var deliveryMonth = document.getElementById("delivMo");
    var deliveryYear = document.getElementById("delivYr");
    var selectedMonth = deliveryMonth.options[deliveryMonth.selectedIndex].value; 
    while (dates[28]) {
        // remove child with index of 28 until this index is empty
        deliveryDay.removeChild(dates[28]);
    }
    if (deliveryYear.selectedIndex === -1) {
        // if no year is selected, choose the default year so length of Feb can be determined. 
        deliveryYear.selectedIndex = 0;
    }
    if (selectedMonth === "2" && deliveryYear.options[deliveryYear.selectedIndex].value === "2018") {
        deliveryDay.appendChild(twentyNine.cloneNode(true));
    } else if (selectedMonth === "4" || selectedMonth === "6" || selectedMonth === "9" || selectedMonth === "11") {
            deliveryDay.appendChild(thirty.cloneNode(true));
        } else if (selectedMonth === "1" || selectedMonth === "3" || selectedMonth === "5" || selectedMonth === "7" 
                || selectedMonth === "8" || selectedMonth === "10" || selectedMonth === "12") {
                deliveryDay.appendChild(thirtyOne.cloneNode(true)); 
    }
}
/* remove default values and formatting from state and delivery date selection lists */ 
function removeSelectDefaults() {
    var emptyBoxes = document.getElementsByTagName("select"); 
    for (var i = 0; i < emptyBoxes.length; i++) {
        emptyBoxes[i].selectedIndex = -1; 
    }
}

/* copies values for Billing Address fields to Delivery Address Fields */ 
function copyBillingAddress() {
    var billingInputElements = document.querySelectorAll("#billingAddress input"); 
    var deliveryInputElements = document.querySelectorAll("#deliveryAddress input"); 
    if (document.getElementById("sameAddr").checked) {
        // Note the i + 1 in delivery since the first input in delivery is not a text type
        // but a checkbox type
        for (var i = 0; i < billingInputElements.length; i++) {
            deliveryInputElements[i + 1].value = billingInputElements[i].value;
        }
        document.querySelector("#deliveryAddress select").value = document.querySelector("#billingAddress select").value;
    } // otherwise clear all of the delivery items out
    else {
        for (var i = 0; i < billingInputElements.length; i++) {
            deliveryInputElements[i + 1].value = "";
        }
        document.querySelector("#deliveryAddress select").selectedIndex = -1;
    }
}
/* auto check Custom Message check box if user maskes entry in customText box */
function autocheckCustom() {
    var messageBox = document.getElementById("customText");
    if (messageBox.value !== "" && messageBox.value !== messageBox.placeholder) {
        // if user entry in textarea, check Custom check box
        document.getElementById("custom").checked = "checked";
    }
}

/* remove fallback placeholder text */ 
// sets the correct font style for the user and clears out the default message if still there
// note this only happens when the placeholder attribute is not supported. See "generatePlaceHolder" first
function zeroPlaceHolder() {
    var messageBox = document.getElementById("customText");
    messageBox.style.color = "black";
    if (messageBox.value === messageBox.placeholder) {
        messageBox.value = ""; 
    }
}
/* Restore placeholder text if box contains no user entry */
// change back the font style and place the default message back in
// Only used when placeholder is not supported see "generatePlaceholder" First
function checkPlaceHolder() {
    var messageBox = document.getElementById("customText"); 
    if (messageBox.value === "") {
        messageBox.style.color = "rgb(178,184,183)";
        messageBox.value = messageBox.placeholder;
    }
}

function generatePlaceHolder() {
    if (!Modernizr.input.placeholder) {
        var messageBox = document.getElementById("customText");
        messageBox.value = messageBox.placeholder;
        messageBox.style.color = "rgb(178,184,183)";
}
}
/* create event listeners */
function createEventListeners() {
    // Take care of the days automatically when the user changes a month
    var deliveryMonth = document.getElementById("delivMo"); 
    if (deliveryMonth.addEventListener) {
        deliveryMonth.addEventListener("change", updateDays, false); 
    } else if (deliveryMonth.attachEvent) {
        deliveryMonth.attachEvent("onchange", updateDays); 
    }
    // take care of leap year with the days when a user changes the year
        var deliveryYear = document.getElementById("delivYr"); 
        if (deliveryYear.addEventListener) {
            deliveryYear.addEventListener("change", updateDays, false);
        } else if (deliveryYear.attachEvent) {
            deliveryYear.attachEvent("onchange", updateDays); 
        }
        // Take care of duplicating the info in the fields if the address are the same
        var same = document.getElementById("sameAddr");
        if (same.addEventListener) {
            same.addEventListener("click", copyBillingAddress, false); 
        } else if (same.attachEvent) {
            same.attachEvent("onclick", copyBillingAddress);
        }
        // Take care of checking the box for custom text if the text is entered
        var messageBox = document.getElementById("customText");
        if (messageBox.addEventListener) {
            messageBox.addEventListener("blur", autocheckCustom, false);
        } else if (messageBox.attachEvent) {
            messageBox.attachEvent("onblur", autocheckCustom); 
        }
        // Take care of the user trying to submit the form
        var form = document.getElementsByTagName("form") [0];
        if (form.addEventListener) {
            form.addEventListener("submit", validateForm, false); 
        } else if (form.attachEvent) {
            form.attachEvent("onsubmit", validateForm);
        }
}
/* run initial form config functions */ 
function setUpPage() {
    removeSelectDefaults();
    setupDays(); 
    createEventListeners(); 
    generatePlaceHolder();
}
/* run setup function when page finishes loading */
if (window.addEventListener) {
    window.addEventListener("load", setUpPage, false); 
} else if (window.attachEvent) {
    window.attachEvent("onload", setUpPage);
}
