/* eslint-disable import/first, indent */
global.browser = require('webextension-polyfill');

import RequestManager from './scripts/background/RequestManager';
import Blocker from './scripts/background/Blocker';
import { blockFiles } from './scripts/background/block/block-files';
import { blockSocial } from './scripts/background/block/block-social';
import { blockFonts } from './scripts/background/block/block-fonts';
// import { blockAds } from './scripts/background/block/block-ads';
import { blockImages } from './scripts/background/block/block-images';
import { saveDataHeader } from './scripts/background/header/save-data';
import { cssAnimation } from './scripts/background/css-animation';
import { embedVideoParams } from './scripts/background/embed-video-params';
import { onMessageOEmbed } from './scripts/background/message/oembed';
/* eslint-enable import/first, indent */

browser.runtime.onInstalled.addListener(port => {
  RequestManager.init();
  Blocker.init();

  blockFiles();
  blockFonts();
  blockSocial();
  blockImages();
  // blockAds();

  embedVideoParams();
  saveDataHeader();
  cssAnimation();
});
browser.runtime.onConnect.addListener(port => {
  onMessageOEmbed(port);
});
