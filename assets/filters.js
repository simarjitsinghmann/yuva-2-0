(function () {
  function changeGridLayout(){
    var parent = document.getElementById('CollectionProductsContainer');
    if(parent){
      if(window.innerWidth < 768){
        parent.setAttribute("data-view", "grid-layout-2")
      }
      else if(window.innerWidth >= 768 && window.innerWidth < 1200 ){
        parent.setAttribute("data-view", "grid-layout-3")
      }
      else if(window.innerWidth >= 1200 && window.innerWidth < 1440 ){
        parent.setAttribute("data-view", "grid-layout-4")
      }
      else if(window.innerWidth >= 1441  ){
        parent.setAttribute("data-view", "grid-layout-5")
      }
    }
  }

  function hideShowFilters(){
    var filterHeading = document.getElementById('filterHeading');
    var filters = document.getElementById('filterSideBar');
    if(window.innerWidth < 768){
      filterHeading.addEventListener("click", ()=>{	
                                     filters.classList.add('active')
      document.querySelector('body').classList.add('open-filter-sort');
    });
    var cancelFiltes = document.getElementById('cancelFilters');
    cancelFiltes.addEventListener("click", ()=>{	
                                  filters.classList.remove('active')
    document.querySelector('body').classList.remove('open-filter-sort');
  });
}
 }

 window.addEventListener('load', (event) => {
  changeGridLayout();
  hideShowFilters();
  applyFilters();
  sortBy()
});
window.addEventListener('resize', function(event){
//   changeGridLayout();
  applyFilters();
  
  hideShowFilters()
});

function sortBy(){
  var sortMenu = document.getElementById('sort__list_label');
  if(sortMenu){
    sortMenu.addEventListener("click", (e)=>{	
      e.preventDefault();
      var sortMenu = document.getElementById('sort__list');
      if(sortMenu.classList.contains('active')){       
        sortMenu.classList.remove('active');
        if(window.innerWidth > 767){
          DOMAnimations.slideUp(sortMenu);
        }
        else{
          document.querySelector('body').classList.remove('open-filter-sort');
        }
      }
      else{
        sortMenu.classList.add('active');
        if(window.innerWidth > 767){
          DOMAnimations.slideDown(sortMenu);
        }
        else{
          document.querySelector('body').classList.add('open-filter-sort');
        }
      }
    });
  }
  var closeSortMenu = document.querySelector('.close-mobile-sort');
  if(closeSortMenu){
    closeSortMenu.addEventListener("click", (e)=>{	
      e.preventDefault();
      var sortMenu = document.getElementById('sort__list');
      if(window.innerWidth < 768){
        console.log(sortMenu)
        sortMenu.classList.remove('active');
        document.querySelector('body').classList.remove('open-filter-sort');
        //         }
      }
    });
  }
}
function applyFilters(){ 
  var section = document.getElementById('CollectionProductsContainer');
  if (section){
    
    var sectionId = section.dataset.id;
    const filterForm = document.getElementById('FiltersForm'); 

    var accordions = filterForm.querySelectorAll('.br_more_filter');
    Array.from(accordions).forEach(function(accordion) {
      accordion.addEventListener("click", ()=>{
                                 var showMore = accordion.querySelector('.showMore');
      var showLess = accordion.querySelector('.showLess');
      if(accordion.parentNode.classList.contains('show')){
        accordion.parentNode.classList.remove('show');       
        DOMAnimations.slideUp(accordion.parentNode.querySelector('.more-options'));
        DOMAnimations.slideUp(showLess);
        DOMAnimations.slideDown(showMore);
      }else{	
        accordion.parentNode.classList.add('show')
        DOMAnimations.slideDown(accordion.parentNode.querySelector('.more-options'));
        DOMAnimations.slideUp(showMore);
        DOMAnimations.slideDown(showLess);
      }
    });
  });  

 	showMultipleOptions = function(){
    var showOptions = document.getElementsByClassName('showOptions');
    if(showOptions){		
      Array.from(showOptions).forEach(function(option) {
        option.addEventListener("click", ()=>{	
                                hideOptions();
        var product = option.getAttribute("data-product");
        document.getElementById(product).style.display="block";
      });
    });
  }

  var closeOptions = document.getElementsByClassName('close-product-wrap');
  if(closeOptions){		
    Array.from(closeOptions).forEach(function(option) {
      option.addEventListener("click", ()=>{
                              var product = option.getAttribute("data-product");
      document.getElementById(product).style.display="none";
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
	showMultipleOptions(); 

    var layouts = section.querySelectorAll('a.btn-layout');
    Array.from(layouts).forEach(function(layout) {
      layout.addEventListener("click", ()=>{	
                              var _thisLayout = layout.dataset.value;
                              section.setAttribute('data-view',_thisLayout)
    });
    }); 

 
    var priceRangeBars = filterForm.querySelectorAll('.mall-slider-handles');
    Array.from(priceRangeBars).forEach(function(rangeBar) {
      var el = rangeBar;
      var sliderEventListener ='';
      if(el.noUiSlider) {
        sliderEventListener = el.noUiSlider;
      }else{
      sliderEventListener = noUiSlider.create(el, {
        start: [el.dataset.start, el.dataset.end],
        connect: true,
        tooltips: false,
        range: {
          min: [parseInt(el.dataset.min)],
          max: [parseInt(el.dataset.max)]
        }
      });
      }
      if(window.innerWidth > 767){
        sliderEventListener.on('change',  function(values){
          getFilterData(filterForm,rangeBar,sectionId);
        })
      }
      sliderEventListener.on("update", function(values){
        var minVal =  parseInt(values[0]);
        var newformatMoney = moneyFormat;
        section.querySelectorAll('input[name="filter.v.price.gte"]')[0].value = minVal;
        section.querySelector('[data-min-value]').innerHTML =  Shopify.formatMoney(minVal*100,moneyFormat);
        var maxVal =  parseInt(values[1]);
        section.querySelectorAll('input[name="filter.v.price.lte"]')[0].value = maxVal;
        section.querySelector('[data-max-value]').innerHTML = Shopify.formatMoney(maxVal*100,moneyFormat);
      })
    })


    if(window.innerWidth > 767){

      var prices = filterForm.querySelectorAll('input[type=number]');
      Array.from(prices).forEach(function(price) {
        price.addEventListener("change", ()=>{	
                               getFilterData(filterForm,price,sectionId)
      });
    });  

    var inputs = filterForm.querySelectorAll('input[type=checkbox]');
    Array.from(inputs).forEach(function(input) {
      input.addEventListener("click", ()=>{	
                             getFilterData(filterForm,input,sectionId)
    });
    });
}
    else{
      filterForm.addEventListener("submit", (e)=>{
        e.preventDefault();
        getFilterData(filterForm,filterForm,sectionId)
      });
    }

var sortBy = section.querySelectorAll('[name="sort_by"]');
Array.from(sortBy).forEach(function(sort) {
  sort.addEventListener("click", ()=>{	
                        
                        document.querySelector('body').classList.remove('open-filter-sort');
  getFilterData(filterForm,sort,sectionId);
});
});   
var removeFilters = section.querySelectorAll('a.select-item');
Array.from(removeFilters).forEach(function(removeFilter) {
  removeFilter.addEventListener("click", (e)=>{	
    e.preventDefault();
    var _url = removeFilter.getAttribute('href');
    getFilterData(filterForm,removeFilter,sectionId,_url);
  });
}); 
}
}

function fetchFilterData(url){
  return fetch(url)
  .then(response => response.text())
}
function getFilterData(filterForm,input,sectionId,remove){   
  document.getElementById('CollectionProductsContainer').querySelector('.filteredData').classList.add('filtering')
  const formData = new FormData(filterForm);
  var searchParameters = new URLSearchParams(formData).toString();

  var url = window.location.pathname+'?section_id='+sectionId+'&'+searchParameters;
  var _updateUrl = window.location.pathname+'?'+searchParameters;
  if(remove){
    url =remove;
    _updateUrl = remove;
  }
  const html = fetchFilterData(url).
  then((responseText) => {
    const resultData = new DOMParser().parseFromString(responseText, 'text/html');
    var itemResultCount = resultData.getElementsByClassName('filter-total-result');
    document.getElementById('CollectionProductsContainer').innerHTML = resultData.getElementById('CollectionProductsContainer').innerHTML;
    applyFilters();
    history.pushState({}, null, _updateUrl);
  });
}
}());


// Shortcircuit variable
let triggered = false;

function ScrollExecute() {
  // Locate loadmore button
  let moreButon = $('#more').last();
  
  // Get URL from the loadmore button
  let nextUrl = $(moreButon).find('a').attr("href");
  console.log(moreButon,nextUrl)
  // Button position when AJAX call should be made one time
  if (((moreButon.offset().top - $(window).scrollTop()) < 800) && (triggered == false)) {
  
    // Trigger shortcircuit to ensure AJAX only fires once
    triggered = true;

    // Make ajax call to next page for load more data
    $.ajax({
      url: nextUrl,
      type: 'GET',
      beforeSend: function() {
        moreButon.remove();
      }
    })
    .done(function(data) {
      // Append data
      $('.product').append($(data).find('.product').html());

      // On success, reset shortcircuit
      triggered = false
    });
  }
}

$(document).ready(function () {
  $(window).scroll(function(){
    ScrollExecute();
  });
});
