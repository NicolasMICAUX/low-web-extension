import store from '../../store';
import LazyLoad from 'vanilla-lazyload'

let lazyloadSupported = false
if ('loading' in HTMLImageElement.prototype) { 
  lazyloadSupported = true
} else {
  // Fetch and apply a polyfill/JavaScript library
  // for lazy-loading instead.
}
// lazyloadSupported = false

// TODO
// doesn't work, try to block images without a unique key
export default function(){

  const IMAGE_LAZYLOAD = store.getters.image_lazyload
  const IFRAME_LAZYLOAD = store.getters.iframe_lazyload

  console.log('LOWWEB >>>>>>>>>> lazyload')

  if( lazyloadSupported ){

    if( IMAGE_LAZYLOAD ){ 
      let imgs = document.querySelectorAll('img')
      imgs.forEach((img)=>{
        if( ! isAlreadyLazied( img ) ){
          img.loading = 'lazy'
        }
      })
    }

    if( IFRAME_LAZYLOAD ){ 
      let iframes = document.querySelectorAll('iframe')
      iframes.forEach((iframe)=>{
        if( ! isAlreadyLazied( iframe ) ){
          iframe.loading = 'lazy'
        }
      })
    }

  }else{

    if( IMAGE_LAZYLOAD ){ 
      let imgs = document.querySelectorAll('img')
      imgs.forEach((img)=>{
        if( ! isAlreadyLazied( img ) ){
          if( img.src ){
            img.dataset.lowsrc = img.src
          }
          if( img.srcset ){
            img.dataset.lowsrcset = img.srcset
          }
          img.removeAttribute('src')
          img.removeAttribute('srcset') 
        }
      })
    }

    if( IFRAME_LAZYLOAD ){ 
      let iframes = document.querySelectorAll('iframe:not([data-src])')
      iframes.forEach((iframe)=>{
        if( ! isAlreadyLazied( iframe ) ){
          if( iframe.src ){
            iframe.dataset.lowsrc = iframe.src
          }
          iframe.removeAttribute('src')
        }
      })
    }    

    var lazyLoadInstance = new LazyLoad({
      elements_selector: "[data-lowsrc]",
      data_src: 'lowsrc',
      data_srcset: 'lowsrcset',
      threshold: 0
    });

  }
   
}

function isAlreadyLazied( el ){
  if( el.dataset.src || el.dataset.lowsrc || el.dataset['lazy-src'] ){
    console.log('isAlreadyLazied')
    return true
  }else{
    return false
  }
}