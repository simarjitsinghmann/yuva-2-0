
buildCart = function (cart,showCart) {
    if (cart.item_count === 0) {
        $('[data-cart-count]').hide();
        $('#mini__cart').html(`<div class="emptySideCart">
								<p>Your Cart is Empty</p>
                                <h6><a href="/">Continue Shopping</a></h6>
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
            // linePrice: Shopify.formatMoney(cartItem.line_price, settings.moneyFormat),
            // originalLinePrice: Shopify.formatMoney(cartItem.original_line_price, settings.moneyFormat),
            discounts: cartItem.discounts,
            discountsApplied: cartItem.line_price === cartItem.original_line_price ? false : true
        };

        items.push(item);
    });

    // Gather all cart data and add to DOM
    data = {
        items: items,
        count:cart.item_count,
        note: cart.note,
        totalPrice: Shopify.formatMoney(cart.total_price, moneyFormat),
        // totalCartDiscount: cart.total_discount === 0 ? 0 : `"translation missing: en.cart.general.savings_html"`.replace('[savings]',),
        totalCartDiscountApplied: cart.total_discount === 0 ? false : true
    }
    $('[data-cart-count]').text(cart.item_count).show();
    $('#mini__cart').html(template(data));
    if(showCart){
        $('body').addClass('minicart-open');
        $('.wrapper-overlay').css({"display": "block"});
    }

};
jQuery.getJSON('/cart.js', function (cart, textStatus) {
    buildCart(cart);
});

// POST to cart/change.js returns the cart in JSON
function changeItem(line, quantity, callback) {
    var $body = $(document.body),
    params = {
    type: 'POST',
    url: '/cart/change.js',
    data: 'quantity=' + quantity + '&line=' + line,
    dataType: 'json',
    success: function(cart) {
        jQuery.getJSON('/cart.js', function (cart, textStatus) {
            buildCart(cart); 
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
    params = {
        type: 'POST',
        url: '/cart/add.js',
        data: jQuery(this).serialize(),
        dataType: 'json',
        // beforeSend: function(jqxhr, settings) {
        //   $body.trigger('beforeAddItem.ajaxCart', form);
        // },
        success: function(line_item) {                
            jQuery.getJSON('/cart.js', function (cart, textStatus) {
                buildCart(cart,true); 
            });
        },
        error: function(XMLHttpRequest, textStatus) {
            if ((typeof errorCallback) === 'function') {
            errorCallback(XMLHttpRequest, textStatus);
            }
            else {
                console.log(XMLHttpRequest, textStatus);
            }
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
        updateQuantity(line, qty);
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
        updateQuantity(line, qty);
    }
});

function updateQuantity(line, qty) {
    isUpdating = true;
    setTimeout(function() {
        changeItem(line, qty);
    }, 250);
}


$(document).on('click', '.sd_mini_removeproduct', function(evt) {
  evt.preventDefault();
    var $el = $(this),
        parent = $el.closest('.media-link'),
        line = $el.attr('line');
	console.log($el)
	
    // If it has a data-line, update the cart
    if (line) {
      parent.remove();
        updateQuantity(line, 0);
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
