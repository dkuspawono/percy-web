import {setProperties} from '@ember/object';
import {htmlSafe} from '@ember/string';
import {computed} from '@ember/object';
import {not, or, alias} from '@ember/object/computed';
import Component from '@ember/component';
import InViewportMixin from 'ember-in-viewport';

export default Component.extend(InViewportMixin, {
  image: null,
  imageClass: '',

  action: null,
  bubbles: true,

  // Whether or not to defer image loading until in viewport.
  deferredImageLoading: false,
  immediateImageLoading: not('deferredImageLoading'),

  // Whether or not the curent image is in the viewport.
  inViewport: alias('viewportEntered'),

  // We should load the image (ie. render the <img> tag) if deferred mode is off, or the image
  // is in the viewport.
  shouldLoadImage: or('immediateImageLoading', 'inViewport'),

  classNames: ['ImageSpacer'],
  attributeBindings: ['style'],
  style: computed('image.width', 'image.height', function() {
    let scale = (this.get('image.height') * 100.0) / this.get('image.width');
    return htmlSafe(`padding-top: ${scale}%`);
  }),

  init() {
    this._super(...arguments);

    setProperties(this, {
      // Since adding listeners is memory intensive and can cause jank, disable viewport handling
      // entirely if we are not doing deferred image loading.
      viewportEnabled: this.get('deferredImageLoading'),
      viewportTolerance: {
        top: 0,
        // Pre-emptively load 1000px worth of images below the viewport.
        bottom: 1000,
        left: 0,
        right: 0,
      },
    });
  },

  click(e) {
    let action = this.get('action');
    if (action) {
      action();
    }
    if (!this.get('bubbles')) {
      e.stopPropagation();
    }
  },
});
