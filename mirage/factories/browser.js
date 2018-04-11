import {Factory, trait} from 'ember-cli-mirage';

export default Factory.extend({
  id(i) {
    return `${i}`;
  },

  version: 'abc.123',
  // slug: 'firefox',
  // name: 'Firefox',
  // browserFamily: association(),
  afterCreate(browser, server) {
    browser.browserFamily = server.create('browserFamily');
    browser.save();
    // browser.update('browserFamily', server.create('browserFamily'));
    // debugger
  },

  chrome: trait({
    slug: 'chrome',
    name: 'Chrome',
    // afterCreate(browser, server) {
    //   browser.update('browserFamily', server.create('browserFamily', 'chrome'));
    // },
  }),
});
