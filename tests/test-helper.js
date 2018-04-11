import resolver from './helpers/resolver';
import './helpers/flash-message';

import {setResolver} from 'ember-mocha';
import {mocha} from 'mocha';
import loadEmberExam from 'ember-exam/test-support/load';

setResolver(resolver);
loadEmberExam();

mocha.setup({
  timeout: 444444000,
  slow: 2000,
});
