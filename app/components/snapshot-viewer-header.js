import Component from '@ember/component';
import {inject as service} from '@ember/service';
import {computed} from '@ember/object';
import {alias, equal, filterBy, not, or} from '@ember/object/computed';
import utils from 'percy-web/lib/utils';

export default Component.extend({
  // required params
  snapshot: null,
  flashMessages: service(),
  selectedWidth: null,
  selectedComparison: null,

  // optional params
  fullscreen: false,
  comparisonMode: '',
  tagName: '',

  // required actions
  toggleViewMode: null,
  updateSelectedWidth: null,

  // optional actions
  expandSnapshot() {},
  registerChild() {},
  updateComparisonMode() {},

  isShowingFilteredComparisons: true,
  isNotShowingFilteredComparisons: not('isShowingFilteredComparisons'),
  comparisons: alias('snapshot.comparisons'),
  comparisonsWithDiffs: filterBy('snapshot.comparisons', 'isDifferent'),
  isShowingAllComparisons: or('noComparisonsHaveDiffs', 'isNotShowingFilteredComparisons'),
  noComparisonsHaveDiffs: equal('comparisonsWithDiffs.length', 0),
  allComparisonsHaveDiffs: computed('comparisons.[]', 'comparisonsWithDiffs.[]', function() {
    return this.get('comparisons.length') === this.get('comparisonsWithDiffs.length');
  }),

  actions: {
    onCopySnapshotUrlToClipboard() {
      this.get('flashMessages').success('Snapshot URL was copied to your clipboard');
    },

    toggleFilteredComparisons() {
      this.toggleProperty('isShowingFilteredComparisons');
    },

    downloadHTML(type, snapshot) {
      const options = {includePercyMode: true};
      const url = utils.buildApiUrl(`${type}Asset`, snapshot.get('id'), options);

      utils.setWindowLocation(url);
    },
  },
});
