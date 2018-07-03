import Route from '@ember/routing/route';
import utils from 'percy-web/lib/utils';
import {Promise} from 'rsvp';

const REDIRECTS = {
  '/docs/clients/javascript/react-storybook': '/docs/storybook-for-react',
};

export default Route.extend({
  beforeModel(transition) {
    // If the target route contains anything related to the old docs, don't continue.
    // This returns a promise because beforeModel blocks on a returned promise.
    // If a promise is not returned, it starts the transition but continues loading the app
    // causing visual jank.
    // The promise does not resolve, as we do not want the app to proceed further
    // if we are redirecting
    return new Promise(() => {
      const targetPage = transition.intent.url;
      if (targetPage in REDIRECTS) {
        return utils.setWindowLocation(`https://docs.percy.io${REDIRECTS[targetPage]}`);
      } else {
        return utils.setWindowLocation('https://docs.percy.io');
      }
    });
  },
});
