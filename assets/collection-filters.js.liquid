(function () {

  function collectionFilters(){  
    var section = document.getElementById('CollectionProductsContainer')
    var sectionId = document.getElementById('CollectionProductsContainer').dataset.id;
    const filterForm = document.getElementById('CollectionFiltersForm'); 
    var inputs = filterForm.querySelectorAll('input[type=checkbox]');
    Array.from(inputs).forEach(function(input) {
      input.addEventListener("click", ()=>{	
                             getFilterData(filterForm,input,sectionId)
    });
  });  
  var accordions = filterForm.querySelectorAll('.br_more_filter');
    Array.from(accordions).forEach(function(accordion) {
      accordion.addEventListener("click", ()=>{	   
                                 if(accordion.classList.contains('show')){
        accordion.classList.remove('show');
        accordion.previousSibling.classList.remove('show')
        accordion.innerHTML='<i class="fa fa-plus"></i> Show more';
        accordion.classList.add('hide'); 
      }else{	
        accordion.classList.remove('hide');
        accordion.previousSibling.classList.add('show')
        accordion.innerHTML='<i class="fa fa-minus"></i> Show less';
        accordion.classList.add('show');
      }
    });
  });  
  
  
  var layouts = section.querySelectorAll('a.btn-layout');
    Array.from(layouts).forEach(function(layout) {
      layout.addEventListener("click", ()=>{	
                              var _thisLayout = layout.dataset.value;
                              section.setAttribute('data-view',_thisLayout)
    });
  }); 
  var prices = filterForm.querySelectorAll('input[type=number]');
  Array.from(prices).forEach(function(price) {
    price.addEventListener("change", ()=>{	
                           getFilterData(filterForm,price,sectionId)
  });
});   

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
var priceRange = section.querySelectorAll('input[type="range"]');
Array.from(priceRange).forEach(function(price) {
  price.addEventListener("change", (e)=>{	
    e.preventDefault();
    rangeInputChangeEventHandler(price)
    
//     getFilterData(filterForm,price,sectionId);
  });
});

   
}

function rangeInputChangeEventHandler(e){

  var minBtn = e.closest('rangeslider').querySelectorAll('.min'),
      maxBtn = e.closest('rangeslider').querySelectorAll('.max'),
      range_min = $(this).parent().children('.range_min'),
      range_max = $(this).parent().children('.range_max'),
      minVal = parseInt($(minBtn).val()),
      maxVal = parseInt($(maxBtn).val()),
      origin = $(this).attr('class');
 console.log(rangeGroup,minBtn,maxBtn,range_min,range_max,minVal,maxVal,origin)
  if(origin === 'min' && minVal > maxVal-5){
    $(minBtn).val(maxVal-5);
  }
  var minVal = parseInt($(minBtn).val());
  $(range_min).html(minVal);

  $('input[name="filter.v.price.gte"]').val(minVal);


  if(origin === 'max' && maxVal-5 < minVal){
    $(maxBtn).val(5+ minVal);
  }
  var maxVal = parseInt($(maxBtn).val());
  $(range_max).html(maxVal);
  $('input[name="filter.v.price.lte"]').val(maxVal)
  $('input[name="filter.v.price.gte"]').trigger('change')
  $('input[name="filter.v.price.lte"]').trigger('change')
}

  function fetchFilterData(url){
    return fetch(url)
    .then(response => response.text())
  }
   function getFilterData(filterForm,input,sectionId,remove){    	
      const formData = new FormData(filterForm);
      var searchParameters = new URLSearchParams(formData).toString();
     
     var url = window.location.pathname+'?section_id='+sectionId+'&'+searchParameters;
     if(remove){
       url =remove;
     }
     //         var _url = window.location.pathname+'?'+searchParameters;
     //      window.location.href=_url;
     const html = fetchFilterData(url).
     then((responseText) => {
       const resultData = new DOMParser().parseFromString(responseText, 'text/html');
       var itemResultCount = resultData.getElementsByClassName('filter-total-result');
       document.getElementById('CollectionProductsContainer').innerHTML = resultData.getElementById('CollectionProductsContainer').innerHTML;
       var _url = window.location.pathname+'?'+searchParameters;
       history.pushState({}, null, _url);
//        var focusedElement =document.getElementById(input.getAttribute('id'));
//        focusedElement.scrollIntoView()
       collectionFilters();
     });
    }
  collectionFilters();
}());