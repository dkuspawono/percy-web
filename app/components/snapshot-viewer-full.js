import {computed} from '@ember/object';
import Component from '@ember/component';
import FilteredComparisonMixin from 'percy-web/mixins/filtered-comparisons';

export default Component.extend(FilteredComparisonMixin, {
  classNames: ['SnapshotViewerFull'],
  attributeBindings: ['data-test-snapshot-viewer-full'],
  'data-test-snapshot-viewer-full': true,

  // Required params
  comparisonMode: null,
  updateComparisonMode: null,
  transitionRouteToWidth: null,
  closeSnapshotFullModal: null,
  createReview: null,

  // Required for FilteredComparisonMixin
  snapshot: null,
  snapshotSelectedWidth: null,
  activeBrowser: null,

  galleryMap: ['base', 'diff', 'head'],

  galleryIndex: computed('comparisonMode', function() {
    return this.get('galleryMap').indexOf(this.get('comparisonMode'));
  }),

  didRender() {
    this._super(...arguments);

    // Autofocus component for keyboard navigation
    this.$().attr({tabindex: 1});
    this.$().focus();
  },

  actions: {
    updateSelectedWidth(newWidth) {
      this.set('snapshotSelectedWidth', newWidth);
      this.sendAction('transitionRouteToWidth', newWidth);
    },

    cycleComparisonMode(keyCode) {
      let galleryMap = this.get('galleryMap');
      let galleryLength = this.get('galleryMap.length');
      let directional = keyCode === 39 ? 1 : -1;
      let galleryIndex = this.get('galleryIndex');
      let newIndex = ((galleryIndex + directional) % galleryLength + galleryLength) % galleryLength;
      this.sendAction('updateComparisonMode', galleryMap[newIndex]);
    },
  },

  keyDown(event) {
    if (event.keyCode === 27) {
      this.get('closeSnapshotFullModal')();
    }

    if (event.keyCode === 39 || event.keyCode === 37) {
      if (!this.get('selectedComparison') || this.get('selectedComparison.wasAdded')) {
        return;
      }
      this.send('cycleComparisonMode', event.keyCode);
    }
  },
});
