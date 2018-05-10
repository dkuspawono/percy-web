import Component from '@ember/component';

export default Component.extend({
  classNames: ['LoadingPage'],
  attributeBindings: ['dataTestId:data-test-id'],
  dataTestId: null,
});
