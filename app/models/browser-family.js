import DS from 'ember-data';

export const BROWSER_FAMILY_SLUGS = {
  firefox: 'firefox',
  chrome: 'chrome',
};

export default DS.Model.extend({
  browsers: DS.hasMany('browser'),
  name: DS.attr(),
  slug: DS.attr(),
});
