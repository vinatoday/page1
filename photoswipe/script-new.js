


//====================================================================================
function strToInt(s)  {var num= parseInt(s);  return (num+''=='NaN')? 0:num;}
function $(el) {
	var items= document.querySelectorAll(el); 
	var len= items.length;
	var map= function(f) {for (var i=0; i<len; i++) f(i,items[i])};
	items.map= map;
	items.addclass=  function(s) {map(function(i,el){if (!el.classList.contains(s)) el.classList.add(s)})};
	items.addclick=  function(f) {map(function(i,el){el.onclick= f})};
	items.add2click= function(f) {map(function(i,el){el.ondblclick= f})};
	return items;
}

function add_photoswipe_elements(){
	document.write('<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true"><div class="pswp__bg"></div><div class="pswp__scroll-wrap"><div class="pswp__container"><div class="pswp__item"></div><div class="pswp__item"></div><div class="pswp__item"></div></div><div class="pswp__ui pswp__ui--hidden"><div class="pswp__top-bar"><div class="pswp__counter"></div><button class="pswp__button pswp__button--close" title="Close (Esc)"></button><button class="pswp__button pswp__button--share" title="Share"></button><button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button><button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button><div class="pswp__preloader"><div class="pswp__preloader__icn"><div class="pswp__preloader__cut"><div class="pswp__preloader__donut"></div></div></div></div></div><div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap"><div class="pswp__share-tooltip"></div></div><button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button><button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button><div class="pswp__caption"><div class="pswp__caption__center"></div></div></div></div></div>');
}


function complete_photoswipe() {
	if ($(".pswp").length>0) return; //đã có
	var images= $("figure img"); if (images.length<1) return;
	add_photoswipe_elements(); //add html elements class="pswp"
	var pswpElement= $(".pswp")[0];
	var items=[];
	
	
	function initPhotoSwipe(){ //add click for <img>
		var imgIndex= strToInt(event.target.getAttribute("data-index")); // = first image
		var options= {
			index: imgIndex, // start at first slide
			getThumbBoundsFn: function (index) {
				// get window scroll Y, optionally get horizontal scroll
				var pageYScroll = window.pageYOffset || document.documentElement.scrollTop;

				// get position of element relative to viewport
				var thumbnail= images[index];
				var rect= thumbnail.getBoundingClientRect();

				// w = width
				return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };

				// Good guide on how to get element coordinates:
				// http://javascript.info/tutorial/coordinates
			}
		};
		var gallery= new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
		gallery.init();
	}
	
	
	images.map(function(i,el){
		el.onclick= initPhotoSwipe;
		el.setAttribute("data-index",i);
		
		var caption= el.parentElement.querySelector("figcaption"); caption= caption? caption.textContent : "";
		var img=  el.getAttribute("data-original"); if (!img) img= el.src;
		items[i]= {
			src: img,
			w: el.getAttribute("data-width"),
			h: el.getAttribute("data-height"),
			title: caption
		};
	});
}