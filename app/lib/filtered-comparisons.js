import Object, {get, set} from '@ember/object';

export function computeWidestComparison(comparisons) {
  return get(comparisons.sortBy('width'), 'lastObject');
}

export function computeComparisonForWidth(comparisons, width) {
  return comparisons.findBy('width', parseInt(width, 10));
}

export function computeComparisonsForBrowser(comparisons, browser) {
  return comparisons.filterBy('browser.id', get(browser, 'id'));
}

export function computeWidestComparisonWithDiff(comparisons) {
  return get(comparisons.sortBy('width').filterBy('isDifferent'), 'lastObject');
}

export function snapshotsWithDiffForBrowser(snapshots, browser) {
  return snapshots.filter(snapshot => {
    const allComparisons = get(snapshot, 'comparisons');
    const comparisonsForBrowser = computeComparisonsForBrowser(allComparisons, browser);
    return comparisonsForBrowser.any(comparison => {
      return get(comparison, 'isDifferent');
    });
  });
}

// Returns Ember Object with a property for each browser for the build,
// where the value is an array of snapshots that have diffs for that browser.
// It is an ember object rather than a POJO so computed properties can observe it, and for ease
// of use in templates.
// Ex: {
//   firefox: [<snapshot>, <snapshot>],
//   chrome: [<snapshot>, <snapshot>, <snapshot>]
// }
export function countDiffsWithSnapshotsPerBrowser(snapshots, browsers) {
  const counts = Object.create();

  browsers.forEach(browser => {
    const unreviewedSnapshotsWithDiffsInBrowser = snapshotsWithDiffForBrowser(snapshots, browser);
    set(counts, get(browser, 'slug'), unreviewedSnapshotsWithDiffsInBrowser);
  });
  return counts;
}
