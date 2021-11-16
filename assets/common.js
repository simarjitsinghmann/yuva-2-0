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
$(document).on("click", function(event){
  var $trigger = $(".toolbox-sort");
  if($trigger !== event.target && !$trigger.has(event.target).length){
    $("#sort__list").slideUp("fast");
  }          				
});

$(document).ready(function(){
//   $('.navbar-toggler').click(function(){
//     $('.navbar-collapse').toggleClass('show');
//   });
  $('.nav-button').click(function(){
    $('body').toggleClass('nav-open');
  });

  ///navigation-sidebar//
  $('.navbar-toggler').click(function(){
    $('.navbar-collapse-sidebar').toggleClass('show');
    $('body').toggleClass('nav-open');
    // 	$('.wrapper-overlay').css({"display": "block"});
  });
	
	$('.close-btn').click(function(){
		$('body').toggleClass('nav-open'), $('.navbar-collapse-sidebar').removeClass('show');
// 		$('.wrapper-overlay').hide();
	});
	
	
	///account-sidebar//
// 	$('.acc-sign-in').click(function(){
// 		$('body').toggleClass('customer-open');
// 		$('.wrapper-overlay').css({"display": "block"});
// 	});
// 	$('.close-customer').click(function(){
// 		$("body").removeClass("customer-open"), $(".wrapper-overlay").hide();
// 	});
	
	///minicart//
	$('.openCartDrawer').click(function(e){
      e.preventDefault();
		$('body').toggleClass('minicart-open');
		$('.wrapper-overlay').css({"display": "block"});
	});
	$(document).on('click','.close-cart-drawer',function(){
		$("body").removeClass("minicart-open"), $(".wrapper-overlay").hide();
	});
	
	///ask-about-product//
	$('.ask_this_product').click(function(){
		$('body').toggleClass('active_askme');
		$('body').addClass('scrollHidden');
		$('.askmeMain').toggleClass('slideAskme');
		$('.askmeMain').css({"display": "none"});
		$('.askmeMain.slideAskme').css({"display": "block"});
		
	});
	$('.ask_cross').click(function(){
		$("body").removeClass('scrollHidden').removeClass("active_askme"),$(".askmeMain").removeClass("slideAskme"),$('.askmeMain').css({"display": "none"});
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
	
	
	//currency-dropdown//
	$('.currency-dropdown').click(function(){
		$(this).find(".currency-menu").slideToggle("fast");
		$('.currency-menu').css({"display": "block"});
	});
  $('body').on('click','.toolbox-sort',function(){
		$(this).find("#sort__list").slideToggle("fast");
		$('#sort__list').css({"display": "block"});
	});

		
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
$('.toggle.open-menu-drop,.toggle-level').click(function(){
  var $this = $(this);
  if ($this.next().hasClass('show')) {
    $this.next().removeClass('show');
  } else {
    $this.parent().parent().find('li .inner').removeClass('show');
    $this.next().toggleClass('show');
  }

});


//count timer//

(function () {
  
//   Variant Change
  
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

          var paymentButtonWrapper = _productParent.querySelectorAll('.Sd_addProduct')[0]
          var paymentButton = _productParent.querySelectorAll('.Sd_addProduct span')[0]
          if(getVariant != undefined){
            if(getVariant.featured_media != null){
              var image= getVariant.featured_media['preview_image']['src'];
              image= image.replace("https:", "");                       
              _productParent.querySelectorAll('[name="id"]')[0].value = getVariant.id;
              var imageSource = _productParent.querySelectorAll(".owl-thumb-item img[src='"+image+"']")[0];
              if(imageSource){
                imageSource.click();
              }
            }
            var priceContainer=_productParent.querySelectorAll('[data-price-wrapper]')[0];
            var compareAtPrice= getVariant.compare_at_price;
            var price= getVariant.price;
            var percentage = ((compareAtPrice-price)/compareAtPrice)*100;
            var priceHtml = `<h3 id="get_price">${Shopify.formatMoney(price, moneyFormat)}</h3>`;
            if(compareAtPrice > price){
              priceHtml = `<h3 id="get_price">${Shopify.formatMoney(price, moneyFormat)}<span class="main-price"> <del>${Shopify.formatMoney(compareAtPrice, moneyFormat)}</del> </span> </h3> <span class="percent-off">(${percentage}% OFF)</span>`;
            }
            if(priceContainer){
              priceContainer.innerHTML = priceHtml;
            }

            var advancePayment = _productParent.querySelectorAll('.shopify-payment-button')[0];
            var baseUrl = window.location.pathname;
            if(baseUrl.indexOf('/products/' > -1)){
              var _updateUrl = baseUrl+'?variant='+getVariant.id;
              history.pushState({}, null, _updateUrl);
            }
            if(getVariant.available == true){
              if(paymentButtonWrapper){
                paymentButtonWrapper.removeAttribute("disabled");
              }
              if(paymentButton){
                paymentButton.innerHTML  = "Add to Cart";
              }
              if(advancePayment){
                advancePayment.style.display = "block";
              }
            }else{
              if(paymentButtonWrapper){
                paymentButtonWrapper.setAttribute("disabled", true);
              }
              if(paymentButton){
                paymentButton.innerHTML  = "Sold Out";  
              }            
              if(advancePayment){
                advancePayment.style.display = "none";
              }
            }
          }
          else{
            if(paymentButtonWrapper){
              paymentButtonWrapper.setAttribute("disabled", true);
            }
            if(paymentButton){
              paymentButton.innerHTML  = "Unavailable"; 
            }           
            if(advancePayment){
              advancePayment.style.display = "none";
            }
          }
        },100)
      })
    });

  }
  function variantChange(options,selector){
    var variantData = JSON.parse(selector.querySelector('[type="application/json"][name="variant-json"]').textContent);
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

// sliders

sliders = function(){
	var sliders = document.querySelectorAll('[data-slider]');
  if(sliders){
  	Array.from(sliders).forEach(function(slider) {
      var html = slider.parentNode.querySelectorAll('[name="slider-json"]')[0].innerHTML;
      
      console.log( slider.parentNode,html)
//       html = JSON.parse(html)
    });
  }
}
sliders();
}());


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
  $('.askmecontainer,#quick_view,.search-bar-container,.search-form,#mini__cart,#dropdown-customer,.newsletter-popup-inner,#similar__product,.side-menu').hover(function(){ 
    mouse_is_inside=true; 
  }, function(){ 
    mouse_is_inside=false; 
  });

  $("body").mouseup(function(){ 
    if(! mouse_is_inside) {
      $('body').removeClass('active_askme').removeClass('scrollHidden').removeClass('quickview-open').removeClass('nav-open').removeClass('addsearch').removeClass('small_search').removeClass('minicart-open').removeClass('customer-open').removeClass('NewsletterActive').removeClass('show__similar__products');
      $('.newsletter-popup,.wrapper-overlay,.askmeMain.slideAskme').hide();
    }
  });
  
  $(document).on('click', '.quickView', function(evt) {
    evt.preventDefault();
    $('#ProductQuickView').hide();
    var _url = $(this).data('href');
    if(_url.indexOf('?') > -1){
      _url = _url.split("?");
      _url = _url[0]
    }
    $('.Quick_loader').fadeIn('slow');
    $('body').addClass('quickview-open');
    $('#ProductQuickView').load(_url+'?view=quick-view', function() {
     var recommended = $('#ProductQuickView').find('.product-recommendations');
      var url = recommended.attr('data-url');
      fetch(url)
      .then(response => response.text())
      .then((text) => {
        const html = document.createElement('div');
        html.innerHTML = $(text).find('.product-recommendations').html();
        recommended.html(html)
      setTimeout(function(){
        $('.Quick_loader').hide();
        $('#ProductQuickView').show();
        productVariants();
      },500)
      });
    });
  });
  
  $(document).on('click', '.quickViewClose',function(evt) {
    evt.preventDefault();
    $('body').removeClass('quickview-open');
  });
  
});



