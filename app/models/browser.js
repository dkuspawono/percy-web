import DS from 'ember-data';

export default DS.Model.extend({
  builds: DS.hasMany('build', {inverse: null}),
  browserFamily: DS.belongsTo('browserFamily', {async: false, inverse: null}),
});
