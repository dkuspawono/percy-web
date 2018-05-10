import {expect} from 'chai';
import {describe, it} from 'mocha';
import {
  computeWidestComparison,
  computeComparisonForWidth,
  computeComparisonsForBrowser,
  computeWidestComparisonWithDiff,
  snapshotsWithDiffForBrowser,
  countDiffsWithSnapshotsPerBrowser,
} from 'percy-web/lib/filtered-comparisons';
import Object from '@ember/object';

describe('filtered-comparisons', function() {
  const chromeBrowser = Object.create({
    slug: 'chrome',
    id: 'chrome-id',
  });
  const firefoxBrowser = Object.create({
    slug: 'firefox',
    id: 'firefox-id',
  });

  const narrowComparisonNoDiff = Object.create({width: 1, isDifferent: false});
  const narrowComparisonWithDiff = Object.create({width: 1, isDifferent: true});
  const wideComparisonNoDiff = Object.create({width: 1000, isDifferent: false});
  const wideComparisonWithDiff = Object.create({width: 1000, isDifferent: true});

  describe('#computeWidestComparison', function() {
    it('returns widest comparison', function() {
      expect(computeWidestComparison([narrowComparisonNoDiff, wideComparisonNoDiff])).to.equal(
        wideComparisonNoDiff,
      );
    });
  });

  describe('#computeCompraisonForWidth', function() {
    it('returns comparison matching inputted width', function() {
      expect(
        computeComparisonForWidth([narrowComparisonNoDiff, wideComparisonNoDiff], 1000),
      ).to.equal(wideComparisonNoDiff);
    });

    it('returns nothing if there is no matching comparison', function() {
      expect(
        computeComparisonForWidth([narrowComparisonNoDiff, wideComparisonNoDiff], 293847),
      ).to.equal(undefined);
    });
  });

  describe('#computeComparisonsForBrowser', function() {
    it('returns comparisons with maching browser', function() {
      const chromeComparison = Object.create({browser: chromeBrowser});
      const firefoxComparison = Object.create({browser: firefoxBrowser});

      expect(
        computeComparisonsForBrowser([firefoxComparison, chromeComparison], chromeBrowser),
      ).to.eql([chromeComparison]);
    });

    it('returns empty array if no matching comparisons', function() {
      expect(
        computeComparisonsForBrowser([narrowComparisonNoDiff, wideComparisonNoDiff], chromeBrowser),
      ).to.eql([]);
    });
  });

  describe('#computeWidestComparisonWithDiff', function() {
    it('returns widest comparison with diff', function() {
      expect(
        computeWidestComparisonWithDiff([
          narrowComparisonWithDiff,
          wideComparisonWithDiff,
          wideComparisonNoDiff,
        ]),
      ).to.equal(wideComparisonWithDiff);
    });

    it('returns undefined if no comparisons with diffs', function() {
      expect(
        computeWidestComparisonWithDiff([narrowComparisonNoDiff, wideComparisonNoDiff]),
      ).to.equal(undefined);
    });
  });

  describe('#snapshotsWithDiffForBrowser', function() {
    it('returns snapshots which have comparisons with diffs for matching browser', function() {
      const chromeComparisonWithDiff = Object.create({browser: chromeBrowser, isDifferent: true});
      const firefoxComparisonWithDiff = Object.create({browser: firefoxBrowser, isDifferent: true});
      const chromeComparisonNoDiff = Object.create({browser: chromeBrowser, isDifferent: false});

      const snapshotWithChrome = Object.create({comparisons: [chromeComparisonWithDiff]});
      const snapshotWithFirefox = Object.create({comparisons: [firefoxComparisonWithDiff]});
      const snapshotWithBothBrowsersAndDiffs = Object.create({
        comparisons: [chromeComparisonWithDiff, firefoxComparisonWithDiff],
      });
      const snapshotWithBothBrowsersAndMixedDiffs = Object.create({
        comparisons: [chromeComparisonNoDiff, firefoxComparisonWithDiff],
      });

      expect(
        snapshotsWithDiffForBrowser(
          [
            snapshotWithChrome,
            snapshotWithFirefox,
            snapshotWithBothBrowsersAndDiffs,
            snapshotWithBothBrowsersAndMixedDiffs,
          ],
          chromeBrowser,
        ),
      ).to.eql([snapshotWithChrome, snapshotWithBothBrowsersAndDiffs]);
    });
  });

  describe('#countDiffsWithSnapshotPerBrowser', function() {
    it('creates correct data structure', function() {
      const snapshotWithTwoChromeDiffs = Object.create({
        comparisons: [
          Object.create({browser: chromeBrowser, isDifferent: true}),
          Object.create({browser: chromeBrowser, isDifferent: true}),
          Object.create({browser: firefoxBrowser, isDifferent: false}),
        ],
      });

      const mixedSnapshotWithFirefoxDiff = Object.create({
        comparisons: [
          Object.create({browser: chromeBrowser, isDifferent: false}),
          Object.create({browser: firefoxBrowser, isDifferent: true}),
        ],
      });
      const snapshotWithFirefoxDiff = Object.create({
        comparisons: [Object.create({browser: firefoxBrowser, isDifferent: true})],
      });

      const result = countDiffsWithSnapshotsPerBrowser(
        [snapshotWithTwoChromeDiffs, mixedSnapshotWithFirefoxDiff, snapshotWithFirefoxDiff],
        [chromeBrowser, firefoxBrowser],
      );
      expect(result.get('firefox')).to.eql([mixedSnapshotWithFirefoxDiff, snapshotWithFirefoxDiff]);
      expect(result.get('chrome')).to.eql([snapshotWithTwoChromeDiffs]);
    });
  });
});
