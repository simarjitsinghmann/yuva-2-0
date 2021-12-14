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


// Update quantity based on input on change

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
          $('[data-cart-count]').hide();
        }
        else{ 
          $('[data-cart-count]').show();

          var item = cart.items[line-1];
          if(item){
            $('[name="item_quantity"][data-line="'+line+'"]').val(item.quantity);
          }
          updateLineItem();
          cartPageUpdate(cart);
        }
      });
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
      $qtySelector = $el.siblings('input[name="item_quantity"]'),
      qty = parseInt($qtySelector.val().replace(/\D/g, ''));

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
      qty = parseInt($el.val().replace(/\D/g, ''));

  var qty = validateQty(qty);
  // Add or subtract from the current quantity

  if (line) {
    changeCartItem(line, qty);
  } 
});

$(document).on('click', '.line_item_remove', function(evt) {
  evt.preventDefault();
  var $el = $(this),
      line = $el.data('line');
  // If it has a data-line, update the cart
  if (line) {
    changeCartItem(line, 0);
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

cartPageUpdate = function(cart){
  
     var items = [],
      item = {},
      data = {},
      cartDiscounts =[],
      source = $("#CartTemplate").html(),
      template = Handlebars.compile(source);
  // Add each item to our handlebars.js data
  $.each(cart.items, function(index, cartItem) {

    if (cartItem.image != null){
      var prodImg = cartItem.image.replace(/(\.[^.]*)$/, "_small$1").replace('http:', '');
    } else {
      var prodImg = "//cdn.shopify.com/s/assets/admin/no-image-medium-cc9732cb976dd349a0df1d39816fbcc7.gif";
    }
    var sellingPlan = '';
    if(cartItem.selling_plan_allocation){
      sellingPlan = cartItem.selling_plan_allocation.selling_plan.name;
    }
    // Create item's data object and add to 'items' array
    item = {
      key: cartItem.key,
      line: index + 1, // Shopify uses a 1+ index in the API
      url: cartItem.url,
      img: prodImg,
      name: truncate(cartItem.product_title,4),
      variation: cartItem.variant_title,
      properties: cartItem.properties,
      itemAdd: cartItem.quantity + 1,
      itemMinus: cartItem.quantity - 1,
      itemQty: cartItem.quantity,
      sellingPlan: sellingPlan,
      price: Shopify.formatMoney(cartItem.price,moneyFormat),
      vendor: cartItem.vendor,
      linePrice: Shopify.formatMoney(cartItem.final_line_price, moneyFormat),
      originalLinePrice: Shopify.formatMoney(cartItem.original_line_price,moneyFormat),
      discounts: cartItem.discounts,
      discountsApplied: cartItem.original_line_price === cartItem.final_line_price ? false : true
    };

    items.push(item);
  });
  var shippPending ='';
  var shipPendingPercentage = '100';
  if(cart.total_price < shipping){
    shippPending = Shopify.formatMoney((shipping - cart.total_price), moneyFormat);
    shippPending = shippingText.replace('||amount||','<strong>'+shippPending+'</strong>');
    shipPendingPercentage = ((cart.total_price /shipping)*100);
    if(shipPendingPercentage > 10){
      shipPendingPercentage= shipPendingPercentage - 5
    }
  }
  $.each(cart.cart_level_discount_applications, function(index, cartDiscount) {
    var discount ={
      title:cartDiscount.title,
      price:Shopify.formatMoney(cartDiscount.total_allocated_amount, moneyFormat)
    }
    cartDiscounts.push(discount);
  });

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
    totalCartDiscount: cartDiscounts,
    totalCartDiscountApplied: cart.total_discount === 0 ? false : true
  }
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


$(document).on('change ', '[name=note]', function(evt) {
  var currentVal = $(this).val();
  $.ajax({
    url: '/cart/update.js',
    type: 'POST',
    data: {note: currentVal},
    dataType: 'json',
    success: function(result) { 
    }
  });
})