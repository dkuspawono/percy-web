import Mixin from '@ember/object/mixin';
import {alias, or, filterBy} from '@ember/object/computed';
import {
  widestComparison,
  comparisonForWidth,
  comparisonsForBrowser,
  widestComparisonWithDiff,
} from 'percy-web/lib/filtered-comparisons';

// TODO: rename this to something other than browser-comparisons? To be more generic?
// Filtered-comparisons?
export default Mixin.create({
  // To use this mixin, your component must have these properties:
  // REQUIRED: activeBrowser
  // REQUIRED: snapshot
  // REQUIRED: snapshotSelectedWidth

  _comparisons: alias('snapshot.comparisons'),

  browserComparisons: comparisonsForBrowser('_comparisons', 'activeBrowser'),
  comparisonForWidth: comparisonForWidth('browserComparisons', 'snapshotSelectedWidth'),
  widestComparisonForBrowser: widestComparison('browserComparisons'),
  widestComparisonWithDiff: widestComparisonWithDiff('browserComparisons'),

  selectedComparison: or('comparisonForWidth', 'widestComparisonForBrowser'),
  defaultWidth: or('widestComparisonWithDiff.width', 'widestComparisonForBrowser.width'),
  comparisonsWithDiffs: filterBy('browserComparisons', 'isDifferent'),
});
