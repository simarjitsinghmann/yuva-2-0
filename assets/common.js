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

//   console.log('test',this.countryEl,'test1',document.querySelectorAll('#'+country_domid) )
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
  },

  classToggle: function (element,className) {

    if (element.classList.contains(className)) {

      element.classList.remove(className)


    } else {

      element.classList.add(className)
    }
  }
}

if (!Element.prototype.fadeIn) {
  Element.prototype.fadeIn = function(){
    let ms = !isNaN(arguments[0]) ? arguments[0] : 400,
        func = typeof arguments[0] === 'function' ? arguments[0] : (
          typeof arguments[1] === 'function' ? arguments[1] : null
        );

    this.style.opacity = 0;
    this.style.filter = "alpha(opacity=0)";
    this.style.display = "inline-block";
    this.style.visibility = "visible";

    let $this = this,
        opacity = 0,
        timer = setInterval(function() {
          opacity += 50 / ms;
          if( opacity >= 1 ) {
            clearInterval(timer);
            opacity = 1;

            if (func) func('done!');
          }
          $this.style.opacity = opacity;
          $this.style.filter = "alpha(opacity=" + opacity * 100 + ")";
        }, 50 );
  }
}

if (!Element.prototype.fadeOut) {
  Element.prototype.fadeOut = function(){
    let ms = !isNaN(arguments[0]) ? arguments[0] : 400,
        func = typeof arguments[0] === 'function' ? arguments[0] : (
          typeof arguments[1] === 'function' ? arguments[1] : null
        );

    let $this = this,
        opacity = 1,
        timer = setInterval( function() {
          opacity -= 50 / ms;
          if( opacity <= 0 ) {
            clearInterval(timer);
            opacity = 0;
            $this.style.display = "none";
            $this.style.visibility = "hidden";

            if (func) func('done!');
          }
          $this.style.opacity = opacity;
          $this.style.filter = "alpha(opacity=" + opacity * 100 + ")";
        }, 50 );
  }
}

function hideallMenus(menus,current){
  Array.from(menus).forEach(function(menu) {
    var menuList = menu.nextElementSibling;
    var menuParent = menu.parentNode;
    if(menu == current){
      return;
    }
    else{
      menuParent.classList.remove('active');
      DOMAnimations.slideUp(menuList);

    }
  });
}

