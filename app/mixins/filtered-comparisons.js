import Mixin from '@ember/object/mixin';
import {computed, get} from '@ember/object';
import {alias, or, filterBy} from '@ember/object/computed';
import {
  widestComparison,
  comparisonForWidth,
  widestComparisonWithDiff,
} from 'percy-web/lib/computed/browser-comparisons';

// TODO: rename this to something other than browser-comparisons? To be more generic?
// Filtered-comparisons?
export default Mixin.create({
  // To use this mixin, your component must have these properties:
  // REQUIRED: snapshot
  // REQUIRED: snapshotSelectedWidth

  comparisons: alias('snapshot.comparisons'),

  comparisonForWidth: computed('comparisons', 'snapshotSelectedWidth', function() {
    return comparisonForWidth(get(this, 'comparisons'), get(this, 'snapshotSelectedWidth'));
  }),

  widestComparison: computed('comparisons.@each.width', function() {
    return widestComparison(get(this, 'comparisons'));
  }),

  widestComparisonWithDiff: computed('comparisons.@each.{width, isDifferent', function() {
    return widestComparisonWithDiff(get(this, 'comparisons'));
  }),

  selectedComparison: or('comparisonForWidth', 'widestComparison'),

  defaultWidth: or('widestComparisonWithDiff.width'),
  comparisonsWithDiffs: filterBy('comparisons', 'isDifferent'),
});
