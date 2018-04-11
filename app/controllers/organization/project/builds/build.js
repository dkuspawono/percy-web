import Controller from '@ember/controller';
import snapshotSort from 'percy-web/lib/snapshot-sort';
import {filterBy, alias, or} from '@ember/object/computed';
import {computed} from '@ember/object';
import ObjectProxy from '@ember/object/proxy';

export default Controller.extend({
  isHidingBuildContainer: false,

  _browsers: alias('build.browsers'),
  defaultBrowser: alias('browsers.firstObject'),
  chosenBrowser: null,
  selectedBrowser: or('chosenBrowser', 'defaultBrowser'),

  // set by initializeSnapshotOrdering
  snapshots: null,
  sortedSnapshots: computed('snapshots.[]', function() {
    if (!this.get('snapshots')) {
      return [];
    }

    const browserSnapshot = ObjectProxy.extend({
      content: null,
      activeBrowser: null,
      comparisons: filterBy('content.comparisons', 'browser.id', 'activeBrowser.id'),
      comparisonForWidth(width) {
        return this.get('comparisons').findBy('width', parseInt(width, 10));
      },
    });

    const browserSnapshots = this.get('snapshots').map(snapshot => {
      return browserSnapshot.create({
        content: snapshot,
        activeBrowser: this.get('selectedSnapshot'),
      });
    });
    return snapshotSort(browserSnapshots);
    // return snapshotSort(this.get('snapshots').toArray());
  }),
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
});
