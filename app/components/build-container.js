import {or, alias, readOnly} from '@ember/object/computed';
import {assert} from '@ember/debug';
import Component from '@ember/component';
import PollingMixin from 'percy-web/mixins/polling';
import {inject as service} from '@ember/service';
import {computed} from '@ember/object';
import {snapshotsWithNoDiffForBrowser} from 'percy-web/lib/filtered-comparisons';
import {task, timeout} from 'ember-concurrency';

export default Component.extend(PollingMixin, {
  classNames: ['BuildContainer'],
  classNameBindings: ['isHidingBuildContainer:BuildContainer--snapshotModalOpen'],

  build: null,
  isHidingBuildContainer: false,
  snapshotQuery: service(),
  snapshotsUnchanged: null,
  allDiffsShown: true,
  updateActiveBrowser: null,
  isUnchangedSnapshotsVisible: false,

  snapshotsChanged: computed('allChangedBrowserSnapshotsSorted', 'activeBrowser.id', function() {
    if (!this.get('allChangedBrowserSnapshotsSorted')) return;
    return this.get('allChangedBrowserSnapshotsSorted')[this.get('activeBrowser.id')];
  }),

  browserWithMostDiffs: computed('_browsers', 'allChangedBrowserSnapshotsSorted.[]', function() {
    const snapshots = this.get('allChangedBrowserSnapshotsSorted');
    if (!snapshots) {
      return;
    }

    const browserWithmostDiffsId = _browserWithMostDiffsId(snapshots);
    return this.get('_browsers').findBy('id', browserWithmostDiffsId);
  }),

  _browsers: alias('build.browsers'),

  defaultBrowser: computed('_browsers', 'browserWithMostDiffs', function() {
    const chromeBrowser = this.get('_browsers').findBy('familySlug', 'chrome');
    const browserWithMostDiffs = this.get('browserWithMostDiffs');
    if (browserWithMostDiffs) {
      return browserWithMostDiffs;
    } else if (chromeBrowser) {
      return chromeBrowser;
    } else {
      return this.get('_browsers.firstObject');
    }
  }),

  chosenBrowser: null,
  activeBrowser: or('chosenBrowser', 'defaultBrowser'),

  shouldPollForUpdates: or('build.isPending', 'build.isProcessing'),

  pollRefresh() {
    this.get('build')
      .reload()
      .then(build => {
        if (build.get('isFinished')) {
          this.set('isSnapshotsLoading', true);
          const changedSnapshots = this.get('snapshotQuery').getChangedSnapshots(build);
          changedSnapshots.then(() => {
            this.get('initializeSnapshotOrdering')();
          });
        }
      });
  },

  _getLoadedSnapshots() {
    // Get snapshots without making new request
    return (
      this.get('build')
        .hasMany('snapshots')
        .value() || []
    );
  },

  isUnchangedSnapshotsLoading: readOnly('_toggleUnchangedSnapshotsVisible.isRunning'),

  _toggleUnchangedSnapshotsVisible: task(function*() {
    const build = this.get('build');
    let loadedSnapshots = this._getLoadedSnapshots();
    const allSnapshotsAreLoaded = loadedSnapshots.get('length') === build.get('totalSnapshots');

    // Check if all snapshots for build are loaded
    if (!allSnapshotsAreLoaded) {
      // If they're not all loaded, get the rest.
      yield this.get('snapshotQuery').getUnchangedSnapshots(this.get('build'));
      loadedSnapshots = this._getLoadedSnapshots();
    } else {
      // If the cached snapshots are used, the loading spinner does not display because it
      // completes this operation in the same run loop. So pause for half a second to
      // give the user some indication we have processed their click.
      yield timeout(500);
    }

    const alreadyLoadedSnapshotsWithNoDiff = yield snapshotsWithNoDiffForBrowser(
      loadedSnapshots,
      this.get('activeBrowser'),
    );

    this.set('snapshotsUnchanged', alreadyLoadedSnapshotsWithNoDiff);
    this.toggleProperty('isUnchangedSnapshotsVisible');
  }),

  _resetUnchangedSnapshots() {
    this.set('snapshotsUnchanged', null);
    this.set('isUnchangedSnapshotsVisible', false);
  },

  actions: {
    showSnapshotFullModalTriggered(snapshotId, snapshotSelectedWidth, activeBrowser) {
      this.sendAction('openSnapshotFullModal', snapshotId, snapshotSelectedWidth, activeBrowser);
    },

    updateActiveBrowser(newBrowser) {
      this.set('chosenBrowser', newBrowser);
      this._resetUnchangedSnapshots();
    },

    toggleUnchangedSnapshotsVisible() {
      this.get('_toggleUnchangedSnapshotsVisible').perform();
    },

    showSupport() {
      this.sendAction('showSupport');
    },

    toggleAllDiffs(options = {}) {
      this.toggleProperty('allDiffsShown');

      // Track the toggle event and source.
      const trackSource = options.trackSource;
      assert('invalid trackSource', ['clicked_toggle', 'keypress'].includes(trackSource));

      const build = this.get('build');
      const organization = build.get('project.organization');
      const eventProperties = {
        project_id: build.get('project.id'),
        project_slug: build.get('project.slug'),
        build_id: build.get('id'),
        state: this.get('allDiffsShown') ? 'on' : 'off',
        source: trackSource,
      };
      this.get('analytics').track('All Diffs Toggled', organization, eventProperties);
    },
  },
});

// allChangedBrowserSnapshotsSorted is an object where the keys are browser ids and the values
// are a list of snapshots. We want to revers this data structure and find out the browserId
// for the longest snapshot list.
// This method creates a hash with snapshot list length as the key and the browser id as the value,
// then finds the highest value among keys and returns the corresponding browser id.
function _browserWithMostDiffsId(allChangedBrowserSnapshotsSorted) {
  const counts = {};
  const browserIds = Object.keys(allChangedBrowserSnapshotsSorted);
  browserIds.forEach(browserId => {
    const snapshotsForBrowserLength = allChangedBrowserSnapshotsSorted[browserId].length;
    counts[snapshotsForBrowserLength] = browserId;
  });
  const mostSnapshotsCount = Math.max(...Object.keys(counts));
  return counts[mostSnapshotsCount];
}
