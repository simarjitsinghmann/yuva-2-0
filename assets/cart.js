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


updateLineItem = function(){
  var items = $('#cart').find('table tr');
  items.each(function(index){
    $(this).find('[data-line]').attr('data-line',(index + 1))
  })
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
          $('[data-cart-count]').hide().text('');
        }
        else{ 
          $('[data-cart-count]').show().text(cart.item_count);

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
  $('[data-cart-item-count]').text(cart.item_count);
  $('[data-cart-original-price]').text(Shopify.formatMoney(cart.original_total_price, moneyFormat));
  $('[data-cart-total-price]').text(Shopify.formatMoney(cart.total_price, moneyFormat));
  if(cart.cart_level_discount_applications.length > 0){
    var discounts = '';
    $.each(cart.cart_level_discount_applications,function(index,discount){
      discounts += '<li data-cart-discount>Discount['+discount.title+'] <strong>-'+Shopify.formatMoney(discount.total_allocated_amount, moneyFormat)+'</strong></li>';
    })
    $('li[data-cart-discount]').remove();
    $(discounts).insertAfter('li[data-cart-original]')
  }
  else{
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