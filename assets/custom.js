function toggleDropdown(id) {
	var x = document.getElementById(id);
	if (x.style.display === "none") {
	  x.style.display = "block";
	} else {
	  x.style.display = "none";
	}
  }
$(document).on("click", function(event){
  var $trigger = $(".currency-dropdown");
  if($trigger !== event.target && !$trigger.has(event.target).length){
    $(".currency-menu").slideUp("fast");
  }          				
});
///search-top//
$('.search-form').click(function(){
	$('body').toggleClass('addsearch');
});
$('.HeaderProClose').click(function(){
	$("body").removeClass("addsearch");
});
