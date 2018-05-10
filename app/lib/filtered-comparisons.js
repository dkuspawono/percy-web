import Object from '@ember/object';
//TODO convert this file to use get(this,whatever) syntax
export function computeWidestComparison(comparisons) {
  return comparisons.sortBy('width').get('lastObject');
}

export function computeComparisonForWidth(comparisons, width) {
  return comparisons.findBy('width', parseInt(width, 10));
}

export function computeComparisonsForBrowser(comparisons, browser) {
  return comparisons.filterBy('browser.id', browser.get('id'));
}

export function computeWidestComparisonWithDiff(comparisons) {
  return comparisons
    .sortBy('width')
    .filterBy('isDifferent')
    .get('lastObject');
}

export function snapshotsWithDiffForBrowser(snapshots, browser) {
  return snapshots.filter(snapshot => {
    const allComparisons = snapshot.get('comparisons');
    const comparisonsForBrowser = computeComparisonsForBrowser(allComparisons, browser);
    return comparisonsForBrowser.any(comparison => {
      return comparison.get('isDifferent');
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
    counts.set(browser.get('slug'), unreviewedSnapshotsWithDiffsInBrowser);
  });
  return counts;
}
