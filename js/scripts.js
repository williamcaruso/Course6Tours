/**
 * Variables
 */
// Holds the data in the form for scheduling a tour
// This object is loaded and retrieved from local storage
var personal_info_model = {
    name: '',
    email: '',
    visitors: [],
    date1: '',
    date2: '',
    date3: '',
    handicap:false,
    prefer_ee:false,
    prefer_cs:false, 
};

// Bootstrap Form Group for adding a visitor
const visitorFormGroup = '<div class="form-group row"> <label for="visitor" class="col-2' +
    ' col-form-label">Name:</label> <div class="col-10"> <input class="form-control extraVisitor" type="text"' +
    ' name="visitor" placeholder="Visitor Name"size=50> </div> </div>';

// Times, days and reserved spots for the calendar
const times = ["10am","11am","12pm","1pm","2pm","3pm","4pm"];
const days = ["Mon 8", "Tues 9", "Wed 10", "Thurs 11", "Fri 12"];
const reserved = ["td33","td43","td63"];


/**
 * Runs when the document loads
 */
$(document).ready(function() {

    /**
     *  Creating a store in Local Storage to store form data over
     *  multiple pages
     */
    // Using Local Storage to save form data over multiple pages
    if (typeof(Storage) !== "undefined") {
        // If local storage exists, retrieve the data object
        var retrievedObject = localStorage.getItem('personal_info_model');
        if (typeof(retrievedObject) === "undefined") {
            // If the object does not exist, create one
            localStorage.setItem('personal_info_model', JSON.stringify(personal_info_model));
        }
    } else {
        // No Local Storage support...
        console.log('we Do NOT have storage!')
    }

    /**
     *  Sidenav Toggle
     */
    // Toggles the Side Menu
    $('[data-toggle=offcanvas]').click(function() {
        $('.row-offcanvas').toggleClass('active');
    });


    /**
     *  Calendar setup with random times marked as not available
     *  https://www.w3schools.com/howto/howto_css_calendar.asp
     */
    const table=document.getElementById("calendar");
    if (table) {
        for(var row=0;row<9;row++){
            var thisrow = table.insertRow(row);
            thisrow.id ="row"+row;
            if(row > 1) {
                for(var day=0;day<6;day++){
                    var slot = thisrow.insertCell(day);
                    slot.id = "td"+row+day;
                    $("#td"+row+day).attr("align","center");
                    $("#td"+row+day).attr("class","slot");
                    $("#td"+row+day).attr("title",'June ' + days[day-1] + ' @ ' + times[row-2]);

                    if(Math.random() < 0.3 && day > 0 && reserved.indexOf("td"+row+day) === -1){
                        $("#td"+row+day).css("background-color","#D3D3D3")
                    } else {
                        $("#td"+row+day).attr("ondrop","drop(event)");
                        $("#td"+row+day).attr("ondragover","allowDrop(event)");
                    }
                    if(day === 0){
                        document.getElementById('td'+row+'0').innerHTML = times[row-2];
                    }
                }
            }
            else{
                if(row === 0){
                    var bar = thisrow.insertCell();
                    bar.id = "bar"+row;
                    $("#bar"+row).attr("align","center");
                    $("#bar"+row).attr("colspan","6");
                    document.getElementById('bar0').innerHTML = "< June >";
                }
                if(row === 1){
                    for(day=0;day<6;day++){
                        slot = thisrow.insertCell(day);
                        slot.id = "td1" + day;
                        $("#td1"+day).attr("align","center");
                        if(day > 0){
                            document.getElementById('td1'+day).innerHTML = days[day-1];
                        }
                    }
                }
            }
        }
    }
});

/**
 * Used to Append more textboxes to a page
 * http://stackoverflow.com/questions/18503634/jquery-to-create-dynamic-textboxes-on-button-click
 */
$("#add_visitor").click(function() {
    $(visitorFormGroup).appendTo("#names");
});

/**
 * Called when the submitPersonalInfo Button is clicked
 * Saves form choices in local storage
 */
$("#submitPersonalInfo").click(function() {
    var requestorName = $("#name").val();
    var requestorEmail = $("#email").val();
    var additionalVisitors = [];
    var visitors = document.getElementsByClassName("extraVisitor");
    for(var i=0; i<visitors.length; i++) {
        additionalVisitors.push(visitors[i].value);
    }
    var handicap = $("#accessible-choice").is(':checked');
    var eePref = $("#ee-choice").is(':checked');
    var csPref = $("#cs-choice").is(':checked');
    if (typeof(Storage) !== "undefined") {
        var dataObject = JSON.parse(localStorage.getItem('personal_info_model'));
        dataObject.name = requestorName;
        dataObject.email = requestorEmail;
        dataObject.visitors = additionalVisitors;
        dataObject.handicap = handicap;
        dataObject.prefer_ee = eePref;
        dataObject.prefer_cs = csPref;
        localStorage.setItem('personal_info_model', JSON.stringify(dataObject));

    } else {
        console.log("Unable to store form values.");
    }
});