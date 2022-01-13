$(document).ready(function(){
  	$('.search-form').click(function(){
		var _class=$(this).data('search-drawer');
		$('body').toggleClass(_class);		
		$('input.search-input').focus();
		$('#recent_search_list').html('');
      recentSearch();
	});
  $('.search-input').bind('focusin focusout', function(e){
    $(this).closest('.search-box').toggleClass('focus', e.type == 'focusin');
  });

  /// AjaX Product Search
  var searchTimeoutThrottle = 500;
  var searchTimeoutID = -1;
  var currReqObj = null;

  //var $resultsBox = $('<div class="results-box" />').appendTo('.search-box');
  var $resultsBox = $('.results-box');
  $('.AjaxSearchResponse').prepend('');
  $('.HeaderProClose').show(); 
  $('.search-input').bind('keyup change', function(){
    var _this = $(this);
    var _drawer = $('[data-search-drawer]').data('search-drawer');

    var retrievedSearch = localStorage.getItem("Recent_search");
    var retrievedSearch_v = JSON.parse(retrievedSearch);    
    if(retrievedSearch_v==null){
      var retrievedSearch_v = [];
    }
    //Only search if search string longer than 2, and it has changed
    if($(this).val().length > 1 && $(this).val() != $(this).data('oldval')) {
      //Reset previous value
      $('.HeaderProClose').show();
      $(this).data('oldval', $(this).val());

      // Kill outstanding ajax request
      if(currReqObj != null) currReqObj.abort();

      // Kill previous search
      clearTimeout(searchTimeoutID);

      var $form = $(this).closest('form');
      //Search term
      var term = $form.find('input[name="q"]').val();

      //URL for full search page
      var linkURL = $form.attr('action') + '?q=' + term+'&options%5Bprefix%5D=last';

      //Show loading
      $resultsBox.html(preLoadLoadGif);
      $('.header_icon_search').hide();
      $('.Search_loader').show();
      // Do next search (in X milliseconds)
      searchTimeoutID = setTimeout(function(){
        //Ajax hit on search page
        currReqObj = $.ajax({
          url: $form.attr('action'),
          data: {
            type: 'product',
            view: 'json',
            q: term,
            options:{
              prefix:'last'
            }
          },
          dataType: "json",
          success: function(data){
            $('.note').remove();
            if(data.results_total == 0) {
              //No results
              $resultsBox.html('<div class="note">'+searchNoResultText+'</div>');
              $('.Search_loader').hide();                  
              $('.header_icon_search').show();
              $('.recent-search-list').removeClass('ActiveSearch');

            } else {
              //Numerous results
              $resultsBox.empty();
              var $row='';
		
              if(_drawer != 'small_search '){
                $row += '<h5>Products</h5>';
              }
              $.each(data.results, function(index, item){
                $row +=item.itemHtml;
                //$row.append('<div class="d-price">'+Shopify.formatMoney(item.price, "")+'</div></div>`;


                if(index==0){
                  if (retrievedSearch_v.includes(item.handle) === false){
                    retrievedSearch_v.push(item.handle);
                  }
                }
                if(index == 6){
                  return false;

                }

              });
              $resultsBox.html($row);

              localStorage.setItem("Recent_search", JSON.stringify(retrievedSearch_v));                          
              $('.searc-item-box').wrapAll( "<div class='result-list' />" );                         	                          
              //$('<div class="rightsearch"><p>This is collection</p></div>').insertAfter(".leftsearch");                           
              $resultsBox.append('<a href="' + linkURL + '" class="note">'+searchAllResultText+'</a>');
              $('.Search_loader').hide();                  
              $('.header_icon_search').show();
              $('.recent-search-list').addClass('ActiveSearch');

            }


          }


        });
      }, searchTimeoutThrottle);
    } else if ($(this).val().length <= 2) {
      //Deleted text? Clear results
      $resultsBox.empty();
      $('#recent-search-list').html('');
    }
  }).attr('autocomplete', 'off').data('oldval', '').bind('focusin', function(){
    //Focus, show results
    $resultsBox.fadeIn(200);
  }).bind('click', function(e){
    //Click, prevent body from receiving click event
    e.stopPropagation();
  });

  $('body').bind('click', function(){
    //Click anywhere on page, hide results
    //$resultsBox.fadeOut(200);
  });
  function recentSearch(){
    $('#recent_search_list').html('');
    var recent_Html = '';    
    var showRecent = false;
    setTimeout(function(){ 
      var recent_pro = localStorage.getItem("Recent_search");
      var recent_pro_val = JSON.parse(recent_pro);
      $('.recent-search-list').html(''); 
      if(recent_pro_val==null){  
        $('.recent-search-list').html('');
      }else{
        recent_Html =  recent_Html.concat('<h5 style="">'+searchRecentTitleText+'</h5>');
        recent_Html =  recent_Html.concat('<div class="recent-search-inner mCustomScrollbar"><div id="mCSB_9_container" class="mCSB_container mCS_x_hidden mCS_no_scrollbar_x"><ul class="search-recent-list">'); 
        var Prev_search =recent_pro_val.reverse();
        $.each(Prev_search, function(index, value){ 
          var productUrl='';
          if(rootUrl.length>1){
          productUrl=rootUrl;
          }
          if(index<10){
            var getV = value;
            jQuery.ajax({
              type: 'GET',
              url: productUrl+'/products/' + value + '.json',
              success: function(response) {
                
                showRecent = true;
               var product =response.product;
                var imgSrc = '//cdn.shopify.com/s/files/1/0621/2144/3546/t/6/assets/placeholder.svg?v=17835974354398285907';
                if(product.image){
                  imgSrc = product.image.src;
                }
                recent_Html +=`<li><a href="${productUrl}/products/${product.handle}" title="${product.title}">
				<span><img src="${imgSrc}"></span>${truncate(product.title,2)}</a></li>`;     
              },
              error: function(error) {
                console.log("Error: "+ error);
              }
            });
            
          } 
        });  
        $(document).ajaxStop(function(){
        recent_Html =  recent_Html.concat('</ul></div></div>'); 
          if(showRecent){
        $('#recent_search_list').html(recent_Html);
          }
        });

      }

      //   $('.recent-search-inner').mCustomScrollbar({ theme:"light", axis:"x"});
    }, 500);
  }
  //Search box should mimic live search string: products only, partial match
  $('.search-form, #search-form').on('submit', function(e){
    e.preventDefault();
    var term = '*' + $(this).find('input[name="q"]').val() + '*';
    var linkURL = $(this).attr('action') + '?q=' + term+'&options%5Bprefix%5D=last';
    window.location = linkURL;
  });

  $('body').on('click', '.HeaderProClose', function(e){
    e.preventDefault();

    $('body').removeClass('addsearch');
    $('input.form-control.search-input').val('');
    $resultsBox.empty();   
  });


  // search ends
});