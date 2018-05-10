import FactoryGuy from 'ember-data-factory-guy';
import moment from 'moment';
import {make} from 'ember-data-factory-guy';

export const TEST_COMPARISON_WIDTHS = [375, 550, 1024];

FactoryGuy.define('comparison', {
  default: {
    startedProcessingAt: () => moment().subtract(65, 'seconds'),
    finishedProcessingAt: () => moment().subtract(23, 'seconds'),
    diffRatio: 0.23,
    width: 1024,
    browser: () => {
      return FactoryGuy.make('browser');
    },

    baseScreenshot: () => {
      return FactoryGuy.make('screenshot', 'base');
    },
    headScreenshot: () => {
      return FactoryGuy.make('screenshot', 'head');
    },
    diffImage: () => {
      return FactoryGuy.make('image', 'diffImage');
    },
  },

  traits: {
    new: {
      baseScreenshot: null,
    },
    // TODO: convert this to use the real factories
    forChrome: {
      browser: () => {
        return FactoryGuy.make('browser', 'chrome');
      },
      headScreenshot: f => {
        // TODO: make the screenshot and image a real FactoryGuy model instead of POJO
        return {
          id: f.id,
          image: {id: f.id, url: '/images/test/v2-chrome.png', width: 375, height: 500},
          lossyImage: {id: f.id, url: '/images/test/v2-lossy-chrome.png', width: 375, height: 500},
        };
      },
      baseScreenshot: f => {
        // TODO: make the screenshot and image a real FactoryGuy model instead of POJO
        return {
          id: f.id,
          image: {id: f.id, url: '/images/test/v1-chrome.png', width: 375, height: 500},
          lossyImage: {id: f.id, url: '/images/test/v1-lossy-chrome.png', width: 375, height: 500},
        };
      },
      diffImage: f => {
        // TODO: make the screenshot and image a real FactoryGuy model instead of POJO
        return {id: f.id, image: {id: f.id, url: '/images/test/diff.png', width: 375, height: 500}};
      },
    short: {
      baseScreenshot: () => make('screenshot', 'baseShort'),
      headScreenshot: () => make('screenshot', 'headShort'),
      diffImage: () => make('image', 'diffImage', 'short'),
    },
  },
});
