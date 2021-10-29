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
  price.addEventListener("input", (e)=>{	
    e.preventDefault();
    rangeInputChangeEventHandler(price,section)
    
//     getFilterData(filterForm,price,sectionId);
  });
});

   
}

function rangeInputChangeEventHandler(e,section){
console.log('aaa')
  var minBtn = e.closest('.rangeslider').querySelectorAll('.min')[0],
      maxBtn = e.closest('.rangeslider').querySelectorAll('.max')[0],
      minVal = parseInt(minBtn.value),
      maxVal = parseInt(maxBtn.value),
      origin = e.getAttribute('class');
  if(origin === 'min' && minVal > maxVal-5){
    minBtn.value = maxVal-5;
  }


  if(origin === 'max' && maxVal-5 < minVal){
    maxBtn.value = 5+ minVal;
  }
  var minVal =  parseInt(minBtn.value);
  section.querySelectorAll('input[name="filter.v.price.gte"]')[0].value = minVal;
  var maxVal =  parseInt(maxBtn.value);
  section.querySelectorAll('input[name="filter.v.price.lte"]')[0].value = maxVal;
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