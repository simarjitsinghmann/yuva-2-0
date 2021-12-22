
var elements = document.getElementsByClassName('productImageSlideItem');

var thumbs = document.getElementsByClassName('productThumbImage');


window.addEventListener('scroll', function(event){
  findVisibleItems();
});

function findVisibleItems(){
  Array.from(elements).forEach(function(item) {
    if (isOnScreen(item)) {
      thumbs = document.getElementsByClassName('productThumbImage');
      Array.from(thumbs).forEach(function(thumb) {
        thumb.classList.remove('active');
      });
      const relatedThumb = document.querySelectorAll('[href="#'+item.id+'"]')[0];
      relatedThumb.classList.add('active');
    }
  });
}
findVisibleItems()
