
var elements = document.getElementsByClassName('productImageSlideItem');

var thumbs = document.getElementsByClassName('productThumbImage');
console.log(elements)

function checkVisible(elm) {
  var rect = elm.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}
function visibleElement(){
 Array.from(elements).forEach(function(item) {
   
          console.log(item)
        if (checkVisible(item)) {
            Array.from(thumbs).forEach(function(thumb) {
                thumb.classList.remove('active');
            });
            const relatedThumb = document.querySelector('[href="#'+item.id+'"]');
            relatedThumb.classList.add('active');
        }
    });
}
visibleElement()

window.onscroll = function() {
   visibleElement()
};