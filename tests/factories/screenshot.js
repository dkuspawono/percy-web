import FactoryGuy from 'ember-data-factory-guy';
import moment from 'moment';
import {make} from 'ember-data-factory-guy';

FactoryGuy.define('screenshot', {
  default: {
    snapshot: FactoryGuy.belongsTo('snapshot'),
    image: FactoryGuy.belongsTo('image'),
    lossyImage: FactoryGuy.belongsTo('image'),
    createdAt: moment().subtract(3, 'days'),
    updatedAt: moment().subtract(1, 'days'),
  },

  traits: {
    head: {
      image: () => make('image'),
      lossyImage: () => make('image', 'headImageLossy'),
    },
    headShort: {
      image: () => make('image', 'short'),
      lossyImage: () => make('image', 'headImageLossy', 'short'),
    },
    base: {
      image: () => make('image', 'baseImage'),
      lossyImage: () => make('image', 'baseImageLossy'),
    },
    baseShort: {
      image: () => make('image', 'baseImage', 'short'),
      lossyImage: () => make('image', 'baseImageLossy', 'short'),
    },
    diff: {
      image: () => make('image', 'diffImage'),
    },
    diffShort: {
      image: () => make('image', 'diffImage', 'short'),
    },
  },
});
