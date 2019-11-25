import { TOKEN } from '../constants';
import queryString from 'query-string';
import store from '../store';
import Blocker from './Blocker';

// TODO check if quality params work
export function embedVideoParams() {
  browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // TODO move to separate js
    if (request.message === 'oembed') {
      fetch(request.options.oembedUrl)
        .then(res => {
          return res.json();
        })
        .then(json => {
          sendResponse(json);
        })
        .catch(function(error) {
          console.log('oembed error', error);
        });
    }
    return true;
  });

  const action = details => {
    let response = {};
    // ensure it's an iframe
    if (details.type === 'sub_frame') {
      let url = new URL(details.url);
      let originalSearch = url.search;
      let params = queryString.parse(url.search);

      switch (url.hostname) {
        case 'www.youtube.com':
        case 'youtube.com':
          if (store.getters.video_attributes) {
            params.loop = 0;
            params.rel = 0;
            params.lowweb === TOKEN ? (params.autoplay = 1) : (params.autoplay = 0);
          }
          // vq (small/medium) doesn't work
          break;
        case 'player.twitch.tv':
          if (store.getters.video_attributes) {
            params.loop = false;
            params.lowweb === TOKEN ? (params.autoplay = true) : (params.autoplay = false);
          }
          // quality (low/medium) doesn't work
          break;
        case 'www.dailymotion.com':
        case '*.dailymotion.com':
          if (store.getters.video_attributes) {
            params.lowweb === TOKEN ? (params.autoplay = true) : (params.autoplay = false);
            params.loop = false;
            params['queue-enable'] = false;
          }
          // quality (240/380) doesn't work
          break;
        case 'player.vimeo.com':
          if (store.getters.video_attributes) {
            params.lowweb === TOKEN ? (params.autoplay = true) : (params.autoplay = false);
            params.loop = false;
          }
          switch (store.getters.video_quality) {
            case 1:
              params.quality = '240p';
              break;
            case 2:
              params.quality = '360p';
              break;
            case 3:
              params.quality = '540p';
              break;
          }
          break;
        // TODO
        // case "facebook" data-autoplay=true/false
      }
      let newSearch = queryString.stringify(params);
      originalSearch = originalSearch.slice(1);
      if (originalSearch !== newSearch) {
        url.search = newSearch;
        response.redirectUrl = url.href;
      } else {
        if (store.getters.video_clicktoload) {
          if (params.lowweb !== TOKEN) {
            response.cancel = true;
          }
        }
      }
    }
    return response;
  };

  const filter = {
    urls: ['*://*.youtube.com/embed/*', '*://player.vimeo.com/*', '*://*.dailymotion.com/embed/*', '*://player.twitch.tv/?*', '*://*.facebook.com/plugins/video.php*'],
  };
  Blocker.filterRequest(action, filter);
}
/*
https://www.youtube.com/embed/XO4q9oVrWWw?autoplay=0&rel=0&loop=0&vq=small|medium|large  //240, 360, 540
https://player.vimeo.com/video/76979871?autoplay=false&loop=false&quality=360p|540p
https://www.dailymotion.com/embed/video/x78ibyg?autoplay=0&queue-enable=false&quality=240|380|480
https://player.twitch.tv/?channel=3ventic&autoplay=false&quality=low|medium
*/
