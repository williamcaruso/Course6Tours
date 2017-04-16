$(document).ready(function() {
    
  $('[data-toggle=offcanvas]').click(function() {
    $('.row-offcanvas').toggleClass('active');
  });
  
});

//http://stackoverflow.com/questions/18503634/jquery-to-create-dynamic-textboxes-on-button-click
$("#add_visitor").click(function() {

	var newTextBox = $(document.createElement('input'))
	     .attr("type", 'text')
	     .attr("placeholder", "Visitor Name")
	     .attr("size", "50")

	$("<br>").appendTo("#names");
	newTextBox.appendTo("#names");

})