
var elements = document.getElementsByClassName('productImageSlideItem');

var thumbs = document.getElementsByClassName('productThumbImage');


window.addEventListener('scroll', function(event){
  findVisibleItems();
});

function findVisibleItems(){
  var visibleThumbs=[];
  Array.from(elements).forEach(function(item) {
    if (isOnScreen(item)) {
      visibleThumbs.push(item.id)
      
    }
  var size = 0;
    if(visibleThumbs.length > 2){
      size = Math.floor(visibleThumbs.length / 2)
    }
  thumbs = document.getElementsByClassName('productThumbImage');
    Array.from(thumbs).forEach(function(thumb) {
      thumb.classList.remove('active');
    });
    const relatedThumb = document.querySelector('.productThumbImage[href="#'+visibleThumbs[size]+'"]');
    
    if(relatedThumb){
      relatedThumb.classList.add('active');
    }
  });
}
findVisibleItems()
function isOnScreen(elem) {
  // if the element doesn't exist, abort
  if( elem.length == 0 ) {
    return;
  }
  var $window = $(window);
  var viewport_top = $window.scrollTop();
  var viewport_height = $window.height();
  var viewport_bottom = viewport_top + viewport_height;
  var $elem = $(elem);
  var top = $elem.offset().top;
  if($(window).width() > 768 ){
    top = top + 400;
  }
  var height = $elem.height();
  var bottom = top + height;

  return (top >= viewport_top && top < viewport_bottom) ||
    (bottom > viewport_top && bottom <= viewport_bottom) ||
    (height > viewport_height && top <= viewport_top && bottom >= viewport_bottom)
}