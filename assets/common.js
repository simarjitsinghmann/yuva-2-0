/*
 * Shopify Common JS
 *
 */
if ((typeof window.Shopify) == 'undefined') {
  window.Shopify = {};
}

Shopify.bind = function(fn, scope) {
  return function() {
    return fn.apply(scope, arguments);
  }
};

Shopify.setSelectorByValue = function(selector, value) {
  for (var i = 0, count = selector.options.length; i < count; i++) {
    var option = selector.options[i];
    if (value == option.value || value == option.innerHTML) {
      selector.selectedIndex = i;
      return i;
    }
  }
};

Shopify.addListener = function(target, eventName, callback) {
  target.addEventListener ? target.addEventListener(eventName, callback, false) : target.attachEvent('on'+eventName, callback);
};

Shopify.postLink = function(path, options) {
  options = options || {};
  var method = options['method'] || 'post';
  var params = options['parameters'] || {};

  var form = document.createElement("form");
  form.setAttribute("method", method);
  form.setAttribute("action", path);

  for(var key in params) {
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", key);
    hiddenField.setAttribute("value", params[key]);
    form.appendChild(hiddenField);
  }
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};

Shopify.CountryProvinceSelector = function(country_domid, province_domid, options) {
  var countryElement = document.querySelectorAll('#'+country_domid);
  var provinceElement = document.querySelectorAll('#'+province_domid);
  var provinceContainerEl = document.querySelectorAll('#'+options['hideElement'] || '#'+province_domid);
  
  this.countryEl         = countryElement[0];
  this.provinceEl        = provinceElement[0];
  this.provinceContainer = provinceContainerEl[0];
  if(countryElement[1]){
  	 this.countryEl= countryElement[1];
  }
  if(provinceElement[1]){
  	 this.provinceEl= provinceElement[1];
  }
  if(provinceContainerEl[1]){
  	 this.provinceContainer= provinceContainerEl[1];
  }
  
//   this.countryEl         = document.querySelector('#'+country_domid+':last-child');
//   this.provinceEl        = document.querySelector('#'+province_domid+':last-child');
//   this.provinceContainer = document.querySelector('#'+options['hideElement']+':last-child' || '#'+province_domid+':last-child');
	
  console.log('test',this.countryEl,'test1',document.querySelectorAll('#'+country_domid) )
  Shopify.addListener(this.countryEl, 'change', Shopify.bind(this.countryHandler,this));

  this.initCountry();
  this.initProvince();
};

Shopify.CountryProvinceSelector.prototype = {
  initCountry: function() {
    var value = this.countryEl.getAttribute('data-default');
    Shopify.setSelectorByValue(this.countryEl, value);
    this.countryHandler();
  },

  initProvince: function() {
    var value = this.provinceEl.getAttribute('data-default');
    if (value && this.provinceEl.options.length > 0) {
      Shopify.setSelectorByValue(this.provinceEl, value);
    }
  },

  countryHandler: function(e) {
    var opt       = this.countryEl.options[this.countryEl.selectedIndex];
    var raw       = opt.getAttribute('data-provinces');
    var provinces = JSON.parse(raw);

    this.clearOptions(this.provinceEl);
    if (provinces && provinces.length == 0) {
      this.provinceContainer.style.display = 'none';
    } else {
      for (var i = 0; i < provinces.length; i++) {
        var opt = document.createElement('option');
        opt.value = provinces[i][0];
        opt.innerHTML = provinces[i][1];
        this.provinceEl.appendChild(opt);
      }

      this.provinceContainer.style.display = "";
    }
  },

  clearOptions: function(selector) {
    while (selector.firstChild) {
      selector.removeChild(selector.firstChild);
    }
  },

  setOptions: function(selector, values) {
    for (var i = 0, count = values.length; i < values.length; i++) {
      var opt = document.createElement('option');
      opt.value = values[i];
      opt.innerHTML = values[i];
      selector.appendChild(opt);
    }
  }
};

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


