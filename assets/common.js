if ((typeof Shopify) === 'undefined') { Shopify = {}; }
if (!Shopify.formatMoney) {
  Shopify.formatMoney = function(cents, format) {
    var value = '',
        placeholderRegex = /\{\{\s*(\w+)\s*\}\}/,
        formatString = (format || this.money_format);

    if (typeof cents == 'string') {
      cents = cents.replace('.','');
    }

    function defaultOption(opt, def) {
      return (typeof opt == 'undefined' ? def : opt);
    }

    function formatWithDelimiters(number, precision, thousands, decimal) {
      precision = defaultOption(precision, 2);
      thousands = defaultOption(thousands, ',');
      decimal   = defaultOption(decimal, '.');

      if (isNaN(number) || number == null) {
        return 0;
      }

      number = (number/100.0).toFixed(precision);

      var parts   = number.split('.'),
          dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
          cents   = parts[1] ? (decimal + parts[1]) : '';

      return dollars + cents;
    }

    switch(formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_comma_separator':
        value = formatWithDelimiters(cents, 2, '.', ',');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, '.', ',');
        break;
    }

    return formatString.replace(placeholderRegex, value);
  };
}
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
	$(document).on('click','.close-customer',function(){
		$("body").removeClass("minicart-open"), $(".wrapper-overlay").hide();
	});
	
	///ask-about-product//
	$('.ask_this_product').click(function(){
		$('body').toggleClass('active_askme');
		$('.askmeMain').toggleClass('slideAskme');
		$('.askmeMain').css({"display": "none"});
		$('.askmeMain.slideAskme').css({"display": "block"});
		
	});
	$('.ask_cross').click(function(){
		$("body").removeClass("active_askme"),$(".askmeMain").removeClass("slideAskme"),$('.askmeMain').css({"display": "none"});
	});
	
	
	///similar-product//
	$('body').on('click','.similar_options',function(){
		$('body').toggleClass('show__similar__products');
		$('.wrapper-overlay').css({"display": "block"});
		$('.results-similarItemContainer').html('').hide();
		$('.sp-loader').show();

		var getID = $(this).attr('data-id'); 
		var getSection = $(this).attr('data-section'); 
		fetch("/recommendations/products?product_id="+getID+"&limit=10&section_id="+getSection)
			.then(response => response.text())
			.then((text) => {
				const html = document.createElement('div');
				html.innerHTML = text;
				const recommendations = html.querySelector('.similarItemContainer');		
				if (recommendations && recommendations.innerHTML.trim().length) {
					document.querySelector('.results-similarItemContainer').innerHTML = recommendations.innerHTML;
					$('.sp-loader').hide();
					$('.results-similarItemContainer').show();
				}
			});
		return false;
		$('.similar-product-section').fadeIn(); 
		setTimeout(function(){ $('.sp-inner').css({'bottom':'0px'});}, 100);
		setTimeout(function(){ $('.sp-loader').hide(); }, 1400);
		setTimeout(function(){      
		  $('.similar-product-section').removeClass('similarSearching');
		  $('.SimilarNoResults').show();
		  $('#SimilarProducts').show(); 
		}, 1800);
	});
	$('.close-customer').click(function(){
		$("body").removeClass("show__similar__products"), 
		$(".wrapper-overlay").hide();
	});
		
	///search-top//
	$('.search-form').click(function(){
		var _class=$(this).data('search-drawer');
		$('body').toggleClass(_class);		
		$('input.form-control.search-input').trigger('click,input,focus');
		$('#recent_search_list').html('');
	});
	$('.HeaderProClose').click(function(){
		$("body").removeClass("addsearch");
		$("body").removeClass("small_search");
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

	// var results = $(".card-wrapper-img").find(".fdsf");
	// if(results.length > 1){
	// 	$(this).prev().addClass('sdfds');
	// }else{
	// 	alert('not there');
	// } 
	
	///WISHLIST-IMG-FILL///
	$('.product__view__option').click(function(){
		if($(this).find('.wishlist-view').hasClass("fill-img")){
			$(this).find('.wishlist-view').removeClass('fill-img');
		} else{
			$(this).find('.wishlist-view').addClass('fill-img');
		}
	});
	
	///product-quantitly-select///
	// $('.dropdown-select').click(function(){
	// 	$(this).find(".quality-select").slideToggle("fast");
	// 	$('.quality-menu').css({"display": "block"});
	// });
	
	///product-size-select///
	$('.dropdown-selected').click(function(){
		$(".productOptionSelectList").slideUp("fast");
		// $(this).find(".size-select").slideToggle("fast");
		$(this).siblings('.productOptionSelectList').css({"display": "block"});
	});

	$(".set > h4").on("click", function() {
		if ($(this).hasClass("active")) {
		  $(this).removeClass("active");
		  $(this).siblings(".content").slideUp(500);
		  $(".set > h4 a i").removeClass("fa-minus").addClass("fa-plus");
		} else {
		  $(".set > h4 a i").removeClass("fa-minus").addClass("fa-plus");
		  $(this).find("i").removeClass("fa-plus").addClass("fa-minus");
		  $(".set > h4").removeClass("active");
		  $(this).addClass("active");
		  $(".content").slideUp(500);
		  $(this).siblings(".content").slideDown(500);
		}
	  });
});

