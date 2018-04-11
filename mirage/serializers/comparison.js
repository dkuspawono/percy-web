import {JSONAPISerializer} from 'ember-cli-mirage';

export default JSONAPISerializer.extend({
  include: [
    'baseScreenshot',
    'headScreenshot',
    'baseSnapshot',
    'headSnapshot',
    'diffImage',
    'browser',
  ],
});
