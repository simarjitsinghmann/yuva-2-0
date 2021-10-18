$(document).ready(function(){
    $('.search-input').bind('focusin focusout', function(e){
        $(this).closest('.search-box').toggleClass('focus', e.type == 'focusin');
    });
     
    /// AjaX Product Search
    var preLoadLoadGif = '<img src="//cdn.shopify.com/s/files/1/0597/9668/5009/t/6/assets/product_loader.gif?v=17847446914558565873" style="width: 100%;" />';
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
          	var term = '*' + $form.find('input[name="q"]').val() + '*';
            
            //URL for full search page
            var linkURL = $form.attr('action') + '?type=product&q=' + term;
            
            //Show loading
            $resultsBox.html('<div class="load">'+preLoadLoadGif+'</div>');
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
                  },
                  dataType: "json",
                  success: function(data){
                        currReqObj = null;
                        $('.note').remove();
                        if(data.results_total == 0) {
                            //No results
                            $resultsBox.html('<div class="note">No result found.</div>');
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
                                $row +=`<a href="${item.url}" class="searc-item-box">
                                <div class="img"><img src="${item.thumb}" /></div>
                                <div class="title_price">
                                <div class="d-title">${item.title}</div>
                                <div class="d-price">${Shopify.formatMoney(item.price, moneyFormat)}</div></div></a>`;
                                //$row.append('<div class="d-price">'+Shopify.formatMoney(item.price, "")+'</div></div>`;
                                
                               
                                if(index==0){
                                if (retrievedSearch_v.includes(item.title+'__'+item.handle+'__'+item.thumb) === false){
                                    retrievedSearch_v.push(item.title+'__'+item.handle+'__'+item.thumb);
                                }
                                }
                                if(index == 5){
                                    return false;

                                }
                                
                            });
                            $resultsBox.html($row);
                          
                          
                            localStorage.setItem("Recent_search", JSON.stringify(retrievedSearch_v));                          
                          	$('.searc-item-box').wrapAll( "<div class='result-list' />" );                         	                          
                            //$('<div class="rightsearch"><p>This is collection</p></div>').insertAfter(".leftsearch");
                            console.log(_drawer,$('.search-bar-box.search-box'))
                            if(_drawer == 'small_search'){
                                console.log('tetete')
                                $('.search-bar-box.search-box').append('<a href="' + linkURL + '" class="note">See all Results </a>');
                            }
                            else{
                                $resultsBox.append('<a href="' + linkURL + '" class="note">See all Results </a>');
                            }
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
  
  $('body').on('focus', '.search-box .search-input', function(){
    $('#recent_search_list').html('');
    var recent_Html = '';
    setTimeout(function(){ 
    var recent_pro = localStorage.getItem("Recent_search");
                    var recent_pro_val = JSON.parse(recent_pro);
                           $('.recent-search-list').html(''); 
                              if(recent_pro_val==null){  
                                    $('.recent-search-list').html('');
                                   }else{
                                      recent_Html =  recent_Html.concat('<h5 style="">Recent Search</h5>');
                                      recent_Html =  recent_Html.concat('<div class="recent-search-inner mCustomScrollbar" style="max-width:750px;overflow-x:auto;"><div id="mCSB_9_container" class="mCSB_container mCS_x_hidden mCS_no_scrollbar_x" style="position: relative; top: 0px; left: 0px; width: 100%;" dir="ltr"><ul style=" display: flex; align-items: center; list-style: none;">'); 
                                    var Prev_search =recent_pro_val.reverse();
                                     $.each(Prev_search, function(index, value){   
                                       if(index<10){
                                     var getV = value.split("__");
                                      var Title = getV[0];
                                       if(Title.length > 10){
                                          var Title = Title.substring(0,10) + '..';
                                       }else{
                                       var Title = getV[0];
                                       }
                                       
                                     recent_Html =  recent_Html.concat('<li><a href="/products/'+getV[1]+'" title="'+getV[0]+'"><span><img src="'+getV[2]+'"></span>'+Title+'</a></li>');                                      
                                       } 
                                     });  
                                      recent_Html =  recent_Html.concat('</ul></div></div>'); 
                                     $('#recent_search_list').html(recent_Html);

                                   }
      
    //   $('.recent-search-inner').mCustomScrollbar({ theme:"light", axis:"x"});
   }, 500);
  });
    //Search box should mimic live search string: products only, partial match
    $('.search-form, #search-form').on('submit', function(e){
      e.preventDefault();
      var term = '*' + $(this).find('input[name="q"]').val() + '*';
      var linkURL = $(this).attr('action') + '?type=product&q=' + term;
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