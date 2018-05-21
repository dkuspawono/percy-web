import Component from '@ember/component';
import {computed} from '@ember/object';
import seededRandom from 'percy-web/lib/random';

export default Component.extend({
  tagName: '',

  setGridItemOrder: computed(function() {
    return Math.floor(seededRandom() * 100 + 1);
  }),
});
