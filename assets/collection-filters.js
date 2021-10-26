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
                                 console.log(accordion.classList)
                                 if(accordion.classList.contains('')){
                                console.log('aaa',accordion)
        accordion.classList.remove('show');
        accordion.previousSibling.classList.remove('show')
        accordion.classList.add('hide'); 
        accordion.innerHTML='<i class="fa fa-plus"></i> Show more';
                                 console.log(accordion.classList)
      }else{
      	console.log('11',accordion)		
        accordion.classList.remove('hide');
        accordion.classList.add('show');
        accordion.previousSibling.classList.add('show')
        accordion.innerHTML='<i class="fa fa-minus"></i> Show less';
                                 console.log(accordion.classList)
                                 console.log(accordion.classList)
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
}
// function removeClassFromAll(array){
// 	Array.from(array).forEach(function(value) {
//       value.classList.remove('active');
//   }); 
// }
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