findVisibleItems();

window.addEventListener('resize', function(event){
  findVisibleItems();
});

function findVisibleItems(){
  
var elements = document.getElementsByClassName('productImageItem');

var thumbs = document.getElementsByClassName('productThumbImage');

  window.addEventListener('scroll', function(event){
    Array.from(elements).forEach(function(item) {
      if (isOnScreen(item)) {
        thumbs = document.getElementsByClassName('productThumbImage');
        Array.from(thumbs).forEach(function(thumb) {
          thumb.classList.remove('active');
        });
        var relatedThumb = document.querySelector('.productThumbImage[href="#'+item.id+'"]');
        if(relatedThumb){
        relatedThumb.classList.add('active');
        }
      }
    });

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