document.addEventListener("DOMContentLoaded", function() {
  setTimeout(function(){
  document.querySelector('body').classList.remove('loading')
  },1000)
  var footerMenus = document.getElementsByClassName('footer-menu-accordion-head');
  if(window.innerWidth < 768 ){
    Array.from(footerMenus).forEach(function(menu) {

      menu.addEventListener('click', function(event) {

        event.preventDefault();
        var menuList = menu.nextElementSibling;
        var menuParent = menu.parentNode;
        if(!(menuParent.classList.contains('active'))){
          hideallMenus(footerMenus,menu)

          DOMAnimations.classToggle(menuParent,'active');

          DOMAnimations.slideToggle(menuList);
        }
        else{

          hideallMenus(footerMenus)
        }

      });
    });
  }
});

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
  $('body').on('click','.nav-button',function(){
    $('body').toggleClass('nav-open');
  });

  ///navigation-sidebar//
  $('body').on('click','.navbar-toggler',function(){
    $('.navbar-collapse-sidebar').toggleClass('show');
    $('body').toggleClass('nav-open');
    // 	$('.wrapper-overlay').css({"display": "block"});
  });

  $('body').on('click','.close-btn',function(){
    $('body').toggleClass('nav-open'), $('.navbar-collapse-sidebar').removeClass('show');
  });

  ///minicart//

  $(document).on('click','.close-cart-drawer',function(){
    $("body").removeClass("minicart-open"), $(".wrapper-overlay").hide();
  });

  ///ask-about-product//
  $('body').on('click','.ask_this_product',function(){
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
    $('.wrapper-overlay').css({"display": "block"});

    var getID = $(this).attr('data-id'); 
    var getSection = $(this).attr('data-section'); 
    const drawer = document.querySelector('[data-similar-product-drawer]');
    
    drawer.classList.add('searching');
    document.querySelector('body').classList.add('similar_Drawer_open');     
    drawer.querySelector('[similar-drawer-body]').innerHTML =preLoadLoadGif;
    fetch("/recommendations/products.json?product_id="+getID+"&limit=10")
    .then(response => response.json())
    .then(({ products }) => {
      var html = '';
          
      if (products.length > 0) {   
        html +=`<div class="similarItemContainer">
                <ul class="results-base results-similarGrid">`;
                 
        products.forEach(function(product){
        	html +=`<li class="product-base">
            <a href="${product.url}">
              <div class="product-imageSliderContainer">`;
          if (product.featured_image  != null){
            var prodImg = product.featured_image.replace(/(\.[^.]*)$/, "_small$1").replace('http:', '');
          } else {
            var prodImg = "//cdn.shopify.com/s/assets/admin/no-image-medium-cc9732cb976dd349a0df1d39816fbcc7.gif";
          }
              html +=`  <picture class="img-responsive" style="width: 100%; height: 100%; display: block;">
                  <img src="${prodImg}" class="img-responsive" alt="${product.title}" title="${product.title}">
                </picture>
              </div>`;
             html +=`<div class="product-productMetaInfo product-information__wrapper ">
                <div class="caption-with-letter-spacing light">${product.title}</div>
                <div class="product-price price__regular">
                    <span class="price-item price-item--regular">
				<span data-regular-price>${Shopify.formatMoney(product.price, moneyFormat)}</span>`;
          if(product.compare_at_price > product.price){
            html +=`<span data-compare-price>${Shopify.formatMoney(product.compare_at_price, moneyFormat)}</span>`;
            if(showSavedAmount){
              if(savedAmountStyle == 'percentage'){
                var saved = roundToTwo(((product.compare_at_price - product.price)/product.compare_at_price)*100)+'% OFF';
              }
              else
              {              	
                var saved = Shopify.formatMoney((product.compare_at_price - product.price),moneyFormat) + ' OFF';
              }
              html +=`<span class="percent-off">${saved}</span>`;
            }
          }
        html +=`</div>
        </div>
      </a>
    </li>`;
        })
        html +=`</ul>
        </div>`;
      }
      else{
        html = `<div class="SimilarNoResults" style="">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="49px" height="50px">
          <image x="0px" y="0px" width="49px" height="50px" xlink:href="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAADEAAAAyCAQAAABfAfs5AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfkARYRMQNLo02IAAADSUlEQVRYw7WXW0hUQRjHf7tbWmoXzZLSQLuTkRYZWg9qmWWXpaALPgUF0UNEPXSnt25ERVgE4UMUGFRvZQUVRJGFaKBRS5rZRYtwTVkr09I9vZzGOXvO2Z096jcv3+z8v+83c/abM3NchLN4FlFIDqkk4gJ+4+cVz6jiE0Ng2ZynGc2y/aCSTcQMJn0m1/lrk36g1VPqLL2Hw/yMmP5/u0NatAA31yxT9dNNj+XIG+aGT+ky9DK4yGrDL3W8wIePNrrxMJ7pZJFJPmMlTRu7uaG2gjTeG+b3iGLclsp0jhMwaHeqAEZTLYV8Z2sE/RzuGh5kcWTEJSmgjjlK6z4mxXxjSnhxsSSuZaLakwX2SnG3wgljeS2EzUxWBgCUS5CV9rJDkmx5VABIoFbEvmWUtSiOFiGqiBIAkEufiN9oLfEKQQ+zHSDgpshQaS24ovaHhbGlIkMXk8zDSTQJgdchwo1P5FhnHpxPuu77eeIQEeS28OebEZl4dL+OgEMEPBVeihmRKvwPjgHQgqZ7Y8yIOOH7B4EI0KN7I82IAesfBOIvfbqnhQ65CQo/TjWfhcXb7Wtw0yr8GYNApIkH1GVGNAl/rqit6C1beB1mhI9O3Z/GTMeIAuG1mAdH8FjszP0OAcl06hmC0nokOyAQPpuzOpLtEhkazEULkMEvIdnhAJDERxF/1E50WbpKZkSNGLh5dTDBTjSLXiErjxKwXjoxj4UTnpOE26MATJKOgi8khpOOk27h/cqQqbyUprY5kjyfP5L8pMLrpMDwcVCmMqcSuqWQRg6GWfhy7kmXAg2N02oL9xogGi2cISek0tPZLm1WuZ2yTuoK6S/jZkjhaTTyjlYCxJLCNOYRbzvFI5xQWckSqUYit178hv4etceVzAWbz5XQ9pxc8qR3g4bGFjUIZHOWaoK2yT9TQan+RiviqzTSRpEqBCCLfdynVczzDx3UUMZaw1cSZNIqQfqM9zGXAiiBZJLwoPGLdptLxAIeSmXSzQYeRLMWNcsTZ4aGRoC8oUdAkeGPb2fhcEBKDJAvZA0HZLGhujpYNRwQr6G4f1Ls/FpjZw34WSN6MXQNPQJq+M0K0asfDgRUEaRQ98tVtp4z20Y+Lp5y9R89MxMHU4TKlQAAAABJRU5ErkJggg=="></image>
          </svg>
          <p>{{ 'general.no_similar_found' | t}}</p>
          </div>`;
      } 
        drawer.querySelector('[similar-drawer-body]').innerHTML = html;  
      }
    );
//     fetch("/recommendations/products?product_id="+getID+"&limit=10&section_id="+getSection)
//     .then(response => response.text())
//     .then((text) => {
//       const html = document.createElement('div');
//       html.innerHTML = text;
//       const recommendations = html.querySelector('.similarItemContainer');
//       if (recommendations && recommendations.innerHTML.trim().length) {
//         drawer.querySelector('[similar-drawer-body]').innerHTML = recommendations.innerHTML;   
//         drawer.classList.remove('searching');
//       }
//     });
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
  $(this).closest('.inner').removeClass('show')
})
$('.toggle.open-menu-drop,.toggle-level').click(function(){
  var $this = $(this);
  if ($this.next().hasClass('show')) {
    $this.next().removeClass('show');
  } else {
    $this.closest('li').find('.inner').removeClass('show');
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
          var getVariant = variantChange(options,'options',_productParent);
          var buttonWrapper = _productParent.querySelector('[data-button-wrapper]');
          var paymentButtonWrapper = _productParent.querySelector('.Sd_addProduct');
          var paymentButton = paymentButtonWrapper.querySelector('span');
          var advancePayment = paymentButtonWrapper.querySelector('.shopify-payment-button');
          if(getVariant != undefined){
          sellingPlans(getVariant,_productParent);
            
            pickUpAvialabiliy(true);
            if(getVariant.featured_media != null){
              var image= getVariant.featured_media.id; 
              if(window.innerWidth > 767){
                var imageSource = _productParent.querySelector("[data-id='media-"+image+"']");
                if(imageSource){
                  imageSource.click();
                }
              }
              else{
                var imageSource = jQuery("#media-"+image);
                if(imageSource){
                  var imageIndex = imageSource.attr('data-slick-index');
                  var slider = imageSource.closest('[data-slider]');
                  slider.slick('slickGoTo',imageIndex)
                }

              }
            }

            _productParent.querySelector('[name="id"]').value = getVariant.id;
            var priceContainer=_productParent.querySelector('[data-price-wrapper]');
            priceUpdate(priceContainer,getVariant,true);
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
                if(preorderStatus && getVariant.inventory_policy == "continue" && getVariant.inventory_quantity <= 0 ){
                  paymentButton.innerHTML  = preorderText;
                }
                else{
                  paymentButton.innerHTML  = addToCartText;
                }
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
            
            pickUpAvialabiliy(false);
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
}

 function variantChange(options,type,selector){
  var variantData = JSON.parse(selector.querySelector('[type="application/json"][name="variant-json"]').textContent);
  return currentVariant = variantData.find((variant) => {     
    if(type === 'options'){
      return !variant.options.map((option, index) => {
        return options[index] === option;
      }).includes(false);
    }
    if(type === 'id'){
      return variant.id == options;
    }
  });
}
function roundToTwo(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}

function priceUpdate(priceContainer,getVariant,showSaved){
  var showSavedAmount = '';
  var savedAmountStyle = '';
  if(priceContainer){
    showSavedAmount = priceContainer.getAttribute('data-saved');
    savedAmountStyle = priceContainer.getAttribute('data-saved-style');
  }
  var compareAtPrice= parseInt(getVariant.compare_at_price);
  var price= parseInt(getVariant.price);
  
  var percentage = roundToTwo(((compareAtPrice-price)/compareAtPrice)*100)+'% OFF';
  var savedAmount = Shopify.formatMoney((compareAtPrice-price),moneyFormat);
  var priceHtml = `<h3 id="get_price">${Shopify.formatMoney(price, moneyFormat)}</h3>`;
  var savedAmountHtml = '';
  if(showSaved){
    if(showSavedAmount == 'true'){
      if(savedAmountStyle == 'percentage'){
        savedAmountHtml +=`<span class="percent-off">${percentage}</span>`;
      }
      else{              	
        savedAmountHtml +=`<span class="percent-off">${savedAmount}</span>`;
      }
    }
  }else{
    if(getVariant.allocation_type == 'percentage'){
      savedAmountHtml +=`<span class="percent-off">${getVariant.allocation_value}% OFF</span>`;
    }
    else{              	
      savedAmountHtml +=`<span class="percent-off">${Shopify.formatMoney(getVariant.allocation_value, moneyFormat)} OFF</span>`;
    }
  }
  if(compareAtPrice > price){
    priceHtml = `<h3 id="get_price">${Shopify.formatMoney(price, moneyFormat)}<span class="main-price"> <del>${Shopify.formatMoney(compareAtPrice, moneyFormat)}</del> </span> ${savedAmountHtml}</h3>`;
  }
  if(getVariant.unit_price_measurement){
    priceHtml += '<p class="unit-price">'+Shopify.formatMoney(getVariant.unit_price, moneyFormat)+' / ';
    priceHtml += getVariant.reference_value == 1 ? '' :getVariant.reference_value;
    priceHtml += getVariant.reference_unit+'</p>';
  }
  if(priceContainer){
    priceContainer.innerHTML = priceHtml;
  }
}

function sellingPlans(variant,form){
  if(variant.selling_plans){
  var sellingPlans = variant.selling_plans;
  var variantPlans=[],
      variantGroups=[];
  var sellingPlanVariable = form.querySelector('[name="selling_plan"]');
  var sellingHtmlContainer = form.querySelector('[data-selling-plan-container]');
  if(sellingHtmlContainer){
    sellingHtmlContainer.innerHTML = '';
    if(Object.keys(sellingPlans).length > 0){
      for(plan in sellingPlans){
        var planId = parseInt(plan.replace('plan_',''));
        var groupId = sellingPlans[plan]['group_id'];
        variantPlans.push(planId)
        if(!(variantGroups.includes(groupId))){
          variantGroups.push(groupId)
        }
      }
      var sellingPlanHtml =`<div class="selling_group active">
<div class="sellingPlanHeading" for="oneTimePurchase">
<input type="radio" id="oneTimePurchase" name="sellingPlanHeading" checked>
<label for="oneTimePurchase">One Time Purchase</label>
</div>
</div>`;
      variantGroups.forEach(function(group,index){
        var group = eval('selling_Plan_Group_'+group);
        var groupPlans = group.selling_plans;

        sellingPlanHtml +=`<div class="selling_group">
<div class="sellingPlanHeading" for="sellingGroup${index}">
<input type="radio" id="sellingGroup${index}" name="sellingPlanHeading" value="">
<label for="sellingGroup${index}">${group.name}</label>
</div>
<div  class="selling_plan">
<select class="selling_plan_attribute">`;
        for(plan in groupPlans){
          var plan = groupPlans[plan];
          sellingPlanHtml +=`<option value="${plan.id}">${plan.name}</option>`;
        }
        sellingPlanHtml +=`</select></div>
</div>`;
      })
      sellingPlanHtml +=`</div>`;
      sellingPlanVariable.value = '';
      sellingHtmlContainer.innerHTML = sellingPlanHtml;
      sellingPlanChange();
    }
  }
  }
}


function pickUpAvialabiliy(status){
  setTimeout(function(){
    var pickUp = document.querySelector('.product__pickup-availabilities');
    var previewContainer = document.getElementById('pickup-availability-preview-container');
    if(pickUp && status){
      previewContainer.innerHTML = '';
      pickUp.classList.add('hidden')
      previewContainer.classList.add('hidden');
      var rootUrl = pickUp.dataset.rootUrl;
      var variantId = pickUp.closest('form').querySelector('[name=id]').value;
      if (!rootUrl.endsWith("/")) {
        rootUrl = rootUrl + "/";
      }
      var variantSectionUrl = `${rootUrl}variants/${variantId}/?section_id=pickup-availability`;

      fetch(variantSectionUrl)
      .then(response => response.text())
      .then(text => {
        var sectionInnerHTML = new DOMParser()
        .parseFromString(text, 'text/html')
        .querySelector('.shopify-section');
        var container = sectionInnerHTML.querySelector('#pickUpAvailabilityPreview');
        if(container){
          previewContainer.innerHTML = sectionInnerHTML.innerHTML;
          previewContainer.classList.remove('hidden');
          pickUp.classList.remove('hidden')
          showPickupDrawer();
        }
      })
      .catch(e => {
      });
    }
  },500);
}

function sellingPlanChange(){
  var groupSelectors = document.querySelectorAll('[name="sellingPlanHeading"]');
  Array.from(groupSelectors).forEach(function(group) {
    group.addEventListener("click", ()=>{
                           var value = '';
                           var productForm = group.closest('form');
    var sellingPlanVariable = productForm.querySelector('[name="selling_plan"]');
    var selectors = productForm.querySelectorAll('.selling_group');
    var _thisParent = group.closest('.selling_group');
    if(_thisParent.classList.contains('active')){
      return;
    }
    else{
      Array.from(selectors).forEach(function(selector) {
        if(selector != _thisParent){
          selector.classList.remove('active');
          if(selector.querySelector('.selling_plan')){
            DOMAnimations.slideUp(selector.querySelector('.selling_plan'))
        }
        }
      });

      var variantId = productForm.querySelector('[name="id"]').getAttribute('value');
      var variantSelected = variantChange(variantId,'id',productForm);
      var _productParent = productForm.closest('.product_content_section');
      var priceContainer=_productParent.querySelector('[data-price-wrapper]');
      if(_thisParent.querySelector('.selling_plan_attribute')){
        value = _thisParent.querySelector('.selling_plan_attribute').value;    
        priceUpdate(priceContainer,variantSelected['selling_plans']['plan_'+value],false);
      }else{
        priceUpdate(priceContainer,variantSelected,true);
      }
      sellingPlanVariable.value = value;
      _thisParent.classList.add('active');
          if(_thisParent.querySelector('.selling_plan')){
            DOMAnimations.slideDown(_thisParent.querySelector('.selling_plan'))
        }

    }
  });
});
var planSelectors = document.querySelectorAll('select.selling_plan_attribute');
Array.from(planSelectors).forEach(function(plan) {
  plan.addEventListener("change", ()=>{
                        var value = '';
                        var productForm = plan.closest('form');
  var sellingPlanVariable = productForm.querySelector('[name="selling_plan"]');
  sellingPlanVariable.value = plan.value;
  var variantId = productForm.querySelector('[name="id"]').getAttribute('value');

  var variantSelected = variantChange(variantId,'id',productForm);
  var _productParent = productForm.closest('.product_content_section');
  var priceContainer=_productParent.querySelector('[data-price-wrapper]');
  priceUpdate(priceContainer,variantSelected['selling_plans']['plan_'+ plan.value],false);
});
});
}
showMultipleOptions = function(){
  var showOptions = document.getElementsByClassName('showOptions');
  if(showOptions){		
    Array.from(showOptions).forEach(function(option) {
      option.addEventListener("click", ()=>{	
                              hideOptions();
      var product = option.getAttribute("data-product");
      var wrapper =  option.closest('.card--product ');
      wrapper.querySelector('#'+product).style.display="block";
    });
  });
}

var closeOptions = document.getElementsByClassName('close-product-wrap');
if(closeOptions){		
  Array.from(closeOptions).forEach(function(option) {
    option.addEventListener("click", ()=>{
                            var product = option.getAttribute("data-product");
      var wrapper =  option.closest('.card--product ');
    wrapper.querySelector('#'+product).style.display="none";
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

function showPickupDrawer(){
      const showContainerButton = document.getElementById('ShowPickupAvailabilityDrawer');
      const previewContainer = document.getElementById('pickup-availability-preview-container');
    const drawer = document.querySelector('[data-side-drawer]');	
  drawer.setAttribute('class','side_drawer_wrapper');
  if(showContainerButton){
    showContainerButton.addEventListener("click", ()=>{
                                         var drawerHtml = previewContainer.querySelector('#pickUpAvailabilityMain').innerHTML;
  	
  drawer.classList.add('pickup-availability-drawer');
    drawer.querySelector('[data-drawer-title]').innerHTML ='Pick Up Availability';
  drawer.querySelector('[data-drawer-body]').innerHTML = drawerHtml; 
    document.querySelector('body').classList.add('side_Drawer_open'); 
                                         });
}
}
pickUpAvialabiliy(true);
productVariants();
showMultipleOptions(); 
sellingPlanChange();

// sliders

slickSlider = function(selector,slideIndex){
  var optionContainer = selector.closest('.shopify-section').find('[name="slider-json"]')[0];
  if(optionContainer){
    var html = selector.closest('.shopify-section').find('[name="slider-json"]')[0].textContent;
    var options = JSON.parse(html);
    if(selector.is("[mobile-only]")){
      if($(window).width() < 768 ){

        if(slideIndex){
          selector.slick(options).slick('slickGoTo',slideIndex);
        }
        else{
          selector.slick(options);
        }
      }
    }
    else{

      if(slideIndex){
        selector.slick(options).slick('slickGoTo',slideIndex);
      }
      else{
        selector.slick(options);
      }
    }
    
    jQuery(window).trigger('resize');
  }
  $(selector).on('afterChange', function(event, slick, currentSlide){
  var video = $(this).find('.slick-current video');
    if(video.length > 0){
    	video.trigger('play')
    }
});
}

sliders = function(){
  var sliders = jQuery('body').find('[data-slider]');
  if(sliders.length > 0){
    sliders.each(function(index) {
      if (!jQuery(this).hasClass('slick-initialized')) {
        slickSlider(jQuery(this));
      }
    });
  }
}
sliders();
window.addEventListener('resize', function(event){
  sliders();
});
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

    slider.slick('slickGoTo',slideIndex);
    slider.slick('slickPause')

  }
  else if(event.type == "shopify:section:load"){
    if(block != ''){
      slideIndex = undefined;
    }
    slickSlider(jQuery(slider),slideIndex);
    if(jQuery(event.target).find('#instafeed').length > 0 ){
    	instagramFeed();
    }
    if(jQuery(event.target).find('.announcement-bar').length > 0 ){s
      initAnnouncement();
    }
  }
  else{
    if (!slider.hasClass('slick-initialized')){
      slider.slick('refresh');
    }
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
  $('.similar_drawer_wrapper,#toolbox-sort,#sort__list,.side_drawer_wrapper,.askmecontainer,.search-bar-container,.search-form,.newsletter-popup-inner,.side-menu').hover(function(){ 
    mouse_is_inside=true; 
  }, function(){ 
    mouse_is_inside=false; 
  });

  $("body").mouseup(function(){ 
    if(! mouse_is_inside) {
      $('body').removeClass('similar_Drawer_open').removeClass('side_Drawer_open').removeClass('active_askme').removeClass('scrollHidden').removeClass('quickview-open').removeClass('nav-open').removeClass('addsearch').removeClass('small_search').removeClass('minicart-open').removeClass('customer-open').removeClass('NewsletterActive').removeClass('show__similar__products');
      $('.newsletter-popup,.wrapper-overlay,.askmeMain.slideAskme').hide();
     
      if($(window).width() < 768){
        $('#sort__list').removeClass('active');
      }
      else{
        $('#sort__list').slideUp();      
      }
      $('body').removeClass('side_Drawer_open').removeClass('open-filter-sort');
    }
  });
  $(document).on('click','.side_drawer_close,.similar_drawer_close',function(){
    $('body').removeClass('side_Drawer_open').removeClass('similar_Drawer_open')
//     $('body').find('[data-side-drawer]').attr('class','side_drawer_wrapper').attr('id','')
  });
  $(document).on('click', '.quickView', function(evt) {
    evt.preventDefault();

    const drawer = document.querySelector('[data-side-drawer]');
    drawer.setAttribute('class','side_drawer_wrapper');	
    drawer.setAttribute('id','quickView_product');
    drawer.classList.add('quickView_product');
    drawer.querySelector('[data-drawer-body]').innerHTML = preLoadLoadGif;
    drawer.querySelector('[data-drawer-title]').innerHTML ='Quick View';
    drawer.querySelector('[data-drawer-body]').classList.add('searching');
    document.querySelector('body').classList.add('side_Drawer_open'); 
    var _url = $(this).data('href');
    if(_url.indexOf('?') > -1){
      _url = _url.split("?");
      _url = _url[0]
    }
    $('.Quick_loader').fadeIn('slow');
    setTimeout(function(){
      $('[data-drawer-body]').load(_url+'?view=quick-view', function() {
        $(window).trigger('resize');
        drawer.querySelector('[data-drawer-body]').classList.remove('searching');
        Shopify.PaymentButton.init()

        productVariants();
        showMultipleOptions(); 
      });
    },1000)
  });

  $(document).on('click', '.quickViewClose',function(evt) {
    evt.preventDefault();
    $('body').removeClass('quickview-open');
  });

});
