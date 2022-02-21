
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
  var parameters = options['parameters'] || {};

  var form = document.createElement("form");
  form.setAttribute("method", method);
  form.setAttribute("action", path);

  for(var key in parameters) {
    var fields = document.createElement("input");
    fields.setAttribute("type", "hidden");
    fields.setAttribute("name", key);
    fields.setAttribute("value", parameters[key]);
    form.appendChild(fields);
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

/** All Menu Hide **/

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

function pad2(number) {
  return (number < 10 ? '0' : '') + number
}

function screenVisibility(elem) {

  if( elem.length == 0 ) {
    return;
  }
  
  var $window = $(window);
  var viewport_top = $window.scrollTop();
  var viewport_height = $window.height();
  var viewport_bottom = viewport_top + viewport_height;
  var $elem = elem;
  var top = $elem.offset().top;
  var height = $elem.height();
  var bottom = top + height;
  return (top >= viewport_top && top < viewport_bottom) ||
    (bottom > viewport_top && bottom <= viewport_bottom) ||
    (height > viewport_height && top <= viewport_top && bottom >= viewport_bottom)
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

function roundToTwo(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
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


productVariants=function() {
    var productOptions = document.getElementsByClassName('productOption');
    if(productOptions){
      var options=[];	
      eventType = 'click';
      
        if(variantStyle == 'dropdown'){
        	eventType = 'change';
        }
      Array.from(productOptions).forEach(function(productOption) {
        
        productOption.addEventListener(eventType, ()=>{	
                                       var _productParent = productOption.closest('.product_content_section');
        setTimeout(function(){    
          const fieldsets = Array.from(_productParent.querySelectorAll('.product-loop-variants'));
          if(variantStyle == 'dropdown'){
            options=fieldsets.map((fieldset) => {
              return Array.from(fieldset.querySelectorAll('select')).find((select) => select).value;
            });
          }
          else{
            options=fieldsets.map((fieldset) => {
              return Array.from(fieldset.querySelectorAll('input')).find((radio) => radio.checked).value;
            });
          }
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
  var priceHtml = `<span class="yv-product-price">${Shopify.formatMoney(price, moneyFormat)}</span>`;
  var savedAmountHtml = '';
  if(showSaved){
    if(showSavedAmount == 'true'){
      if(savedAmountStyle == 'percentage'){
        savedAmountHtml +=`<span class="yv-product-percent-off">${percentage}</span>`;
      }
      else{              	
        savedAmountHtml +=`<span class="yv-product-percent-off">${savedAmount}</span>`;
      }
    }
  }else{
    if(getVariant.allocation_type == 'percentage'){
      savedAmountHtml +=`<span class="yv-product-percent-off">${getVariant.allocation_value}% OFF</span>`;
    }
    else{              	
      savedAmountHtml +=`<span class="yv-product-percent-off">${Shopify.formatMoney(getVariant.allocation_value, moneyFormat)} OFF</span>`;
    }
  }
  if(compareAtPrice > price){
    priceHtml = `<span class="yv-product-price">${Shopify.formatMoney(price, moneyFormat)}</span><span class="yv-product-compare-price"> ${Shopify.formatMoney(compareAtPrice, moneyFormat)}</span> ${savedAmountHtml}`;
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
<label for="oneTimePurchase">${oneTimePurchaseText}</label>
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

jQuery('body').on('click','.productThumbImage',function(e) {
  e.preventDefault();
  
  var destination = jQuery(this).attr('href');
  top = 10;
  if(jQuery('header').hasClass('sticky-header')){
    var top = jQuery('header').height() + 10;
  }
  if(jQuery(destination+'.productImageItem').length > 0){
  jQuery('html,body').animate({ scrollTop:(jQuery(destination+'.productImageItem').offset().top) - top});
  }
});

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
  return false;
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
sellingPlanChange();

slickSlider = function(selector,slideIndex){
  var optionContainer = selector.closest('.shopify-section').find('[name="slider-json"]')[0];
  if(optionContainer){
    selector.on('init', function(event, slick){
      if(selector.attr('data-slider-filter') != undefined){
        var filterSlides = selector.find('.filter-slide');
          filterSlides.each(function(){
            var item = $(this).attr('data-filter-item');
            $(this).closest('.slick-slide').addClass(item)
          })  
      }
    });
    
    var html = selector.closest('.shopify-section').find('[name="slider-json"]')[0].textContent;
    var options = JSON.parse(html);
    if(slideIndex){
      selector.slick(options).slick('slickGoTo',slideIndex);
    }
    else{
      selector.slick(options);
    }
    setTimeout(function(){
   if(selector.attr('data-slider-filter') != undefined){
        var filterButtons = selector.closest('.shopify-section').find('.filter-products');
        var selectedCollection = selector.closest('.shopify-section').find('.filter-products.active').data('products');
        //       console.log('selectedCollection',selectedCollection)        
        selector.slick('slickUnfilter');
        selector.slick('slickFilter','.'+selectedCollection)
              filterButtons.on('click',function(){                
                if(!$(this).hasClass('active')){
                  $(this).siblings().removeClass('active');
                  $(this).addClass('active');     
                  selectedCollection = $(this).data('products');
                  selector.slick('slickUnfilter');
                  selector.slick('slickFilter','.'+selectedCollection)
                }
              })
      }},500)
    jQuery(window).trigger('resize');
  }
  jQuery(selector)
  .on('beforeChange', function(event, slick, currentSlide, nextSlide) {
    var video = $(slick.$slides[currentSlide]).find('video');
    if(video.length > 0){
      video.trigger('pause')
    }
    var iframeVideo = $(slick.$slides[currentSlide]).find('iframe');
    if(iframeVideo.length > 0){
      iframeVideo[0].contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
    }
  })
  .on('afterChange', function(event, slick, currentSlide){
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

      if(jQuery(this).is("[mobile-only]")){
        if($(window).width() < 768 ){
          if (!jQuery(this).hasClass('slick-initialized')) {
            slickSlider(jQuery(this));
          }
        }
        else{
          if (jQuery(this).hasClass('slick-initialized')) {
            jQuery(this).slick('unslick');
          }
        }
      }else{
        if (!jQuery(this).hasClass('slick-initialized')) {
          slickSlider(jQuery(this));
        }
      }
    });
  }
}

sliders();

window.addEventListener('resize', function(event){
  sliders();
  if($('body').hasClass('active_askme') && $(window).width() < 768 ){
    $('.askmeMain').addClass('slideAskme');
  }
});


var slideIndex = 0;
var block = '';


function faqInit(){
  var tabHead = document.getElementsByClassName('faqSection-header');
  if(tabHead.length > 0 ){
    var tabContent =  document.getElementsByClassName('faqSection-content');

    Array.from(tabHead).forEach(function(btn) {
      btn.addEventListener("click", ()=>{
                           var iconPlus = btn.querySelector('.iconPlus');
                           var iconMinus = btn.querySelector('.iconMinus');
      if(btn.classList.contains('active')){
        iconMinus.style.display = 'none';
        iconPlus.style.display = 'inline';
        clearActive();
      }
      else{
        iconPlus.style.display = 'none';
        iconMinus.style.display = 'inline';
        btn.classList.add("active");
        var _value = btn.getAttribute("content");
        clearActive(btn, document.getElementById(_value));
        DOMAnimations.slideDown(document.getElementById(_value));
      }
    });
  });
}
}


var dealSection = function(selector){
  const second = 1000,
        minute = second * 60,
        hour = minute * 60,
        day = hour * 24;
  var clearCountDown;

  countdown = function(selector){
    var parent = document.querySelector(selector);
    if(parent){
      clearInterval(clearCountDown);
      var dateSelector = parent.querySelector(".dealDate");
      if(dateSelector) {
       
      const myArr = dateSelector.value.split("/");
      let _day = myArr[0];
      let _month = myArr[1];
      let _year = myArr[2];
      let _date = _month+"/"+_day+"/"+_year+" 00:00:00";
      let countDown = new Date(_date).getTime();
      if(isNaN(countDown)){
        if(Shopify.designMode){
          alert('Incorrect Date or Date Format');
        }
        return false;
      }
		var daySelector = parent.querySelector("#dDays");
		var hourSelector = parent.querySelector("#dHours");
		var minSelector = parent.querySelector("#dMinutes");
		var secSelector = parent.querySelector("#dSeconds");
        if(daySelector && hourSelector && minSelector && secSelector){
          clearCountDown = setInterval(function() {    

            let now = new Date().getTime(),
                distance = countDown - now;
            var leftDays = Math.floor(distance / (day));
            if(distance > 0){
              daySelector.innerText = pad2(leftDays),
                hourSelector.innerText = pad2(Math.floor((distance % (day)) / (hour))),
                minSelector.innerText = pad2(Math.floor((distance % (hour)) / (minute))),
                secSelector.innerText = pad2(Math.floor((distance % (minute)) / second));
            }
            else{
              parent.querySelector("#dealCountdown").style.display = "none";
              clearInterval(clearCountDown);
            }
          }, 0)
        }
    }
    }
  }  
  
  countdown("#"+selector);
  
}


var deals = document.getElementsByClassName('deal-banner-section');
if(deals){
	
  Array.from(deals).forEach(function(deal) {
    dealSection(deal.getAttribute('id'))
  });
}

function clearActive(currentHead,currentContent){
  var tabs = document.getElementsByClassName('faqSection-header');
  var tabsContent =  document.getElementsByClassName('faqSection-content');
  Array.from(tabs).forEach(function(item) {
                           var iconPlus = item.querySelector('.iconPlus');
                           var iconMinus = item.querySelector('.iconMinus');
    if(item == currentHead){
      return;
    }
    else{
        iconMinus.style.display = 'none';
        iconPlus.style.display = 'inline';
      item.classList.remove('active');
    }
  });
  Array.from(tabsContent).forEach(function(item) {
    if(item == currentContent){
      return;
    }
    else{
      DOMAnimations.slideUp(item);
    }
  });
}

faqInit();

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
    if(slider.length > 0 && slider.hasClass('slick-initialized')){
      slider.slick('slickGoTo',slideIndex);
      slider.slick('slickPause');
    }

  }
  else if(event.type == "shopify:section:load"){
    if(block != ''){
      slideIndex = undefined;
    }  
    
    if(jQuery(slider).is("[mobile-only]")){
      if($(window).width() < 768 ){
        if (!jQuery(slider).hasClass('slick-initialized')) {
          slickSlider(jQuery(slider),slideIndex);
        }
      }
      else{
        if (jQuery(slider).hasClass('slick-initialized')) {
          jQuery(slider).slick('unslick');
        }
      }
    }else{
      if (!jQuery(slider).hasClass('slick-initialized')) {
        slickSlider(jQuery(slider),slideIndex);
      }
    }
    if(jQuery(event.target).find('[data-slider]').length > 0){
      jQuery('html, body').animate({ scrollTop:(jQuery(event.target).offset().top)});
    
    }
    if(jQuery(event.target).find('.faqSection-header').length > 0 ){
    	faqInit();
    }
    if(jQuery(event.target).find('.dealDate').length > 0 ){
      dealSection(jQuery(event.target).attr('id'))
    }
    if(jQuery(event.target).find('#instafeed').length > 0 ){
    	instagramFeed();
    }
    if(jQuery(event.target).find('.announcement-bar').length > 0 ){
      initAnnouncement();
    }
    var pathName = window.location.pathname;
    if(pathName.indexOf('/products') > -1){
    recommendedProductsSlider();
    }
  }
  else{
    if (slider.hasClass('slick-initialized')){
      slider.slick('refresh');
    }
  }
});


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

  $('body').on('click','.navbar-toggler',function(){
    $('.navbar-collapse-sidebar').addClass('show');
    $('body').addClass('nav-open');
  });

  $('body').on('click','.close-btn',function(){
    $('body').removeClass('nav-open'),$('.toggle-level,.list-menu__item.toggle').removeClass('open-menu-drop'),$('.inner').slideUp('slow');
  });


  $(document).on('click','.close-cart-drawer',function(){
    $("body").removeClass("minicart-open"), $(".wrapper-overlay").hide();
  });

 $('body').on('click','.ask_this_product',function(){
    $('body').addClass('active_askme');
    $('.askmeMain').css({"display": "block"});
    $('body').addClass('scrollHidden');
    if($(window).width() < 768){      
      setTimeout(function(){
        $('.askmeMain').addClass('slideAskme');
      },250)
    }
  });
  $('.ask_cross').click(function(){
    $("body").removeClass('scrollHidden').removeClass("active_askme");
     if($(window).width() > 767){
    $('.askmeMain').hide().removeClass('slideAskme');
    }
    else{
      $('.askmeMain.slideAskme').removeClass('slideAskme');
      setTimeout(function(){
      $('.askmeMain').hide()
      },250)
    }
  });


   $('body').on('click','.similar_options',function(){
    $('.wrapper-overlay').css({"display": "block"});

    var getUrl = $(this).attr('data-url'); 
    const drawer = document.querySelector('[data-similar-product-drawer]');
    
    drawer.classList.add('searching');
    document.querySelector('body').classList.add('similar_Drawer_open');     
    drawer.querySelector('[similar-drawer-body]').innerHTML =preLoadLoadGif;

    fetch(getUrl)
    .then(response => response.text())
    .then((text) => {
      const html = document.createElement('div');
      html.innerHTML = text;
      const recommendations = html.querySelector('#similarItemContainer');
      if (recommendations && recommendations.innerHTML.trim().length) {
        drawer.querySelector('[similar-drawer-body]').innerHTML = recommendations.innerHTML;   
        drawer.classList.remove('searching');
      }
    });
  });

  $('.HeaderProClose').click(function(){
    $("body").removeClass("addsearch");
    $("body").removeClass("small_search");
  });


 $('.currency-dropdown .dropdown-toggle').click(function(){
    $(this).closest('.currency-dropdown').find(".currency-menu").slideToggle("fast");
  });
   $('body').on('click','#CountryList .dropdown-item',function(event){
     event.preventDefault();
     var value = $(this).attr('data-value');
     var text = $(this).text();
     $(this).closest('form').find('.dropdown-toggle').text(text);
     $(this).closest('form').find('[name="country_code"]').val(value);
     $(this).closest('form').submit();
    $(this).closest('.currency-dropdown').find(".currency-menu").slideUp("fast");
  });

   $('body').on('click','.dropdown-selected',function(){
    $('body').find(".productOptionSelectList").slideUp("fast");
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


$('.toggle.list-menu__item,.toggle-level').click(function(){
  var $this = $(this);
  if ($this.hasClass('open-menu-drop')) {
    $(this).removeClass('open-menu-drop')
    $this.next().slideUp('slow');
  } else {
    if($(this).hasClass('toggle-level')){
      $('.toggle-level').removeClass('open-menu-drop');
      $('.toggle-level').next().slideUp('slow');
    }
    else{
      $('.toggle.list-menu__item').removeClass('open-menu-drop');
      $('.toggle.list-menu__item').next().slideUp('slow');
    }
    $this.closest('li').find('.inner').slideUp('slow');
    $(this).addClass('open-menu-drop')
    $this.next().slideDown('slow');
  }

});

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

$(document).ready(function(){
  $('.dropdown-menu-list,.ask_this_product,.similar_drawer_wrapper,#toolbox-sort,#sort__list,.side_drawer_wrapper,.askmecontainer,.search-bar-container,.search-form,.newsletter-popup-inner,.side-menu').hover(function(){ 
    mouse_is_inside=true; 
  }, function(){ 
    mouse_is_inside=false; 
  });

  $("body").mouseup(function(){ 
    if(! mouse_is_inside) {
      $('body').removeClass('similar_Drawer_open')
      .removeClass('side_Drawer_open')
      .removeClass('active_askme')
      .removeClass('scrollHidden')
      .removeClass('quickview-open')
      .removeClass('nav-open')
      .removeClass('addsearch')
      .removeClass('small_search')
      .removeClass('minicart-open')
      .removeClass('customer-open')
      .removeClass('NewsletterActive')
      .removeClass('show__similar__products');
      
    $('.wrapper-overlay').hide();
      setTimeout(function(){
          $('.newsletter-popup').hide();
        },200)
    if($(window).width() > 767){
    $('.askmeMain').hide().removeClass('slideAskme');
    }
    else{
      $('.askmeMain.slideAskme').removeClass('slideAskme');
      setTimeout(function(){
      $('.askmeMain').hide()
      },250)
    }
      $('.dropdown-menu-list').removeClass('open')
      $('.toggle-level,.list-menu__item.toggle').removeClass('open-menu-drop');
     $('.side-menu').find('.inner').slideUp('slow');
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
  });
  
 $(document).on('click', '.quickView', function(evt) {
    evt.preventDefault();

    const drawer = document.querySelector('[data-side-drawer]');
    drawer.setAttribute('class','side_drawer_wrapper');	
    drawer.setAttribute('id','quickView_product');
    drawer.classList.add('quickView_product');
    drawer.querySelector('[data-drawer-body]').innerHTML = preLoadLoadGif;
    drawer.querySelector('[data-drawer-title]').innerHTML =quickViewHeading;
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
      });
    },1000)
  });

  $(document).on('click', '.quickViewClose',function(evt) {
    evt.preventDefault();
    $('body').removeClass('quickview-open');
  });

  $('.sd_main_Slider').each(function () {
    var _slider = $(this);
    sd_slider(_slider, 'next');
  })
     
    jQuery('body').on('click', '.sd_slider_controls', function() {
    
        // get the current slider
        var sd_slider = $(this).attr('parent-slider');	
        
        // $('#sd_slider_1').find('.sd_active_slider').attr('sd-slide-number');
        var current_slide_number = $('#'+sd_slider).find('.sd_active_slider').attr('sd-slide-number');
    
    
        //then hide all slides of current slider
        $('#'+sd_slider+' .sd_slide_wrapper').removeClass('sd_active_slider');
    
        //find the next & prev Case
        var control_type =  jQuery(this).attr('attr-type');
        var total_slides = jQuery('#'+sd_slider).find('.sd_slide_wrapper').length;
        if(control_type == 'next'){
            var next_slide_number = parseInt(current_slide_number)+1;
            if(jQuery('#'+sd_slider).find(`[sd-slide-number='${next_slide_number}']`).length > 0){
                jQuery('#'+sd_slider).find(`[sd-slide-number='${next_slide_number}']`).addClass('sd_active_slider');
            }
            else{
                jQuery('#'+sd_slider).find(`[sd-slide-number='1'`).addClass('sd_active_slider');
            }
        }
    
        if(control_type == 'prev'){
            var prev_slide_number = parseInt(current_slide_number)-1;
            if(jQuery('#'+sd_slider).find(`[sd-slide-number='${prev_slide_number}']`).length > 0){
                jQuery('#'+sd_slider).find(`[sd-slide-number='${prev_slide_number}']`).addClass('sd_active_slider');
            }else{
                jQuery('#'+sd_slider).find(`[sd-slide-number='${total_slides}']`).addClass('sd_active_slider');
            }
        }
        
    });
    
  var productGridSliderInterval;
  $('.hover-slider').hover(function(){ 
    var _this = $(this);
    productGridSliderInterval = setInterval(function(){
    	_this.find('.sd_slider_controls[attr-type="next"]').trigger('click');
    },2000)
  }, function(){ 
    $('.hover-slider').removeClass('active'); 
    clearInterval(productGridSliderInterval)
  });
  
  $('.about-left-img').click(function(){ 
    var _this = $(this);
    var _parent = _this.closest('.shopify-section');
    var _product = _this.data('product');
    if(!_this.hasClass('active')){
    	_parent.find('.about-left-img').removeClass('active');
      _this.addClass('active');
      _parent.find('.about-left-content').fadeOut(100);
      $('#'+_product).delay(100).fadeIn(100);
    }
  });
});

