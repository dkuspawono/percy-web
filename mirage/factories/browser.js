import {Factory, trait} from 'ember-cli-mirage';

export default Factory.extend({
  id(i) {
    return `${i}`;
  },

  version: 'abc.123',
  afterCreate(browser, server) {
    browser.browserFamily = server.create('browserFamily');
    browser.save();
  },

  chrome: trait({
    slug: 'chrome',
    name: 'Chrome',
  }),
});
