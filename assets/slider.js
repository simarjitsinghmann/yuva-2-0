
var elements = document.getElementsByClassName('productImageSlideItem');

var thumbs = document.getElementsByClassName('productThumbImage');
function thumbnails(){
  Array.from(elements).forEach(function(item) {
    if (checkVisible(item)) {
      Array.from(thumbs).forEach(function(thumb) {
        thumb.classList.remove('active');
      });
      const relatedThumb = document.querySelectorAll('[href="#'+item.id+'"]')[0];
      relatedThumb.classList.add('active');
      return false;
    }
  });
}
function checkVisible(elm) {
  var bounding = elm.getBoundingClientRect();
  //     var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
  //   	  var bounding = elem.getBoundingClientRect();
  return (
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
window.onscroll = function() {
  thumbnails();
};
thumbnails();
