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
  var prices = filterForm.querySelectorAll('input[type=number]');
  Array.from(prices).forEach(function(price) {
    price.addEventListener("change", ()=>{	
                           getFilterData(filterForm,price,sectionId)
  });
});   

var sortBy = section.querySelectorAll('select[name="sort_by"]');
Array.from(sortBy).forEach(function(sort) {
  sort.addEventListener("change", ()=>{	
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
     if(remove){
       url =remove;
     }
     //         var _url = window.location.pathname+'?'+searchParameters;
     //      window.location.href=_url;
     const html = fetchFilterData(url).
     then((responseText) => {
       const resultData = new DOMParser().parseFromString(responseText, 'text/html');
       var itemResultCount = resultData.getElementsByClassName('filter-total-result');
       document.getElementById('shopify-section-'+sectionId).innerHTML = resultData.getElementById('shopify-section-'+sectionId).innerHTML;
       var _url = window.location.pathname+'?'+searchParameters;
       history.pushState({}, null, _url);
       console.log(input.getAttribute('id'))
       input.scrollIntoView()
       collectionFilters();
     });
    }
  collectionFilters();
}());