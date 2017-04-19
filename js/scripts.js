
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


$(document).ready(function() {

    if (typeof(Storage) !== "undefined") {

        var retrievedObject = localStorage.getItem('personal_info_model');
        if (typeof(retrievedObject) == "undefined") {
            localStorage.setItem('personal_info_model', JSON.stringify(personal_info_model));
            console.log("created personal_info_model");
            retrievedObject = localStorage.getItem('personal_info_model');
            console.log('personal_info_model: ', JSON.parse(retrievedObject));
        }
        else {
            console.log('personal_info_model: ', JSON.parse(retrievedObject));
        }

    } else {
        // Sorry! No Web Storage support..
        console.log('we Do NOT have storage!')
    }

    $('[data-toggle=offcanvas]').click(function() {
        $('.row-offcanvas').toggleClass('active');
    });

    const times = ["10am","11am","12pm","1pm","2pm","3pm","4pm"];
    const days = ["Mon 8", "Tues 9", "Wed 10", "Thurs 11", "Fri 12"];
    const reserved = ["td33","td43","td63"];

    const table=document.getElementById("calendar");
    for(var row=0;row<9;row++){
        var thisrow = table.insertRow(row);
        thisrow.id ="row"+row
        if(row > 1){
            for(day=0;day<6;day++){
                slot = thisrow.insertCell(day)
                slot.id = "td"+row+day
                $("#td"+row+day).attr("align","center")
                if(Math.random() < 0.3 && day > 0 && reserved.indexOf("td"+row+day) == -1){
                    $("#td"+row+day).css("background-color","#D3D3D3")
                }
                if(day == 0){
                    document.getElementById('td'+row+'0').innerHTML = times[row-2];
                }
            }
        }
        else{


            if(row==0){
                bar = thisrow.insertCell();
                bar.id = "bar"+row;
                $("#bar"+row).attr("align","center")
                $("#bar"+row).attr("colspan","6")
                document.getElementById('bar0').innerHTML = "< June >";
            }
            if(row==1){
                for(day=0;day<6;day++){
                    slot = thisrow.insertCell(day)
                    slot.id = "td1" + day
                    $("#td1"+day).attr("align","center")
                    if(day > 0){
                        document.getElementById('td1'+day).innerHTML = days[day-1];
                    }

                }
            }
        }

    }

});


const visitorFormGroup = '<div class="form-group row"> <label for="visitor" class="col-2' +
    ' col-form-label">Name:</label> <div class="col-10"> <input class="form-control extraVisitor" type="text"' +
    ' name="visitor" placeholder="Visitor Name"size=50> </div> </div>';


//http://stackoverflow.com/questions/18503634/jquery-to-create-dynamic-textboxes-on-button-click
$("#add_visitor").click(function() {
    $(visitorFormGroup).appendTo("#names");
});

$("#submitPersonalInfo").click(function() {
    var requestorName = $("#name").val();
    var requestorEmail = $("#email").val();
    var additionalVisitors = new Array();
    var visitors = document.getElementsByClassName("extraVisitor");
    for(i=0; i<visitors.length; i++) {
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

        var retrievedObject = localStorage.getItem('personal_info_model');
        console.log('personal_info_model: ', JSON.parse(retrievedObject));

    } else {
        console.log("Unable to store form values.");

    }
});

//Calendar Source
//https://www.w3schools.com/howto/howto_css_calendar.asp


// Drag and Drop


// mouse events arrive here
var oldPosition;
var selectedCandy;
var candyToSwapID;
var selectedElement;

var neighboringCandyIDs = {};

var mouseOffsetX = 0;
var mouseOffsetY = 0;

$(document).on('mousedown', ".num", function(evt)
{
    mouseOffsetX = evt.offsetX;
    mouseOffsetY = evt.offsetY;
    selectedElement = this;
    oldPosition = {top: this.style.top, left: this.style.left};
    document.addEventListener ("mousemove" , mouseMove , false);
});


function mouseMove (ev) {
    selectedElement.style.left=ev.pageX;
    selectedElement.style.top= ev.pageY;
    selectedElement.style.zIndex = 1;
    selectedElement.style.pointerEvents = 'none';
    console.log('moving')
}

$(document).on('mouseup', function(evt) {
    if (selectedElement !== null) {
        $('#'+selectedElement.id).animate({
            left: oldPosition.left,
            top: oldPosition.top
        }, 200);
    }
    document.removeEventListener ("mousemove" , mouseMove , false);
});

$(document).on('mouseup', ".cell", function(evt) {
    candyToSwapID = this.id;

    if (neighboringCandyIDs.up === parseInt(candyToSwapID)) {
        moveCandy('up', selectedCandy);
    } else if (neighboringCandyIDs.down === parseInt(candyToSwapID)) {
        moveCandy('down', selectedCandy);
    } else if (neighboringCandyIDs.left === parseInt(candyToSwapID)) {
        moveCandy('left', selectedCandy);
    } else if (neighboringCandyIDs.right === parseInt(candyToSwapID)) {
        moveCandy('right', selectedCandy);
    } else {
        $('#'+selectedElement.id).animate({
            left: oldPosition.left,
            top: oldPosition.top
        }, 200);
    }
    selectedElement.style.pointerEvents = 'all';
    selectedElement.style.zIndex = 0;
    selectedElement = null;
    document.removeEventListener ("mousemove" , mouseMove , false);
});

