
var elements = document.getElementsByClassName('productImageSlideItem');

var thumbs = document.getElementsByClassName('productThumbImage');

window.onscroll = function() {
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
};

function checkVisible(elm) {
    var rect = elm.getBoundingClientRect();
    var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
  	console.log()
    return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}