///slide-nav///
$('.back-btn').click(function(){
	$(this).closest('ul').removeClass('show')
})
				$('.toggle.open-menu-drop').click(function(){
                  var $this = $(this);
                  if ($this.next().hasClass('show')) {
                   // setTimeout(function() {
                    //  $this.removeClass('open-menu-drop');
                   // }, 80);
                   $this.next().removeClass('show');
                    //$this.next().slideUp(350);
                  } else {
                  //  setTimeout(function() {
                   //   $this.addClass('open-menu-drop');
                  //  }, 80);
                    $this.parent().parent().find('li .inner').removeClass('show');
                    //$this.parent().parent().find('li .inner').slideUp(350);
                    $this.next().toggleClass('show');
                    //$this.next().slideToggle(350);
                  }
				 
				});
				
				$('.toggle-level').click(function(){
                      var $this = $(this);
                      if ($this.next().hasClass('show')) {
                        //setTimeout(function() {
                         // $this.removeClass('open-menu-drop');
                        //}, 70);
                        $this.next().removeClass('show');
                        //$this.next().slideUp(350);
                      } else {
                       // setTimeout(function() {
                         // $this.addClass('open-menu-drop');
                       // }, 70);
                        $this.parent().parent().find('li .inner').removeClass('show');
                        //$this.parent().parent().find('li .inner').slideUp(350);
                        $this.next().toggleClass('show');
                        //$this.next().slideToggle(350);
                      }
                    });
  

//count timer//

(function () {
	function pad2(number) {
		return (number < 10 ? '0' : '') + number
	 }
	const second = 1000,
		minute = second * 60,
		hour = minute * 60,
		day = hour * 24;

		var eventdate = document.getElementById("eventDate");
		if(eventdate) {
			const myArr = eventdate.value.split("/");
			let _day = myArr[0];
			let _month = myArr[1];
			let _year = myArr[2];
			let _date = _month+" "+_day+","+_year+" 00:00:00";
			countDown = new Date(_date).getTime();
			if(isNaN(countDown)){
				if(Shopify.designMode){
					alert('Incorrect Date or Date Format');
				}
				return false;
			}
			x = setInterval(function() {    

				let now = new Date().getTime(),
				distance = countDown - now;
				if(distance > 0){
					document.getElementsByClassName("announcement-bar")[0].classList.remove('hidden');
					var leftDays = Math.floor(distance / (day));
					if(leftDays > 0){
						document.getElementById("dayHours").textContent= 'Days';
					}
					else{
						document.getElementById("dayHours").textContent = 'Hours';
					}
					document.getElementById("days").innerText = pad2(leftDays),
					document.getElementById("hours").innerText = pad2(Math.floor((distance % (day)) / (hour))),
					document.getElementById("minutes").innerText = pad2(Math.floor((distance % (hour)) / (minute))),
					document.getElementById("seconds").innerText = pad2(Math.floor((distance % (minute)) / second));
				}
				else{
					document.getElementsByClassName("announcement-bar")[0].classList.add('hidden');
					document.getElementsByTagName('body')[0].classList.remove('announcement_open');
					clearInterval(x);
				}
			}, 0)
		}
	productVariants=function() {
		var productOptions = document.getElementsByClassName('productOption');
		if(productOptions){
		var options=[];
		Array.from(productOptions).forEach(function(productOption) {
			productOption.addEventListener("click", ()=>{	
				var _productParent = productOption.closest('.product_content_section');
				setTimeout(function(){
					const fieldsets = Array.from(_productParent.querySelectorAll('.product-loop-variants'));
					options=fieldsets.map((fieldset) => {
						return Array.from(fieldset.querySelectorAll('input')).find((radio) => radio.checked).value;
					});
					var getVariant = variantChange(options,_productParent);
                  	
					if(getVariant != undefined){
                      var image= getVariant.featured_media['preview_image']['src'];
                      image= image.replace("https:", "");                       
						_productParent.querySelectorAll('[name="id"]')[0].value = getVariant.id;
                      	var imageSource = _productParent.querySelectorAll(".owl-thumb-item img[src='"+image+"']")[0];
                      if(imageSource){
                        imageSource.click();
                      }
						if(getVariant.available == true){
							_productParent.querySelectorAll('.Sd_addProduct')[0].removeAttribute("disabled");
							_productParent.querySelectorAll('.Sd_addProduct')[0].innerHTML  = "Add to Cart";
							_productParent.querySelectorAll('.shopify-payment-button')[0].style.display = "block";
						}else{
							_productParent.querySelectorAll('.Sd_addProduct')[0].setAttribute("disabled", true);
							_productParent.querySelectorAll('.Sd_addProduct')[0].innerHTML  = "Sold Out";
							_productParent.querySelectorAll('.shopify-payment-button')[0].style.display = "none";
						}
					}
					else{
						_productParent.querySelectorAll('.Sd_addProduct')[0].setAttribute("disabled", true);
						_productParent.querySelectorAll('.Sd_addProduct')[0].innerHTML  = "Unavailable";
						_productParent.querySelectorAll('.shopify-payment-button')[0].style.display = "none";
					}
				},200)
			})
		});

		}
		function variantChange(options,selector){
		var variantData = JSON.parse(selector.querySelector('[type="application/json"][name="variant-json"]').textContent);
		console.log(variantData);
		return currentVariant = variantData.find((variant) => {
			return !variant.options.map((option, index) => {
				return options[index] === option;
			}).includes(false);
		});
		}
	}
 
 showMultipleOptions = function(){
	var showOptions = document.getElementsByClassName('showOptions');
    if(showOptions){		
      Array.from(showOptions).forEach(function(option) {
        option.addEventListener("click", ()=>{	
           hideOptions();
			var product = option.getAttribute("data-product");
        		document.getElementById(product).style.display="block";
         });
      });
    }
	
	var closeOptions = document.getElementsByClassName('close-product-wrap');
    if(closeOptions){		
      Array.from(closeOptions).forEach(function(option) {
        option.addEventListener("click", ()=>{
			var product = option.getAttribute("data-product");
        		document.getElementById(product).style.display="none";
         });
      });
    }
	
	function hideOptions(){
      var options = document.getElementsByClassName('product-wrap');
		Array.from(options).forEach(function(option) {
          option.style.display="none";
        });
  }
}
	productVariants();
showMultipleOptions();
}());

