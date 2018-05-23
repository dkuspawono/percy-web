import Ember from 'ember';
import {not, alias, or} from '@ember/object/computed';
import {computed, observer, setProperties} from '@ember/object';
import Component from '@ember/component';
import {next} from '@ember/runloop';
import filteredComparisons, {hasDiffForBrowser} from 'percy-web/lib/filtered-comparisons';
import InViewportMixin from 'ember-in-viewport';

export default Component.extend(InViewportMixin, {
  // required params
  allDiffsShown: null,
  build: null,
  snapshot: null,
  activeBrowser: null,

  // required actions
  showSnapshotFullModalTriggered: null,
  createReview: null,
  updateActiveSnapshotId: null,

  // optional params
  activeSnapshotId: null,

  classNames: ['SnapshotViewer mb-2'],
  classNameBindings: [
    'isFocus:SnapshotViewer--focus',
    'isExpanded::SnapshotViewer--collapsed',
    'isActionable:SnapshotViewer--actionable',
  ],
  attributeBindings: ['data-test-snapshot-viewer'],
  'data-test-snapshot-viewer': true,

  snapshotSelectedWidth: or('userSelectedWidth', 'filteredComparisons.defaultWidth'),
  userSelectedWidth: null,

  filteredComparisons: computed('snapshot', 'activeBrowser', 'snapshotSelectedWidth', function() {
    return filteredComparisons.create({
      snapshot: this.get('snapshot'),
      activeBrowser: this.get('activeBrowser'),
      snapshotSelectedWidth: this.get('userSelectedWidth'),
    });
  }),

  selectedComparison: alias('filteredComparisons.selectedComparison'),

  isActiveSnapshot: computed('activeSnapshotId', 'snapshot.id', function() {
    return this.get('activeSnapshotId') === this.get('snapshot.id');
  }),

  _shouldScroll: true,
  _scrollToTop: observer('isActiveSnapshot', function() {
    if (this.get('_shouldScroll') && this.get('isActiveSnapshot') && !Ember.testing) {
      if (this.get('snapshot.isUnchanged')) {
        this.setProperties({
          isExpanded: true,
          isUnchangedSnapshotExpanded: true,
        });
      }
      // Wait a tick for the above properties to be set on unchanged snapshots, so the snapshot will
      // become fully expanded before scrolling. If we didn't wait for this, the component would
      // scroll to a height based on the closed snapshot viewer height rather than the opened one.
      next(() => {
        window.scrollTo(0, this.$().get(0).offsetTop - 48); // 48px - snapshot viewer header height
      });
    }
    this.set('_shouldScroll', true);
  }),

  isFocus: alias('isActiveSnapshot'),
  isExpanded: or('isUserExpanded', '_isDefaultExpanded'),
  isUserExpanded: false,

  _isDefaultExpanded: computed(
    'shouldDeferImageLoading',
    'snapshot.isApproved',
    'build.isApproved',
    'isActiveSnapshot',
    function() {
      if (this.get('isActiveSnapshot') || this.get('build.isApproved')) {
        return true;
      } else if (!hasDiffForBrowser(this.get('snapshot'), this.get('activeBrowser'))) {
        return false;
      } else if (this.get('snapshot.isApproved')) {
        return false;
      } else {
        return true;
      }
    },
  ),
  isNotExpanded: not('isExpanded'),
  isActionable: alias('isNotExpanded'),
  isUnchangedSnapshotExpanded: or('isFocus', 'isExpanded'),

  click() {
    this.set('_shouldScroll', false);
    this.get('updateActiveSnapshotId')(this.get('snapshot.id'));
  },

  actions: {
    updateSelectedWidth(value) {
      this.set('userSelectedWidth', value);
    },
    expandSnapshot() {
      if (!this.get('_defaultIsExpanded')) {
        this.set('isUserExpanded', true);
      }
    },
  },

  inViewport: alias('viewportEntered'),
  init() {
    this._super(...arguments);

    setProperties(this, {
      // Since adding listeners is memory intensive and can cause jank, disable viewport handling
      // entirely if we are not doing deferred image loading.
      // viewportEnabled: true,
      // viewportTolerance: {
      //   top: 0,
      //   // Pre-emptively load 1000px worth of images below the viewport.
      //   bottom: 1000,
      //   left: 0,
      //   right: 0,
      // },
    });
  },
});