var DOMAnimations = {
    
    /**
    * SlideUp
    *
    * @param {HTMLElement} element
    * @param {Number} duration
    * @returns {Promise<boolean>}
    */
    slideUp: function (element, duration = 500) {

        return new Promise(function (resolve, reject) {

            element.style.height = element.offsetHeight + 'px';
            element.style.transitionProperty = `height, margin, padding`;
            element.style.transitionDuration = duration + 'ms';
            element.offsetHeight;
            element.style.overflow = 'hidden';
            element.style.height = 0;
            element.style.paddingTop = 0;
            element.style.paddingBottom = 0;
            element.style.marginTop = 0;
            element.style.marginBottom = 0;
            window.setTimeout(function () {
                element.style.display = 'none';
                element.style.removeProperty('height');
                element.style.removeProperty('padding-top');
                element.style.removeProperty('padding-bottom');
                element.style.removeProperty('margin-top');
                element.style.removeProperty('margin-bottom');
                element.style.removeProperty('overflow');
                element.style.removeProperty('transition-duration');
                element.style.removeProperty('transition-property');
                resolve(false);
            }, duration)
        })
    },

    /**
    * SlideDown
    *
    * @param {HTMLElement} element
    * @param {Number} duration
    * @returns {Promise<boolean>}
    */
    slideDown: function (element, duration = 500) {

        return new Promise(function (resolve, reject) {

            element.style.removeProperty('display');
            let display = window.getComputedStyle(element).display;

            if (display === 'none') 
                display = 'block';

            element.style.display = display;
            let height = element.offsetHeight;
            element.style.overflow = 'hidden';
            element.style.height = 0;
            element.style.paddingTop = 0;
            element.style.paddingBottom = 0;
            element.style.marginTop = 0;
            element.style.marginBottom = 0;
            element.offsetHeight;
            element.style.transitionProperty = `height, margin, padding`;
            element.style.transitionDuration = duration + 'ms';
            element.style.height = height + 'px';
            element.style.removeProperty('padding-top');
            element.style.removeProperty('padding-bottom');
            element.style.removeProperty('margin-top');
            element.style.removeProperty('margin-bottom');
            window.setTimeout(function () {
                element.style.removeProperty('height');
                element.style.removeProperty('overflow');
                element.style.removeProperty('transition-duration');
                element.style.removeProperty('transition-property');
            }, duration)
        })
    },

    /**
    * SlideToggle
    *
    * @param {HTMLElement} element
    * @param {Number} duration
    * @returns {Promise<boolean>}
    */
    slideToggle: function (element, duration = 500) {

        if (window.getComputedStyle(element).display === 'none') {

            return this.slideDown(element, duration);

        } else {

            return this.slideUp(element, duration);
        }
    }
}

