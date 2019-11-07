import store from '../../store'

export default function(){
  if( store.getters.video_attributes ){
    // TODO test with sources
    // TODO add button play
    let videos = document.querySelectorAll('video')
    videos.forEach((item)=>{
      // item.preload = 'none' // TODO
      item.removeAttribute('autoplay');
      item.removeAttribute('loop');
    }) 
  }
}