// $(document).on("click", function(event){
// 	var $trigger = $(".quality-select");
// 	if($trigger !== event.target && !$trigger.has(event.target).length){
// 		$(".quality-menu").slideUp("fast");
// 	}          				
// });

// $('.dropdown-menu li').on('click', function() {
// 	var getValue = $(this).text();
// 	$('.dropdown-select').text(getValue);
// 	$(this).closest('.select__quantity').find('input[name=quantity]').val(getValue);
// 	$('.dropdown-menu').slideUp("fast");
// });
$('.announce_close').click(function(){
	$('.announcement-bar').slideToggle();
	$('body').removeClass('announcement_open');
});
	$('#slider-custom-slider').owlCarousel({
	 center: false,
	 items: 1,
	 loop: false,
	 margin: 0,
	 dots:false,
	 autoplay:{{section.settings.rotate}},
	 nav:{{section.settings.arrows}},
	 slideSpeed: 2000,
	 autoHeight: false,
	 autoHeightClass: 'owl-height',
	 autoPlaySpeed: {{section.settings.rotate_speed | times:1000}},
	 navText : ["<span><img src='{{'carousel-left-arrow.svg' | asset_url}}' alt='left-arrow'></span>","<span><img src='{{'carousel-right-arrow.svg' | asset_url}} alt='right-arrow'></i></span>"]
  });
$(document).on("click", function(event){
	var $trigger = $(".productOptionSelect");
	if($trigger !== event.target && !$trigger.has(event.target).length){
		$(".productOptionSelectList").slideUp("fast");
	}          				
});

$('.dropdown-menu li').on('click', function() {
	var getValue = $(this).text();
	$(this).find('input').prop('checked',true)
	console.log($(this).find('input').val())
// 	$('.dropdown-select').text(getValue);
	$(this).closest('.productOptionSelect').find('.dropdown-selected').text(getValue);
	
// 	$(this).closest('.select__quantity').find('input[name=quantity]').val(getValue);
	$(this).closest('.productOptionSelectList').slideUp("fast");
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

var mouse_is_inside = false;

$(document).ready(function()
{
    $('.search-bar-container,.search-form,#mini__cart,#dropdown-customer,.newsletter-popup-inner,#similar__product,.side-menu').hover(function(){ 
        mouse_is_inside=true; 
    }, function(){ 
        mouse_is_inside=false; 
    });
	
    $("body").mouseup(function(){ 
        if(! mouse_is_inside) {
			$('body').removeClass('nav-open').removeClass('addsearch').removeClass('small_search').removeClass('minicart-open').removeClass('customer-open').removeClass('NewsletterActive').removeClass('show__similar__products');
			$('.newsletter-popup,.wrapper-overlay').hide();
		}
    });
});

$(document).on('click', '.quickView', function(evt) {
    evt.preventDefault();
	var _url = $(this).data('href');
	$('.Quick_loader').hide();
	$.ajax({
		url:_url+'?view=quick-view',
		type:'GET',
		success: function(data){
			$('#ProductQuickView').html(data);
			$('.Quick_loader').hide();
			$('#ProductQuickView,#qucikview').show();
			productVariants();
		}
	 });
});
$(document).on('click', '.quickViewClose',function(evt) {
    evt.preventDefault();
	$('#qucikview').hide();
})
