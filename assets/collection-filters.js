(function () {
  function changeGridLayout(){
    var parent = document.getElementById('sectionContainer');
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
});
window.addEventListener('resize', function(event){
  changeGridLayout();
  hideShowFilters();
  collectionFilters();
});
function collectionFilters(){ 
  hideShowFilters();
  
  var section = document.getElementById('sectionContainer')
  var sectionId = section.dataset.id;
  const filterForm = document.getElementById('FiltersForm'); 
    
var accordions = filterForm.querySelectorAll('.br_more_filter');
Array.from(accordions).forEach(function(accordion) {
  accordion.addEventListener("click", ()=>{
                             var showMore = accordion.querySelector('.showMore');
                             var showLess = accordion.querySelector('.showLess');
                             if(accordion.parentNode.classList.contains('show')){
    accordion.parentNode.classList.remove('show')
         showLess.style.display = 'none';
         showMore.fadeIn(500);
  }else{	
    accordion.parentNode.classList.add('show')
         showMore.style.display = 'none';
         showLess.fadeIn(500);
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

var sortMenu = document.getElementById('toolbox-sort');
  sortMenu.addEventListener("click", ()=>{	
  var sortMenu = document.getElementById('sort__list');
  if(sortMenu.classList.contains('active')){
    if(window.innerWidth > 767){
      sortMenu.style.display = 'none';
    }else{
      sortMenu.classList.remove('active');
      document.querySelector('body').classList.remove('open-filter-sort');
    }
  }
  else{

    if(window.innerWidth > 767){
      sortMenu.style.display = 'block';
    }else{
      sortMenu.classList.add('active');
      document.querySelector('body').classList.add('open-filter-sort');
    }
  }
});

var priceRangeBars = filterForm.querySelectorAll('.mall-slider-handles');
Array.from(priceRangeBars).forEach(function(rangeBar) {
  var el = rangeBar;
  var sliderEventListener = noUiSlider.create(el, {
    start: [el.dataset.start, el.dataset.end],
    connect: true,
    tooltips: false,
    range: {
      min: [parseInt(el.dataset.min)],
      max: [parseInt(el.dataset.max)]
    }
  });
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

function fetchFilterData(url){
  return fetch(url)
  .then(response => response.text())
}
function getFilterData(filterForm,input,sectionId,remove){    	
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


    history.pushState({}, null, _updateUrl);
    //        var focusedElement =document.getElementById(input.getAttribute('id'));
    //        focusedElement.scrollIntoView()
    collectionFilters();
  });
}
collectionFilters();
}());

