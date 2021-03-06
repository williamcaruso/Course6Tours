/**
 * Variables
 */
// Holds the data in the form for scheduling a tour
// This object is loaded and retrieved from local storage

const dataVersion = "0.3";
var personal_info_model = {
    name: '',
    email: '',
    visitors: [],
    dates: [],
    date1_id: '',
    date2_id: '',
    date3_id: '',
    handicap:false,
    prefer_ee:false,
    prefer_cs:false, 
    version: dataVersion,
    visited_page_1: false,
    visited_page_2: false,
    visited_page_3: false,
    visited_page_4: false,
};

// Bootstrap Form Group for adding a visitor
var extraVisitorCount = 0;

// Times, days and reserved spots for the calendar
const times = ["10am","11am","12pm","1pm","2pm","3pm","4pm"];
const weekdays = ["Mon", "Tues", "Wed", "Thurs", "Fri"];
var reserved = ["td33","td43","td63"];
const today = new Date();
var calendarLoadDate = new Date();
const oneDay = 24*60*60*1000;

/**
 * Runs when the document loads
 */
$(document).ready(function() {

    /**
     *  Creating a store in Local Storage to store form data over
     *  multiple pages
     */
    // If local storage exists, retrieve the data object
    var retrievedObject = localStorage.getItem('personal_info_model');
    if (typeof(retrievedObject) === "undefined" || retrievedObject === null) {
        // If the object does not exist, create one
        localStorage.setItem('personal_info_model', JSON.stringify(personal_info_model));
    }
    // if data model is old, create a new one
    if(!JSON.parse(retrievedObject).hasOwnProperty("version")){
        console.log("Reseting object without version");
        localStorage.setItem('personal_info_model', JSON.stringify(personal_info_model));
    } else if(JSON.parse(retrievedObject).version != dataVersion) {
        console.log("Reseting object with old version");
        localStorage.setItem('personal_info_model', JSON.stringify(personal_info_model));
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
    const table = document.getElementById("calendar");
    if (table) {

        var dataObject = JSON.parse(localStorage.getItem("personal_info_model"));
        reserved=[];

        for(var row=0;row<9;row++){
            var thisrow = table.insertRow(row);
            thisrow.id ="row"+row;
            
            // Individual Time Slots
            if(row > 1) {
                for(var day=0;day<6;day++){
                    // create table cell
                    var slot = thisrow.insertCell(day);
                    slot.id = "td"+row+day;
                    $("#td"+row+day).attr("align","center");
                    $("#td"+row+day).attr("class","slot");

                    if((Math.random() < 0.25 && day > 0) || reserved.indexOf("td"+row+day) != -1){
                        $("#td"+row+day).attr("class","unav-day");
                    } else {
                        $("#td"+row+day).attr("ondrop","drop(event)");
                        $("#td"+row+day).attr("ondragover","allowDrop(event)");
                        if(day > 0) {
                            $("#td"+row+day).attr("onclick","toggleAvailability(event)");
                        }
                    }
                    // Times
                    if(day === 0){
                        document.getElementById('td'+row+'0').innerHTML = times[row-2];
                    }
                }
            }
            else{
                // Month and arrow Buttons
                if(row === 0){
                    var lastWkBtnCell = thisrow.insertCell();
                    lastWkBtnCell.id = "lastWkBtnCell";

                    var bar = thisrow.insertCell();
                    bar.id = "bar"+row;
                    $("#bar"+row).attr("align","center");
                    $("#bar"+row).attr("colspan","4");

                    var nextWkBtnCell = thisrow.insertCell();
                    nextWkBtnCell.id = "nextWkBtnCell";

                    $("#lastWkBtnCell").attr("onclick", "lastWeek()");
                    $("#lastWkBtnCell").attr("align", "center");
                    $("#nextWkBtnCell").attr("onclick", "nextWeek()");
                    $("#nextWkBtnCell").attr("align", "center");

                    var leftArrow = document.createElement('img');
                    leftArrow.src = 'graphics/Advance-50.png';
                    document.getElementById("lastWkBtnCell").appendChild(leftArrow);
                    document.getElementById("lastWkBtnCell").className+= 'rotateimg180';
                    $('#lastWkBtnCell').css("cursor", "pointer");

                    var rtArrow = document.createElement('img');
                    rtArrow.src = 'graphics/Advance-50.png';
                    document.getElementById("nextWkBtnCell").appendChild(rtArrow);
                    $('#nextWkBtnCell').css("cursor", "pointer");

                }
                // Day Tags (ex. Mon 😎
                if(row === 1){
                    for(day=0;day<6;day++){
                        slot = thisrow.insertCell(day);
                        slot.id = "td1" + day;
                        $("#td1"+day).attr("align","center");
                    }
                }
                
            }
        }
        // Fill up calendar for todays week.
        loadCalendar(today);
        updateChoices();
    }
});

const DATE_KEY = 'cell-date-object';

function loadCalendar(day) {
    var retrievedObject = JSON.parse(localStorage.getItem('personal_info_model'));
    var monday = new Date(day.getTime() + (1 - day.getDay())*oneDay);
    var daysThisWeek = []

    // Set Month String
    var monthString = getMonthString(monday.getMonth()) + " " + monday.getFullYear();
    document.getElementById('bar0').innerHTML = monthString;
    
    // Set WeekDays
    for(var day = 1; day<6; day++) {
        var thisDay = new Date(monday.getTime() + (day-1)*oneDay);
        var dd = thisDay.getDate();
        var mm = thisDay.getMonth();
        var month = getMonthString(mm);
        daysThisWeek.push([month, dd, mm]);
        var weekdayString = weekdays[day-1] + " " + dd;
        document.getElementById('td1'+day).innerHTML = weekdayString;

        var isBeforeToday = (thisDay.getTime()+1000 < today.getTime());

        // Fill in cells
        for(var row = 2; row < 9; row++) {
            // black out some random days.
            var unav = isBeforeToday || (Math.random() < 0.1);
            
            // bind data to DOM object
            var dayKey = dd;
            if(dd < 10) {
                dayKey = "0" + dd;
            }
            var k = mm +""+ dayKey +""+ (row-2);
            var dateObj = {
                'month' : month,
                'day'   : dd,
                'time'  : times[row-2],
                'sort-key' : k
            };
            //dateObj['time'] = times[row-2];
            $("#td"+row+day).data(DATE_KEY, dateObj);

            // Set Attributes for different cell types
            if(containsByKey(retrievedObject.dates, 'sort-key', k)) {
                // cell has already been selected, according to saved data
                $("#td"+row+day).attr("class", "slot selected-day");
                $("#td"+row+day).data("meta-selected",true);
                $("#td"+row+day).data("available",true);
            }
            else if(unav) {
                // Cell is unavailable
                $("#td"+row+day).attr("class", "unav-day");
                $("#td"+row+day).attr("onclick", "");
                $("#td"+row+day).data("meta-selected",false);
                $("#td"+row+day).data("available",false);
            } 
            else { 
                // Normal unselected, available cell
                $("#td"+row+day).attr("class", "slot");
                $("#td"+row+day).attr("onclick","toggleAvailability(event)");
                $("#td"+row+day).data("meta-selected",false);
                $("#td"+row+day).data("available",true);
            }

            $("#td"+row+day).attr("onmouseenter", "cellMouseEnter(event)");
            $("#td"+row+day).attr("onmouseleave", "cellMouseExit(event)");
            $("#td"+row+day).attr("onclick","toggleAvailability(event)");
         }
    }
}

/*
TODO:
    make date switching arrows work
*/

function nextWeek() {
    calendarLoadDate = new Date(calendarLoadDate.getTime() + 7*oneDay);
    loadCalendar(calendarLoadDate);
}

function lastWeek() {
    newDate = new Date(calendarLoadDate.getTime() - 7*oneDay);
    if(newDate < today) {
        return;
    }
    calendarLoadDate = newDate;
    loadCalendar(calendarLoadDate);
}

function getMonthString(mm) {
    switch(mm) {
        case 0:
            return "January"
            break;
        case 1:
            return "February"
            break;
        case 2:
            return "March"
            break;
        case 3:
            return "April"
            break;
        case 4:
            return "May"
            break;
        case 5:
            return "June"
            break;
        case 6:
            return "July"
            break;
        case 7:
            return "August"
            break;
        case 8:
            return "September"
            break;
        case 9:
            return "October"
            break;
        case 10:
            return "November"
            break;
        case 11:
        default:
            return "December"
            break;
    }
}

function addSlotToDataObject(slot) {
    var dataObject = JSON.parse(localStorage.getItem("personal_info_model"));
    var doDays = dataObject.dates;
    doDays.push(slot);
    dates = sortByKey(doDays, 'sort-key');
    dataObject.dates = dates;
    localStorage.setItem('personal_info_model', JSON.stringify(dataObject));
    updateChoices();
}

function removeSlotFromDataObject(slot) {
    var dataObject = JSON.parse(localStorage.getItem("personal_info_model"));
    var doDays = dataObject.dates;
    dates = removeByKeyId(doDays, 'sort-key', slot['sort-key']);
    if(!dates) {
        dates = [];
    }
    dataObject.dates = dates;
    localStorage.setItem('personal_info_model', JSON.stringify(dataObject));
    updateChoices();
}

function toggleAvailability(event) {
    var dataObj = JSON.parse(localStorage.getItem("personal_info_model"));
    var cell = $("#"+event.target.id);
    //var selected = cell.attributes["meta-selected"].value;
    var selected = cell.data("meta-selected");
    var available = cell.data("available");
    if(!available) {
        return;
    }
    if(!selected) {
        if(dataObj.dates.length >= 3) {
          return;
        }
        cell.data("meta-selected", true);
        cell.attr("class", "slot selected-day");
        addSlotToDataObject(cell.data(DATE_KEY));
    } else {
        cell.data("meta-selected", false);
        cell.attr("class", "slot");
        removeSlotFromDataObject(cell.data(DATE_KEY));
    }
}

function cellMouseEnter(event) {
    var dataObj = JSON.parse(localStorage.getItem("personal_info_model"));
    var cell = $("#"+event.target.id);
    var selected = cell.data("meta-selected");
    var available = cell.data("available");
    if(!selected && dataObj.dates.length < 3 && available) {
        cell.attr("class", "slot hover-day");
    }
}

function cellMouseExit(event) {
    var cell = $("#"+event.target.id);
    var selected = cell.data("meta-selected");
    var available = cell.data("available");
    if(!selected && available) {
        cell.attr("class", "slot");
    }
}

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

// Assumes unique keys
function removeByKeyId(array, key, id) {
    for(var i = 0; i<array.length; i++) {
        if(array[i][key] == id) {
            array.splice(i, 1);
            return array;
        }
    }
}

function containsByKey(array, key, id) {
    for(var i = 0; i<array.length; i++) {
        if(array[i][key] == id) {
            return true;
        }
    }
    return false;
}

function updateChoices() {
    var dataObj = JSON.parse(localStorage.getItem("personal_info_model"));
    
    var labels = [$("#date1"), $("#date2"), $("#date3")];
    var dates = dataObj.dates;
    var i = 0;
    for(i = 0; i<dates.length; i++) {
        var labelString = "" + dates[i].month + " " + dates[i].day + " @ " + dates[i].time;
        labels[i].text(labelString);
    }
    while(i < 3) {
        labels[i].text("");
        i++;
    }
}

/**
 * Used to Append more textboxes to a page
 * http://stackoverflow.com/questions/18503634/jquery-to-create-dynamic-textboxes-on-button-click
 */
$("#add_visitor").click(function() {
    var visitorFormGroup = '<div id=' + extraVisitorCount + ' class="form-group row"> <label for="visitor" class="col-2' +
    ' col-form-label">Name:</label> <div class="col-10"> <input class="form-control extraVisitor" type="text" ' +
    ' name="visitor" placeholder="e.g. Alyssa Hacker"> <button name="remove" class="btn btn-primary" id="remove' + extraVisitorCount + '"" type="button"  style="float:right; margin-top:-39px; margin-right:-110px"> Remove </button> </div> </div>';
    $(visitorFormGroup).appendTo("#names");
    extraVisitorCount += 1;
});



/**
    Used to remove textboxes for extra visitors
*/

$("#names").on('click', "button[name='remove']", function () {
    //remove the input from the UI
    button_id = this.id;
    div_id = button_id.substring(6); //strip off the remove prefix at the beginning
    $('#'+div_id).remove();
    //remove the visitor from the model
    var dataObject = JSON.parse(localStorage.getItem("personal_info_model"));
    var visitors = document.getElementsByClassName("extraVisitor");
    dataObject.visitors[div_id] = "removed"
    localStorage.setItem('personal_info_model', JSON.stringify(dataObject));
})


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
        dataObject.visited_page_1 = true;
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