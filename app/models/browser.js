import DS from 'ember-data';
import {alias} from '@ember/object/computed';

export default DS.Model.extend({
  builds: DS.hasMany('build', {inverse: null}),
  browserFamily: DS.belongsTo('browserFamily', {async: false, inverse: null}),
  version: DS.attr(),
  name: alias('browserFamily.name'),
});
