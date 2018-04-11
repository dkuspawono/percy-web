import Controller from '@ember/controller';
import snapshotSort from 'percy-web/lib/snapshot-sort';
import {filterBy, alias, or, sort, max, mapBy} from '@ember/object/computed';
import {computed} from '@ember/object';
import ObjectProxy from '@ember/object/proxy';

export default Controller.extend({
  isHidingBuildContainer: false,

  _browsers: alias('build.browsers'),
  defaultBrowser: alias('_browsers.firstObject'),
  chosenBrowser: null,
  activeBrowser: or('chosenBrowser', 'defaultBrowser'),

  // set by initializeSnapshotOrdering
  snapshots: null,
  sortedSnapshots: computed(
    'snapshots.[]',
    'snapshots.comparisons',
    'activeBrowser.id',
    function() {
      console.log('recalculating sort')
      if (!this.get('snapshots')) {
        return [];
      }

      const browserSnapshots = this.get('snapshots').map(snapshot => {
        return browserSnapshot.create({
          content: snapshot,
          activeBrowser: this.get('activeBrowser'),
        });
      });
      return snapshotSort(browserSnapshots);
    },
  ),
  snapshotsUnreviewed: filterBy('sortedSnapshots', 'isUnreviewed', true),
  snapshotsApproved: filterBy('sortedSnapshots', 'isApprovedByUserEver', true),

  snapshotsChanged: null, // Manually managed by initializeSnapshotOrdering.

  numSnapshotsMissing: 0,
  numSnapshotsUnchanged: alias('numSnapshotsMissing'),

  // This breaks the binding for snapshotsChanged, specifically so that when a user clicks
  // approve, the snapshot stays in place until reload.
  //
  // Called by the route when entered and snapshots load.
  // Called by polling when snapshots reload after build is finished.
  initializeSnapshotOrdering(snapshots) {
    this.set('snapshots', snapshots);
    let orderedSnapshots = [].concat(
      this.get('snapshotsUnreviewed'),
      this.get('snapshotsApproved'),
    );
    this.set('snapshotsChanged', orderedSnapshots);

    const numSnapshotsMissing = this.get('build.totalSnapshots') - snapshots.get('length');
    this.set('numSnapshotsMissing', numSnapshotsMissing);

    this.set('isSnapshotsLoading', false);
  },

  actions: {
    updateSelectedBrowser(newBrowser) {
      this.set('chosenBrowser', newBrowser);
      this.initializeSnapshotOrdering(this.get('snapshots'));
    },
  },
});

const browserSnapshot = ObjectProxy.extend({
  content: null,
  activeBrowser: null,
  _allComparisons: alias('content.comparisons'),
  // _comparisons: alias('comparisons'),
  comparisons: computed('_allComparisons.@each.browser', 'activeBrowser.id', function() {
    return this.get('_allComparisons').filterBy('browser.id', this.get('activeBrowser.id'));
  }),
  // comparisons: snapshot.get('comparisons').filterBy('browser.id', 'activeBrowser.id'),

  comparisonWidths: mapBy('comparisons', 'width'),
  comparisonForWidth(width) {
    return this.get('comparisons').findBy('width', parseInt(width, 10));
  },
  comparisonsSortedByWidth: sort('comparisons', 'widthSort'),
  widthSort: ['width'],
  widestComparison: alias('comparisonsSortedByWidth.lastObject'),
  maxComparisonWidth: max('comparisonWidths'),
  maxWidthComparisonWithDiff: computed('comparisonsSortedByWidth.[]', function() {
    return this.get('comparisonsSortedByWidth')
      .filterBy('isDifferent')
      .get('lastObject');
  }),
  maxComparisonWidthWithDiff: alias('maxWidthComparisonWithDiff.width'),
})
