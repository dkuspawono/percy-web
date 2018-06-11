import {readOnly, mapBy} from '@ember/object/computed';
import {inject as service} from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  flashMessages: service(),
  project: null,
  allBrowserFamilies: null,

  projectBrowserTargets: readOnly('project.projectBrowserTargets'),
  existingBrowserTargets: mapBy('projectBrowserTargets', 'browserTarget'),
  numExistingBrowserTargets: readOnly('existingBrowserTargets.length'),

  actions: {
    updateProjectBrowserTargets(targetFamily) {
      // {<str:browserFamilyId>: <Obj:browserTarget>}
      const existingBrowserTargetsByFamilyId = this.get('existingBrowserTargets').reduce(
        (acc, browserTarget) => {
          acc[browserTarget.get('browserFamily.id')] = browserTarget;
          return acc;
        },
        {},
      );

      const projectHasBrowserFamily = targetFamily.get('id') in existingBrowserTargetsByFamilyId;

      if (projectHasBrowserFamily) {
        if (this.get('numExistingBrowserTargets') === 1) {
          this.get('flashMessages').info('A project must have at least one browser');
          return;
        }
        this.removeProjectBrowserTargetForFamily(targetFamily, this.get('project'));
      } else {
        this.addProjectBrowserTargetForFamily(targetFamily, this.get('project'));
      }
    },
  },
});