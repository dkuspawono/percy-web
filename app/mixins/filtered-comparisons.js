import Mixin from '@ember/object/mixin';
import {computed, get} from '@ember/object';
import {alias, or, filterBy} from '@ember/object/computed';
import {
  computeComparisonsForBrowser,
  computeComparisonForWidth,
  computeWidestComparison,
  computeWidestComparisonWithDiff,
} from 'percy-web/lib/filtered-comparisons';

// TODO: rename this to something other than browser-comparisons? To be more generic?
// Filtered-comparisons?
export default Mixin.create({
  // To use this mixin, your component must have these properties:
  // REQUIRED: activeBrowser
  // REQUIRED: snapshot
  // REQUIRED: snapshotSelectedWidth

  _comparisons: alias('snapshot.comparisons'),

  browserComparisons: computed('_comparisons.@each.browser', 'activeBrowser', function() {
    return computeComparisonsForBrowser(get(this, '_comparisons'), get(this, 'activeBrowser'));
  }),
  comparisonForWidth: computed(
    'browserComparisons.@each.width',
    'snapshotSelectedWidth',
    function() {
      return computeComparisonForWidth(
        get(this, 'browserComparisons'),
        get(this, 'snapshotSelectedWidth'),
      );
    },
  ),
  widestComparisonForBrowser: computed('browserComparisons.@each.width', function() {
    return computeWidestComparison(get(this, 'browserComparisons'));
  }),
  widestComparisonWithDiff: computed('browserComparisons.@each.width', function() {
    return computeWidestComparisonWithDiff(get(this, 'browserComparisons'));
  }),

  selectedComparison: or('comparisonForWidth', 'widestComparisonForBrowser'),
  defaultWidth: or('widestComparisonWithDiff.width', 'widestComparisonForBrowser.width'),
  comparisonsWithDiffs: filterBy('browserComparisons', 'isDifferent'),
});
