jQuery.getJSON('/cart.js', function (cart, textStatus) {
  buildCart(cart);
});
// POST to cart/change.js returns the cart in JSON
changeItem = function(line, quantity, callback) {
  var $body = $(document.body),
      params = {
        type: 'POST',
        url: '/cart/change.js',
        data: 'quantity=' + quantity + '&line=' + line,
        dataType: 'json',
        success: function(cart) {
          jQuery.getJSON('/cart.js', function (cart, textStatus) {
            callback(cart); 
          });
        },
        error: function(XMLHttpRequest, textStatus) {
          console.log(XMLHttpRequest, textStatus);
        }
      };
  jQuery.ajax(params);
};

// POST to cart/add.js returns the cart in JSON
$(document).on('submit','[action="/cart/add"]', function(evt) {
  evt.preventDefault();
  var submit = $(this).find('[type="submit"]');
  submit.addClass('is-loading');
  params = {
    type: 'POST',
    url: '/cart/add.js',
    data: jQuery(this).serialize(),
    dataType: 'json',
    // beforeSend: function(jqxhr, settings) {
    //   $body.trigger('beforeAddItem.ajaxCart', form);
    // },
    success: function(line_item) {           
      $('body').removeClass('quickview-open');            
      jQuery.getJSON('/cart.js', function (cart, textStatus) {
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
        console.log(XMLHttpRequest, textStatus);
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
      line = $el.data('line'),
      $qtySelector = $el.closest('.quantity').find('.ajaxcart__qty-num'),
      qty = parseInt($qtySelector.val().replace(/\D/g, ''));

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
      line = $el.data('line'),
      qty = parseInt($el.val().replace(/\D/g, ''));

  var qty = validateQty(qty);

  // If it has a data-line, update the cart
  if (line) {
    updateQuantity(line, qty,buildCart);
  }
});

changeCartItem = function(line, quantity) {    
  var  params = {
    type: 'POST',
    url: '/cart/change.js',
    data: 'quantity=' + quantity + '&line=' + line,
    dataType: 'json',
    success: function(cart) {
      jQuery.getJSON('/cart.js', function (cart, textStatus) {
        if(quantity == 0 ){ 
          $('[name="item_quantity"][data-line="'+line+'"]').closest('tr').remove();
        }
        if(cart.item_count == 0 ){
          $('#cart[cart-form]').hide();
          $('[cart-empty]').show();                    
          $('[data-cart-count]').hide().text('');
        }
        else{ 
          $('[data-cart-count]').show().text(cart.item_count);
          var item = cart.items[line-1];
          $('[name="item_quantity"][data-line="'+line+'"]').val(item.quantity);
          cartPageUpdate(cart);
        }
      });
    },
    error: function(XMLHttpRequest, textStatus) {
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
  var shipping = parseInt($('#mini__cart').data('shipping'));
  if (cart.item_count === 0) {
    $('[data-cart-count]').hide();
    $('#mini__cartForm').html(`<div class="emptySideCart">
<img class="emptyCartIcon" src="//cdn.shopify.com/s/files/1/0597/9668/5009/t/6/assets/cart.svg">
<p>Your Cart is Empty</p>
<a class="button black-btn" href="/">Continue Shopping</a>
</div>`);
    return;
  }

  // Handlebars.js cart layout
  var items = [],
      item = {},
      data = {},
      source = $("#CartTemplate").html(),
      template = Handlebars.compile(source);
  // Add each item to our handlebars.js data
  $.each(cart.items, function(index, cartItem) {

    if (cartItem.image != null){
      var prodImg = cartItem.image.replace(/(\.[^.]*)$/, "_small$1").replace('http:', '');
    } else {
      var prodImg = "//cdn.shopify.com/s/assets/admin/no-image-medium-cc9732cb976dd349a0df1d39816fbcc7.gif";
    }

    // Create item's data object and add to 'items' array
    item = {
      key: cartItem.key,
      line: index + 1, // Shopify uses a 1+ index in the API
      url: cartItem.url,
      img: prodImg,
      name: cartItem.product_title,
      variation: cartItem.variant_title,
      properties: cartItem.properties,
      itemAdd: cartItem.quantity + 1,
      itemMinus: cartItem.quantity - 1,
      itemQty: cartItem.quantity,
      // price: Shopify.formatMoney(cartItem.price, settings.moneyFormat),
      vendor: cartItem.vendor,
      linePrice: Shopify.formatMoney(cartItem.line_price, moneyFormat),
      // originalLinePrice: Shopify.formatMoney(cartItem.original_line_price, settings.moneyFormat),
      discounts: cartItem.discounts,
      discountsApplied: cartItem.line_price === cartItem.original_line_price ? false : true
    };

    items.push(item);
  });
  var shippPending ='';
  var shipPendingPercentage = '100';
  if(cart.total_price < shipping){
    shippPending = Shopify.formatMoney((shipping - cart.total_price), moneyFormat);
    shipPendingPercentage = ((cart.total_price /shipping)*100);
    if(shipPendingPercentage > 10){
      shipPendingPercentage= shipPendingPercentage - 5
    }
  }

  // Gather all cart data and add to DOM
  data = {
    items: items,
    count:cart.item_count,
    note: cart.note,
    shipping:shipping,
    shippPending:shippPending,
    shipPendingPercentage:shipPendingPercentage+'%',
    total:cart.total_price, 
    totalPrice: Shopify.formatMoney(cart.total_price, moneyFormat),
    // totalCartDiscount: cart.total_discount === 0 ? 0 : `"translation missing: en.cart.general.savings_html"`.replace('[savings]',),
    totalCartDiscountApplied: cart.total_discount === 0 ? false : true
  }
  $('[data-cart-count]').text(cart.item_count).show();
  $('#mini__cartForm').html(template(data));
  if(showCart){
    $('body').addClass('minicart-open');
    $('.wrapper-overlay').css({"display": "block"});
  }

};


$(document).on('click', '.sd_mini_removeproduct', function(evt) {
  evt.preventDefault();
  var $el = $(this),
      parent = $el.closest('.media-link'),
      line = $el.attr('line');
  // If it has a data-line, update the cart
  if (line) {
    parent.remove();
    updateQuantity(line, 0,buildCart);
  }
})

validateQty = function (qty) {
  if((parseFloat(qty) == parseInt(qty)) && !isNaN(qty)) {
    // We have a valid number!
  } else {
    // Not a number. Default to 1.
    qty = 1;
  }
  return qty;
};

$(document).on('click', '.sd_mini_removeproduct', function(evt) {
  $.ajax({
    url: '/cart/update.js',
    type: 'POST',
    data: {note: "test note"},
    success: function(result) { 
    },
    error: function(jqxhr, status, exception) {
      console.log(exception);
    }
  });
})
