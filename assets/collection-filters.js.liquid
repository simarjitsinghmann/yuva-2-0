(function () {

  function collectionFilters(){  
    new dualRangeSlider(document.querySelector(".dual-range"));
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
}
	
window.addEventListener('DOMContentLoaded', () => {
                        new dualRangeSlider(document.querySelector(".dual-range"))
})
class dualRangeSlider {
  constructor(rangeElement) {
    this.range = rangeElement
    this.min = Number(rangeElement.dataset.min)
    this.max = Number(rangeElement.dataset.max)
    this.handles = [...this.range.querySelectorAll(".handle")]
    this.handlesLeft = [...this.range.querySelectorAll(".handle.left")[0].dataset.value]
    this.handlesRight = [...this.range.querySelectorAll(".handle.right")[0].dataset.value]
    if(this.handlesLeft){
    this.min =Number(this.handlesLeft)
    }
    if(this.handlesRight){
    this.max = Number(this.handlesRight)
    
    }
    this.startPos = 0;
    this.activeHandle;
    this.handles.forEach(handle => {
      handle.addEventListener("mousedown", this.startMove.bind(this))
      handle.addEventListener("touchstart", this.startMoveTouch.bind(this))
    })

    window.addEventListener("mouseup", this.stopMove.bind(this))
    window.addEventListener("touchend", this.stopMove.bind(this))
    window.addEventListener("touchcancel", this.stopMove.bind(this))
    window.addEventListener("touchleave", this.stopMove.bind(this))

    const rangeRect = this.range.getBoundingClientRect();
    const handleRect = this.handles[0].getBoundingClientRect()
    this.range.style.setProperty("--x-1", "0px");
    this.range.style.setProperty("--x-2", rangeRect.width - handleRect.width/2 + "px");
    this.handles[0].dataset.value = this.range.dataset.min;
    this.handles[1].dataset.value = this.range.dataset.max;
  }

  startMoveTouch(e) {
    const handleRect = e.target.getBoundingClientRect()
    this.startPos = e.touches[0].clientX - handleRect.x;
    this.activeHandle = e.target;
    this.moveTouchListener = this.moveTouch.bind(this)
    window.addEventListener("touchmove", this.moveTouchListener);
  }

  startMove(e) {
    this.startPos = e.offsetX;
    this.activeHandle = e.target;
    this.moveListener = this.move.bind(this)
    window.addEventListener("mousemove", this.moveListener);
  }

  moveTouch(e) {
    this.move({clientX: e.touches[0].clientX})
  }

  move(e) {
    const isLeft = this.activeHandle.classList.contains("left")
    const property = isLeft ? "--x-1" : "--x-2";
    const parentRect = this.range.getBoundingClientRect();
    const handleRect = this.activeHandle.getBoundingClientRect();
    let newX = e.clientX - parentRect.x - this.startPos;
    if(isLeft) {
      const otherX = parseInt(this.range.style.getPropertyValue("--x-2"));
      newX = Math.min(newX, otherX - handleRect.width)
      newX = Math.max(newX, 0 - handleRect.width/2)
    } else {
      const otherX = parseInt(this.range.style.getPropertyValue("--x-1"));
      newX = Math.max(newX, otherX + handleRect.width)
      newX = Math.min(newX, parentRect.width - handleRect.width/2)
    }
    this.activeHandle.dataset.value = this.calcHandleValue((newX + handleRect.width/2) / parentRect.width)
    this.range.style.setProperty(property, newX + "px");

  }

  calcHandleValue(percentage) {
    return Math.round(percentage * (this.max - this.min) + this.min)
  }

  stopMove() {
    window.removeEventListener("mousemove", this.moveListener);
    window.removeEventListener("touchmove", this.moveTouchListener);
  }
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