import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
  model(params) {
    return this.store.findRecord('build', params.build_id);
  },

  actions: {
    createReview(action, build, snapshots) {
      const review = this.get('store').createRecord('review', {
        build: build,
        snapshots: snapshots,
      });
      return review.save().then(() => {
        const build = this.modelFor(this.routeName);
        build.get('snapshots').reload();
        build.reload();
      });
    },
  },
});
