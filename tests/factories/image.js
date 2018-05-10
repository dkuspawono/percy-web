import FactoryGuy from 'ember-data-factory-guy';
import moment from 'moment';

FactoryGuy.define('image', {
  default: {
    sha: '39e9d27ba78f728924e2e8a9579e8ef4b4968217363eacef6b1bda4bd3c22c58',
    mimetype: 'image/png',
    url: '/images/test/v2.png',
    width: 375,
    height: 500,
    createdAt: moment().subtract(3, 'days'),
    updatedAt: moment().subtract(1, 'days'),
  },

  traits: {
    short: {
      height: 100,
    },
    headImageLossy: {
      url: '/images/test/v2-lossy.jpg',
    },
    baseImage: {
      url: '/images/test/v1.png',
    },
    baseImageLossy: {
      url: '/images/test/v1-lossy.jpg',
    },
    diffImage: {
      url: '/images/test/diff.png',
    },
  },
});
