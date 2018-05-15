import Object, {computed, get} from '@ember/object';
import {alias, or, filterBy} from '@ember/object/computed';
import {
  computeComparisonsForBrowser,
  computeComparisonForWidth,
  computeWidestComparison,
  computeWidestComparisonWithDiff,
} from 'percy-web/lib/filtered-comparisons';

export default Object.extend({
  activeBrowser: null,
  snapshot: null,
  snapshotSelectedWidth: null,

  _comparisons: alias('snapshot.comparisons'),

  comparisons: computed('_comparisons.@each.browser', 'activeBrowser', function() {
    return computeComparisonsForBrowser(get(this, '_comparisons'), get(this, 'activeBrowser'));
  }),
  comparisonForWidth: computed('comparisons.@each.width', 'snapshotSelectedWidth', function() {
    let width = this.get('snapshotSelectedWidth');
    if (!width) {
      width = this.get('defaultWidth');
    }
    return computeComparisonForWidth(get(this, 'comparisons'), width);
  }),
  widestComparisonForBrowser: computed('comparisons.@each.width', function() {
    return computeWidestComparison(get(this, 'comparisons'));
  }),
  widestComparisonWithDiff: computed('comparisons.@each.width', function() {
    return computeWidestComparisonWithDiff(get(this, 'comparisons'));
  }),

  selectedComparison: or('comparisonForWidth', 'widestComparisonForBrowser'),
  defaultWidth: or('widestComparisonWithDiff.width', 'widestComparisonForBrowser.width'),
  comparisonsWithDiffs: filterBy('comparisons', 'isDifferent'),
});
