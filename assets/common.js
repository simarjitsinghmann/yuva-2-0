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
///Sticky-header//
$(window).scroll(function () {
	if($(window).scrollTop()>150){
	   $("header-sticky.top-header").addClass("sticky-header");
	   $("#shopify-section-header").addClass("sticky-header");
	}else {
	  $("header-sticky.top-header").removeClass("sticky-header");
	  $("#shopify-section-header").removeClass("sticky-header");
	}
});
$(document).ready(function(){
	$('.navbar-toggler').click(function(){
	$('.navbar-collapse').toggleClass('show');
	});
	$('.nav-button').click(function(){
	$('body').toggleClass('nav-open');
	});
	
	///navigation-sidebar//
	$('.navbar-toggler').click(function(){
	$('.navbar-collapse').toggleClass('show');
	$('body').toggleClass('nav-open');
	$('.wrapper-overlay').css({"display": "block"});
	});
	
	$('.close-btn').click(function(){
	$('body').toggleClass('nav-open'), $('.navbar-collapse').removeClass('show');
	$('.wrapper-overlay').hide();
	});
	
	
	///account-sidebar//
	$('.acc-sign-in').click(function(){
	$('body').toggleClass('customer-open');
	$('.wrapper-overlay').css({"display": "block"});
	});
	$('.close-customer').click(function(){
	$("body").removeClass("customer-open"), $(".wrapper-overlay").hide();
	});
	
	///minicart//
	$('.cart-icon').click(function(){
	$('body').toggleClass('minicart-open');
	$('.wrapper-overlay').css({"display": "block"});
	});
	$('.close-customer').click(function(){
	$("body").removeClass("minicart-open"), $(".wrapper-overlay").hide();
	});
	
	///similar-product//
	$('.similar_options').click(function(){
	$('body').toggleClass('show__similar__products');
	$('.wrapper-overlay').css({"display": "block"});
	});
	$('.close-customer').click(function(){
	$("body").removeClass("show__similar__products"), $(".wrapper-overlay").hide();
	});
		
	///search-top//
	$('.search-form').click(function(){
	$('body').toggleClass('addsearch');
	});
	$('.HeaderProClose').click(function(){
	$("body").removeClass("addsearch");
	});
	
	
	//product-grid//
	$('.grid-layout').click(function(){
	$('.product-collection').addClass('grid-view');
	$('.product-collection').removeClass('list-view');
	$('.products-grid').css({"display": "block"});
	$('.products-list').css({"display": "none"});
	});
	$('.list-layout').click(function(){
	$('.product-collection').removeClass('grid-view');
	$('.product-collection').addClass('list-view');
	$('.products-list').css({"display": "block"});
	$('.products-grid').css({"display": "none"});
	});
	
	//currency-dropdown//
	$('.currency-dropdown').click(function(){
	$(this).find(".currency-menu").slideToggle("fast");
	$('.currency-menu').css({"display": "block"});
	});
	
	///WISHLIST-IMG-FILL///
	$('.product__view__option').click(function(){
		if($(this).find('.wishlist-view').hasClass("fill-img")){
			$(this).find('.wishlist-view').removeClass('fill-img');
		} else{
			$(this).find('.wishlist-view').addClass('fill-img');
		}
	});
	
	///product-quantitly-select///
	$('.dropdown-select').click(function(){
	$(this).find(".quality-select").slideToggle("fast");
	$('.quality-menu').css({"display": "block"});
	});
	

	$(".set > h4").on("click", function() {
		if ($(this).hasClass("active")) {
		  $(this).removeClass("active");
		  $(this)
			.siblings(".content")
			.slideUp(500);
		  $(".set > h4 a i")
			.removeClass("fa-minus")
			.addClass("fa-plus");
		} else {
		  $(".set > h4 a i")
			.removeClass("fa-minus")
			.addClass("fa-plus");
		  $(this)
			.find("i")
			.removeClass("fa-plus")
			.addClass("fa-minus");
		  $(".set > h4").removeClass("active");
		  $(this).addClass("active");
		  $(".content").slideUp(500);
		  $(this)
			.siblings(".content")
			.slideDown(500);
		}
	  });
});

$(document).on("click", function(event){
	var $trigger = $(".quality-select");
	if($trigger !== event.target && !$trigger.has(event.target).length){
	$(".quality-menu").slideUp("fast");
	}          				
});

$('.dropdown-menu li').on('click', function() {
	var getValue = $(this).text();
	$('.dropdown-select').text(getValue);
});

///quantitly-custom//		
jQuery('.quantity').each(function() {
var spinner = jQuery(this),
input = spinner.find('input[type="number"]'),
btnUp = spinner.find('.quantity-up'),
btnDown = spinner.find('.quantity-down'),
min = input.attr('min'),
max = input.attr('max');

btnUp.click(function() {
var oldValue = parseFloat(input.val());
if (oldValue >= max) {
var newVal = oldValue;
} else {
var newVal = oldValue + 1;
}
spinner.find("input").val(newVal);
spinner.find("input").trigger("change");
});

btnDown.click(function() {
var oldValue = parseFloat(input.val());
if (oldValue <= min) {
var newVal = oldValue;
} else {
var newVal = oldValue - 1;
}
spinner.find("input").val(newVal);
spinner.find("input").trigger("change");
});

});