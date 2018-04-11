import {Model, belongsTo} from 'ember-cli-mirage';

export default Model.extend({
  headSnapshot: belongsTo('snapshot'),
  headScreenshot: belongsTo('screenshot'),
  baseScreenshot: belongsTo('screenshot'),
  diffImage: belongsTo('image'),
  browser: belongsTo('browser'),
});
