
var elements = document.getElementsByClassName('productImageSlideItem');

var thumbs = document.getElementsByClassName('productThumbImage');
console.log(elements)

 isInViewport = function (elem) {
    var bounding = elem.getBoundingClientRect();
    return (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};
function visibleElement(){
 Array.from(elements).forEach(function(item) {   
        if (isInViewport(item)) {
          console.log(item)
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