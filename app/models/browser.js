import DS from 'ember-data';
import {alias} from '@ember/object/computed';

export default DS.Model.extend({
  builds: DS.hasMany('build', {inverse: null}),
  browserFamily: DS.belongsTo('browserFamily', {async: false, inverse: null}),
  name: alias('browserFamily.name'),
  slug: alias('browserFamily.slug'),
});
