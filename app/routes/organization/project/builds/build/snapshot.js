import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import ResetScrollMixin from 'percy-web/mixins/reset-scroll';
import {hash} from 'rsvp';

export default Route.extend(AuthenticatedRouteMixin, ResetScrollMixin, {
  params: {},
  queryParams: {
    comparisonMode: {as: 'mode'},
  },

  model(params) {
    this.set('params', params);
    const snapshot = this.store.findRecord('snapshot', params.snapshot_id);
    const build = this.modelFor('organization.project.builds.build');
    return hash({
      build,
      snapshot,
    });
  },

  setupController(controller, model) {
    this._super(...arguments);

    let params = this.get('params');

    controller.setProperties({
      build: model.build,
      snapshotId: params.snapshot_id,
      snapshotSelectedWidth: params.width,
      comparisonMode: params.comparisonMode,
    });
  },
  actions: {
    closeSnapshotFullModal(buildId) {
      this.transitionTo('organization.project.builds.build', buildId);
    },

    didTransition() {
      this._super(...arguments);

      let build = this.modelFor(this.routeName).build;
      let organization = build.get('project.organization');
      let eventProperties = {
        project_id: build.get('project.id'),
        project_slug: build.get('project.slug'),
        build_id: build.get('id'),
        snapshot_id: this.get('params').snapshot_id,
      };
      this.analytics.track('Snapshot Fullscreen Viewed', organization, eventProperties);
    },
    updateComparisonMode(value) {
      this.controllerFor(this.routeName).set('comparisonMode', value.toString());
    },
    transitionRouteToWidth(snapshot, width, comparisonMode) {
      this.transitionTo('organization.project.builds.build.snapshot', snapshot.id, width, {
        queryParams: {mode: comparisonMode},
      });
    },
  },
});