function truncate(str, no_words) {
  var length = str.split(" ").length;
  var _value = str.split(" ").splice(0,no_words).join(" ");
  if(length > no_words){
  	_value = _value+'..'
  }
    return _value;
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
	});
	
	///minicart//
	
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
    $('body').toggleClass('side_Drawer_open');
    $('.wrapper-overlay').css({"display": "block"});

    const drawer = document.querySelector('[data-side-drawer]');	

    drawer.setAttribute('id','similar_product');
    drawer.classList.add('similar_product');
    drawer.classList.add('searching');
    document.querySelector('body').classList.add('side_Drawer_open');     
    drawer.querySelector('[data-drawer-body]').innerHTML ='';
    drawer.querySelector('[data-drawer-title]').innerHTML ='Similar Products';
    var getID = $(this).attr('data-id'); 
    var getSection = $(this).attr('data-section'); 
    fetch("/recommendations/products?product_id="+getID+"&limit=10&section_id="+getSection)
    .then(response => response.text())
    .then((text) => {
      const html = document.createElement('div');
      html.innerHTML = text;
      const recommendations = html.querySelector('.similarItemContainer');
      if (recommendations && recommendations.innerHTML.trim().length) {
        drawer.querySelector('[data-drawer-body]').innerHTML = recommendations.innerHTML;   
        drawer.classList.remove('searching');
      }
    });
  });
		
	///search-top//

	$('.HeaderProClose').click(function(){
		$("body").removeClass("addsearch");
		$("body").removeClass("small_search");
	});
	
	
	//currency-dropdown//
	$('.currency-dropdown').click(function(){
		$(this).find(".currency-menu").slideToggle("fast");
		$('.currency-menu').css({"display": "block"});
	});
		
	///product-size-select///
	$('body').on('click','.dropdown-selected',function(){
		$('body').find(".productOptionSelectList").slideUp("fast");
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
			
          var buttonWrapper = _productParent.querySelector('[data-button-wrapper]');
          var paymentButtonWrapper = _productParent.querySelector('.Sd_addProduct');
          var paymentButton = paymentButtonWrapper.querySelector('span');
          var advancePayment = paymentButtonWrapper.querySelector('.shopify-payment-button');
          if(getVariant != undefined){
            if(getVariant.featured_media != null){
              var image= getVariant.featured_media['preview_image']['src'];
              image= image.replace("https:", ""); 
              var imageSource = _productParent.querySelectorAll(".owl-thumb-item img[src='"+image+"']")[0];
              if(imageSource){
                imageSource.click();
              }
            }
            _productParent.querySelector('[name="id"]').value = getVariant.id;
            var priceContainer=_productParent.querySelector('[data-price-wrapper]');
            var showSavedAmount = '';
            var savedAmountStyle = '';
            if(priceContainer){
              showSavedAmount = priceContainer.getAttribute('data-saved');
              savedAmountStyle = priceContainer.getAttribute('data-saved-style');
            }
            var compareAtPrice= getVariant.compare_at_price;
            var price= getVariant.price;
            var percentage = (((compareAtPrice-price)/compareAtPrice)*100)+'% OFF';
            var savedAmount = Shopify.formatMoney((compareAtPrice-price),moneyFormat);
            var priceHtml = `<h3 id="get_price">${Shopify.formatMoney(price, moneyFormat)}</h3>`;
            var savedAmountHtml = '';
            console.log('priceContainer',priceContainer,'showSavedAmount',showSavedAmount)
            if(showSavedAmount == 'true'){
            	if(savedAmountStyle == 'percentage'){
              savedAmountHtml +=`<span class="percent-off">(${percentage})</span>`;
                }
              else{              	
              savedAmountHtml +=`<span class="percent-off">(${savedAmount})</span>`;
              }
            }
            if(compareAtPrice > price){
              priceHtml = `<h3 id="get_price">${Shopify.formatMoney(price, moneyFormat)}<span class="main-price"> <del>${Shopify.formatMoney(compareAtPrice, moneyFormat)}</del> </span> </h3>${savedAmountHtml}`;
            }
            if(priceContainer){
              priceContainer.innerHTML = priceHtml;
            }

            var baseUrl = window.location.pathname;
            if(baseUrl.indexOf('/products/') > -1){
              var _updateUrl = baseUrl+'?variant='+getVariant.id;
              history.pushState({}, null, _updateUrl);
            }
            if(getVariant.available == true){
              if(buttonWrapper){
                buttonWrapper.classList.remove('disabled');
              }
              if(paymentButtonWrapper){
                paymentButtonWrapper.removeAttribute("disabled");
              }
              if(paymentButton){
                paymentButton.innerHTML  = addToCartText;
              }
            }else{

              if(buttonWrapper){
                buttonWrapper.classList.add('disabled');
              }
              if(paymentButtonWrapper){
                paymentButtonWrapper.setAttribute("disabled", true);
              }
              if(paymentButton){
                paymentButton.innerHTML  = soldOutText;  
              } 
            }
          }
          else{
            if(buttonWrapper){
              buttonWrapper.classList.add('disabled');
            }
            if(paymentButtonWrapper){
              paymentButtonWrapper.setAttribute("disabled", true);
            }
            if(paymentButton){
              paymentButton.innerHTML  = unavailableText; 
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

slickSlider = function(selector,slideIndex){
  var optionContainer = selector.closest('.shopify-section').find('[name="slider-json"]')[0];
  if(optionContainer){
    var html = selector.closest('.shopify-section').find('[name="slider-json"]')[0].textContent;
    var options = JSON.parse(html);
    if(slideIndex){
      selector.slick(options).slick('slickGoTo',slideIndex);
    }
    else{
      selector.slick(options);
    }
  }
}

sliders = function(){
  var sliders = jQuery('body').find('[data-slider]');
  if(sliders.length > 0){
    sliders.each(function(index) {
      slickSlider(jQuery(this));
    });
  }
}
sliders();

var slideIndex = 0;
var block = '';

jQuery(document).on('shopify:section:load shopify:section:unload shopify:block:select shopify:block:deselect', function(event){
  var parent = event.target;
  if(Shopify.PaymentButton){
    Shopify.PaymentButton.init();
  }
  var slider = jQuery(parent).find('[data-slider]');
  if(event.type == "shopify:block:select"){
    var sectionId = event.detail.sectionId
    block = jQuery(event.target);
    var slider = jQuery('#shopify-section-'+sectionId).find('[data-slider]');

    slideIndex  = $('.slideshow__slide--' + event.detail.blockId + ':not(.slick-cloned)').data('slick-index');
    
    console.log($('.slideshow__slide--' + event.detail.blockId + ':not(.slick-cloned)'),slideIndex);

    
    slider.slick('slickGoTo',slideIndex);
      slider.slick('slickPause')
    
  }
  else if(event.type == "shopify:section:load"){
    if(block != ''){
      slideIndex = undefined;
    }
    slickSlider(jQuery(slider),slideIndex);
  }
  else{
    slider.slick('refresh');
  }
});
}());


$(document).on("click", function(event){
	var $trigger = $(".productOptionSelect");
	if($trigger !== event.target && !$trigger.has(event.target).length){
		$(".productOptionSelectList").slideUp("fast");
	}          				
});

$('body').on('click','.dropdown-menu li', function() {
	var getValue = $(this).text();
	$(this).find('input').prop('checked',true)
	$(this).closest('.productOptionSelect').find('.dropdown-selected').text(getValue);
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
  $('#toolbox-sort,.side_drawer_wrapper,.askmecontainer,.search-bar-container,.search-form,.newsletter-popup-inner,.side-menu').hover(function(){ 
    mouse_is_inside=true; 
  }, function(){ 
    mouse_is_inside=false; 
  });

  $("body").mouseup(function(){ 
    if(! mouse_is_inside) {
      $('body').removeClass('side_Drawer_open').removeClass('active_askme').removeClass('scrollHidden').removeClass('quickview-open').removeClass('nav-open').removeClass('addsearch').removeClass('small_search').removeClass('minicart-open').removeClass('customer-open').removeClass('NewsletterActive').removeClass('show__similar__products');
      $('.newsletter-popup,.wrapper-overlay,.askmeMain.slideAskme').hide();
      $('body').find('[data-side-drawer]').attr('class','side_drawer_wrapper').attr('id','')
      if(window.innerWidth < 768){
        $('#sort__list').removeClass('active');
        $('body').removeClass('side_Drawer_open')
      }
    }
  });
  $(document).on('click','.side_drawer_close',function(){
      $('body').removeClass('side_Drawer_open')
      $('body').find('[data-side-drawer]').attr('class','side_drawer_wrapper').attr('id','')
  });
  $(document).on('click', '.quickView', function(evt) {
    evt.preventDefault();
    
    const drawer = document.querySelector('[data-side-drawer]');	
    drawer.setAttribute('id','quickView_product');
    drawer.classList.add('quickView_product');
    drawer.querySelector('[data-drawer-body]').innerHTML ='';
    drawer.querySelector('[data-drawer-title]').innerHTML ='Quick View';
    drawer.querySelector('[data-drawer-body]').classList.add('searching');
    document.querySelector('body').classList.add('side_Drawer_open'); 
    var _url = $(this).data('href');
    if(_url.indexOf('?') > -1){
      _url = _url.split("?");
      _url = _url[0]
    }
    $('.Quick_loader').fadeIn('slow');
    $('[data-drawer-body]').load(_url+'?view=quick-view', function() {
      $(window).trigger('resize');
      setTimeout(function(){
        drawer.querySelector('[data-drawer-body]').classList.remove('searching');
        Shopify.PaymentButton.init()

        productVariants();
        showMultipleOptions(); 
      },500)
    });
  });

  $(document).on('click', '.quickViewClose',function(evt) {
    evt.preventDefault();
    $('body').removeClass('quickview-open');
  });

});



