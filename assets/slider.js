
var elements = document.getElementsByClassName('productImageSlideItem');

var thumbs = document.getElementsByClassName('productThumbImage');

window.onscroll = function() {
   visibleElement()
};
function visibleElement(){
 Array.from(elements).forEach(function(item) {
        if (checkVisible(item)) {
            Array.from(thumbs).forEach(function(thumb) {
                thumb.classList.remove('active');
            });
            const relatedThumb = document.querySelector('[href="#'+item.id+'"]');
            relatedThumb.classList.add('active');
        }
    });
}
function checkVisible(elm) {
  var bounding = elm.getBoundingClientRect();
    return (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}
visibleElement()