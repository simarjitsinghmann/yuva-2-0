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
      source = $("#mainCartTemplate").html(),
      template = Handlebars.compile(source);
  // Add each item to our handlebars.js data
  $.each(cart.items, function(index, cartItem) {

    if (cartItem.image != null){
      var prodImg = cartItem.image.replace(/(\.[^.]*)$/, "_small$1").replace('http:', '');
    } else {
      var prodImg = "//cdn.shopify.com/s/assets/admin/no-image-medium-cc9732cb976dd349a0df1d39816fbcc7.gif";
    }
    var unitPriceExist = false;
    var unitPrice = '';
    if(cartItem.unit_price){
      unitPriceExist = true;
      unitPrice += Shopify.formatMoney(cartItem.unit_price, moneyFormat);
      unitPrice += ' / ';
      unitPrice += cartItem.unit_price_measurement.reference_value > 1 ? cartItem.unit_price_measurement.reference_value : '';
      unitPrice += cartItem.unit_price_measurement.reference_unit;
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
      name: truncate(cartItem.product_title,5),
      variation: cartItem.variant_title,
      showoptions:cartItem.product_has_only_default_variant? false:true,
      options: cartItem.options_with_values,
      properties: cartItem.properties,
      itemAdd: cartItem.quantity + 1,
      itemMinus: cartItem.quantity - 1,
      unitPriceExist:unitPriceExist,
      unitPrice:unitPrice,
      itemQty: cartItem.quantity,
      sellingPlan: sellingPlan,
      originalprice: Shopify.formatMoney(cartItem.original_price,moneyFormat),
      finalprice: Shopify.formatMoney(cartItem.final_price,moneyFormat),
      vendor: cartItem.vendor,
      linePrice: Shopify.formatMoney(cartItem.final_line_price, moneyFormat),
      originalLinePrice: Shopify.formatMoney(cartItem.original_line_price,moneyFormat),
      discounts: cartItem.discounts,
      discountsApplied: cartItem.original_line_price === cartItem.final_line_price ? false : true
    };

    items.push(item);
  });
 
  $.each(cart.cart_level_discount_applications, function(index, cartDiscount) {
    var discount ={
      title:cartDiscount.title,
      price:Shopify.formatMoney(cartDiscount.total_allocated_amount, moneyFormat)
    }
    cartDiscounts.push(discount);
  });

  // Gather all cart data and add to DOM
  data = {
    items: items
  }
  
  $('body').find('[data-cart-items]').html(template(data));
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