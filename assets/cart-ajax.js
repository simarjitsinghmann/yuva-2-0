validateQty = function (qty) {
  if((parseFloat(qty) == parseInt(qty)) && !isNaN(qty)) {
    // We have a valid number!
  } else {
    // Not a number. Default to 1.
    qty = 1;
  }
  return qty;
};
$(document).on('change ', '[name=note]', function(evt) {
  var currentVal = $(this).val();
  $.ajax({
    url: cartUpdateUrl,
    type: 'POST',
    data: {note: currentVal},
    dataType: 'json',
    success: function(result) { 
    }
  });
})

if(window.location.pathname.indexOf('/cart') > -1 ){
  
   // Shipping Estimations
  
  (function () {

    function shippingEstimates() {

      if (Shopify && Shopify.CountryProvinceSelector) {
        var country = document.getElementById('shippingCountry');
        if(!country){
        	return false;
        }
        //      country.querySelectorAll('option')[1].setAttribute('selected',true);
        var shipping = new Shopify.CountryProvinceSelector('shippingCountry', 'shippingProvince', {
          hideElement: 'shippingProvinceContainer'
        });

        setupEventListeners();
      }
    }
    function setupEventListeners(){
      var button = document.getElementById('getShippingEstimates');
      if(button){
        button.addEventListener("click", (e)=>{
          e.preventDefault();
                                $('#ShippingWrapperResponse').html('').removeClass('success').removeClass('error').hide();
        var shippingAddress = {};
        shippingAddress.zip = jQuery('#shippingZip').val() || '';
        shippingAddress.country = jQuery('#shippingCountry').val() || '';
        shippingAddress.province = jQuery('#shippingProvince').val() || '';
        _getCartShippingRates(shippingAddress);

      });
    }
  }

   var _getCartShippingRates = function(shippingAddress) {
    var params = {
      type: 'POST',
      url: '/cart/prepare_shipping_rates',
      data: jQuery.param({'shipping_address': shippingAddress}),
      success: _CartShippingRates(shippingAddress),
      error: _onError
    }
    jQuery.ajax(params);
  };
  var _CartShippingRates = function(shippingAddress) {
    var poller = function() {
      jQuery.ajax('/cart/async_shipping_rates', {
        dataType: 'json',
        success: function(response, textStatus, xhr) {
          console.log(response)
          if (xhr.status === 200) {
            _render(response.shipping_rates)
          } 
        },
        error: _onError
      })
    }
    return poller;
  }
  var _fullMessagesFromErrors = function(errors) {
    var fullMessages = [];
    jQuery.each(errors, function(attribute, messages) {
      jQuery.each(messages, function(index, message) {
        fullMessages.push(attribute + ' ' + message);
      });
    });
    return fullMessages;
  };
  var _onError = function(XMLHttpRequest, textStatus) {
    var data = eval('(' + XMLHttpRequest.responseText + ')');
    feedback = errorLabel +' : ' + _fullMessagesFromErrors(data).join(', ') + '.';  
    $('#ShippingWrapperResponse').html('<p class="error-text">'+feedback+'</p>').addClass('error').show();
  }
  var _render = function(response) {
    if(response){

      var html= '';
      response.forEach(function(shipping){
        html += `<p class="delievery-text success-text">${shipping.name}:${Shopify.formatMoney((shipping.price*100),moneyFormat)}</p>`;
      })
      $('#ShippingWrapperResponse').html(html).addClass('success').show();
    }
  };  
  setTimeout(function(){
    shippingEstimates() 
  },500)
}());
  
  // Update quantity based on input on change

  changeCartItem = function(line, quantity) {    
    var  params = {
      type: 'POST',
      url: cartChangeUrl,
      data: 'quantity=' + quantity + '&line=' + line,
      dataType: 'json',
      success: function(cart) {
          if(quantity == 0 ){ 
            $('[name="item_quantity"][data-line="'+line+'"]').closest('tr').remove();
          }
          if(cart.item_count == 0 ){
            $('[cart-form]').hide();
            $('[cart-empty]').show();                    
            $('[data-cart-count]').hide();
          }
          else{ 
            $('[data-cart-count]').show();

            var item = cart.items[line-1];
            if(item){
              $('[name="item_quantity"][data-line="'+line+'"]').val(item.quantity);
            }
            cartPageUpdate(cart);
          }
      },
      error: function(XMLHttpRequest, textStatus) {
      }
    };
    jQuery.ajax(params);
  };


  $(document).on('click', '.line_item_change', function(evt) {
    evt.preventDefault();
    var $el = $(this),
        line = $el.data('line'),
      parent = $el.closest('tr'),
        $qtySelector = $el.siblings('input[name="item_quantity"]'),
        qty = parseInt($qtySelector.val().replace(/\D/g, ''));

    parent.addClass('disabled');
    var qty = validateQty(qty);
    // Add or subtract from the current quantity
    if ($el.hasClass('plus')) {
      qty += 1;
    } else {
      qty -= 1;
      if (qty <= 0) qty = 0;
    }
    $qtySelector.val(qty);
    if (line) {
      changeCartItem(line, qty);
    } 
  });

  $(document).on('change', '[name="item_quantity"]', function(evt) {
    evt.preventDefault();
    var $el = $(this),
        line = $el.data('line'),
      parent = $el.closest('tr'),
        qty = parseInt($el.val().replace(/\D/g, ''));
    parent.addClass('disabled');

    var qty = validateQty(qty);
    // Add or subtract from the current quantity

    if (line) {
      changeCartItem(line, qty);
    } 
  });

  $(document).on('click', '.line_item_remove', function(evt) {
    evt.preventDefault();
    var $el = $(this),
      parent = $el.closest('tr'),
        line = $el.data('line');
    // If it has a data-line, update the cart
    if (line) {
    parent.addClass('disabled');
      changeCartItem(line, 0);
    }
  })


  cartPageUpdate = function(cart){  

    $.ajax({
      url: mainCartUrl,
      type: 'GET',
      dataType: 'html',
      success: function(result){
        $('body').find('[data-cart-items]').html($(result).find('[data-cart-items]').html());
        if(cart.item_count == 0){
          $('[data-cart-count').hide();
        }
        $('[data-cart-item-count]').text(cart.item_count);
        $('[data-cart-original-price]').text(Shopify.formatMoney(cart.original_total_price, moneyFormat));
        $('[data-cart-total-price]').text(Shopify.formatMoney(cart.total_price, moneyFormat));
        if(cart.cart_level_discount_applications.length > 0){
          var discounts = '';
          $.each(cart.cart_level_discount_applications,function(index,discount){
            discounts += '<li data-cart-discount>Discount['+discount.title+'] <strong>-'+Shopify.formatMoney(discount.total_allocated_amount, moneyFormat)+'</strong></li>';
          })
          $('li[data-cart-discount]').remove();
          $('li[data-cart-original]').removeClass('hidden');
          $(discounts).insertAfter('li[data-cart-original]')
        }
        else{
          $('li[data-cart-original]').addClass('hidden');
          $('li[data-cart-discount]').remove();
        }
      }
    })  
  }
}
else{
  // POST to cart/change.js returns the cart in JSON
  changeItem = function(line, quantity, callback) {
    var $body = $(document.body),
        params = {
          type: 'POST',
          url: cartChangeUrl,
          data: 'quantity=' + quantity + '&line=' + line,
          dataType: 'json',
          success: function(cart) {
              callback(cart); 
          },
          error: function(XMLHttpRequest, textStatus) {
            console.log(XMLHttpRequest, textStatus);
          }
        };
    jQuery.ajax(params);
  };

  updateQuantity = function(line, qty,callback) {
    isUpdating = true;
    setTimeout(function() {
      changeItem(line, qty,callback);
    }, 250);
  }

  buildCart = function (cart,showCart) {
    if (cart.item_count === 0) {
      $('[data-cart-count]').hide();
    }
    else{
      $('[data-cart-count]').show();
    }


    $('[data-drawer-body]').load(mainCartUrl+'?view=jsonData', function() {
      if(showCart){
        $('body').addClass('side_Drawer_open');
        $('.wrapper-overlay').css({"display": "block"});
      }
    });

  };


  // POST to cart/add.js returns the cart in JSON
  $('body').on('click','.Sd_addProduct',function(evt) {
    evt.preventDefault();
    $('body').find('.productErrors').hide().html('');
    var form = $(this).closest('form')
    var submit = $(this);
    submit.addClass('is-loading');
    params = {
      type: 'POST',
      url: cartAddUrl,
      data: form.serialize(),
      dataType: 'json',
      // beforeSend: function(jqxhr, settings) {
      //   $body.trigger('beforeAddItem.ajaxCart', form);
      // },
      success: function(line_item) {           
        $('body').removeClass('quickview-open'); 

        $('[data-drawer-body]').html(preLoadLoadGif);
        $('body').find('[data-side-drawer]').attr('class','side_drawer_wrapper')
        $('body').find('[data-drawer-title]').html(cartTitleLabel);
        $('body').find('[data-side-drawer]').attr('id','mini__cart').addClass('mini_cart');
        $('body').addClass('side_Drawer_open');
        jQuery.getJSON(cartUrl, function (cart, textStatus) {
          buildCart(cart,true);
          setTimeout(function(){
            submit.removeClass('is-loading');
          },1000)
        });
      },
      error: function(XMLHttpRequest, textStatus) {
        if ((typeof errorCallback) === 'function') {
          errorCallback(XMLHttpRequest, textStatus);
        }
        else {
          console.log(XMLHttpRequest);
          console.log(XMLHttpRequest.responseJSON.description);
          $('body').find('.productErrors').html(XMLHttpRequest.responseJSON.description).show();
        }
        setTimeout(function(){
          submit.removeClass('is-loading');
        },1000)
      }
    };
    jQuery.ajax(params);
  });

  // Update quantity based on input on change

  $(document).on('click', '.quantity-button', function(evt) {
    evt.preventDefault();
    var $el = $(this),
        parent = $el.closest('.media-link'),
        line = $el.data('line'),
        $qtySelector = $el.closest('.quantity').find('.ajaxcart__qty-num');
    var qty = $qtySelector.val();
    parent.addClass('disabled')
    if(qty){
      qty = parseInt(qty.replace(/\D/g, ''));
    }

    var qty = validateQty(qty);

    // Add or subtract from the current quantity
    if ($el.hasClass('ajaxcart__qty--plus')) {
      qty += 1;
    } else {
      qty -= 1;
      if (qty <= 0) qty = 0;
    }
    $qtySelector.val(qty);
    if (line) {
      updateQuantity(line, qty,buildCart);
    } 
  });

  // Update quantity based on input on change
  $(document).on('change', '.ajaxcart__qty-num', function(evt) {
    evt.preventDefault();
    var $el = $(this),
        parent = $el.closest('.media-link'),
        line = $el.data('line'),
        qty = parseInt($el.val().replace(/\D/g, ''));

    parent.addClass('disabled')
    var qty = validateQty(qty);

    // If it has a data-line, update the cart
    if (line) {
      updateQuantity(line, qty,buildCart);
    }
  });

  $('body').on('click','.openCartDrawer',function(e){
    e.preventDefault();
    $('[data-drawer-body]').html(preLoadLoadGif);
    $('body').find('[data-drawer-title]').html(cartTitleLabel);
    $('body').find('[data-side-drawer]').attr('class','side_drawer_wrapper')
    $('body').find('[data-side-drawer]').attr('id','mini__cart').addClass('mini_cart');
    $('body').addClass('side_Drawer_open');
    jQuery.getJSON(cartUrl, function (cart, textStatus) {
      buildCart(cart,true);
    });
  });

  $(document).on('click', '.sd_mini_removeproduct', function(evt) {
    evt.preventDefault();
    var $el = $(this),
        parent = $el.closest('.media-link'),
        line = $el.attr('line');
    parent.addClass('disabled')
    // If it has a data-line, update the cart
    if (line) {
      updateQuantity(line, 0,buildCart);
    }
  })


  $(document).on('click ', '.cartDrawerNote', function(evt) {
    $(this).toggleClass('active');
    var textArea = $(this).siblings('.cartNoteContainer');
    textArea.slideToggle()
  })
}


