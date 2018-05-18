import {or} from '@ember/object/computed';
import Component from '@ember/component';
import {computed, get} from '@ember/object';
import {alias} from '@ember/object/computed';

export default Component.extend({
  build: null,
  classNames: ['BuildHeader'],

  buildCompletionPercent: alias('build.buildCompletionPercent'),

  progressBarWidth: computed('buildCompletionPercent', function() {
    return `${get(this, 'buildCompletionPercent') - 100}%`;
  }),

  progressBarWidthStyle: computed('progressBarWidth', function() {
    return `--progress-bar-width: ${get(this, 'progressBarWidth')}`.htmlSafe();
  }),

  showActions: or('build.isPending', 'build.isProcessing', 'build.isFinished'),

  formattedFailedSnapshots: computed('build.failureDetails', function() {
    return '"' + get(this, 'build.failureDetails').failed_snapshots.join('", "') + '"';
  }),
});
