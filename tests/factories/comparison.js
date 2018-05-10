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
    short: {
      baseScreenshot: () => make('screenshot', 'baseShort'),
      headScreenshot: () => make('screenshot', 'headShort'),
      diffImage: () => make('image', 'diffImage', 'short'),
    },
  },
});
