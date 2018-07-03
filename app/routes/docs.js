import {get} from '@ember/object';
import {hash} from 'rsvp';
import Route from '@ember/routing/route';
import ResetScrollMixin from '../mixins/reset-scroll';
import utils from 'percy-web/lib/utils';

export default Route.extend(ResetScrollMixin, {
  beforeModel() {
    return utils.setWindowLocation('https://docs.percy.io');
  },
});
