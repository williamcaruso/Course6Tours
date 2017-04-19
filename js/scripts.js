
var personal_info_model = {
    name: '',
    email: '',
    visitors: [],
    date1: '',
    date2: '',
    date3: '',
    handicap:false,
    prefer_ee:false,
    prefer_cs:false
};


$(document).ready(function() {

    if (typeof(Storage) !== "undefined") {

        var retrievedObject = localStorage.getItem('personal_info_model');
        if (typeof(retrievedObject) !== "undefined") {
            localStorage.setItem('personal_info_model', JSON.stringify(personal_info_model));
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
    const days = ["Mon 8", "Tues 9", "Wednes 10", "Thurs 11", "Fri 12"];
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
    ' col-form-label">Name:</label> <div class="col-10"> <input class="form-control" id="visitor" type="text"' +
    ' name="visitor" placeholder="Visitor Name"size=50> </div> </div>';


//http://stackoverflow.com/questions/18503634/jquery-to-create-dynamic-textboxes-on-button-click
$("#add_visitor").click(function() {

    var newTextBox = $(document.createElement('input'))
        .attr("type", 'text')
        .attr("placeholder", "Visitor Name")
        .attr("size", "50")
        .attr("class","form-control")

    $(visitorFormGroup).appendTo("#names");

})

//Calendar Source
//https://www.w3schools.com/howto/howto_css_calendar.asp