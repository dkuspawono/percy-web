import {expect} from 'chai';
import {describe, beforeEach, it} from 'mocha';
import snapshotSort from 'percy-web/lib/snapshot-sort';
import Object from '@ember/object';

describe('snapshot-sort', function() {
  const wideWidth = 800;
  const narrowWidth = 400;

  const highDiffRatio = 0.99;
  const lowDiffRatio = 0.25;
  const noDiffRatio = 0.0;

  let wideComparisonWithHighDiff;
  let narrowComparisonWithHighDiff;
  let wideComparisonWithLowDiff;
  let wideComparisonWithNoDiff;
  let chromeBrowser;
  let firefoxBrowser;

  beforeEach(() => {
    wideComparisonWithHighDiff = Object.create({
      width: wideWidth,
      smartDiffRatio: highDiffRatio,
      browser: chromeBrowser,
    });
    narrowComparisonWithHighDiff = Object.create({
      width: narrowWidth,
      smartDiffRatio: highDiffRatio,
      browser: chromeBrowser,
    });
    wideComparisonWithLowDiff = Object.create({
      width: wideWidth,
      smartDiffRatio: lowDiffRatio,
      browser: chromeBrowser,
    });
    wideComparisonWithNoDiff = Object.create({
      width: wideWidth,
      smartDiffRatio: noDiffRatio,
      browser: chromeBrowser,
    });

    chromeBrowser = Object.create({name: 'Chrome'});
    firefoxBrowser = Object.create({name: 'Firefox'});
  });

  it('returns snapshots with diffs before snapshots with no diffs', function() {
    const snapshotWithDiffs = Object.create({
      comparisonsForChrome: [wideComparisonWithLowDiff],
    });
    const snapshotWithNoDiffs = Object.create({comparisonsForChrome: [wideComparisonWithNoDiff]});
    const unorderedSnapshots = [snapshotWithNoDiffs, snapshotWithDiffs];

    expect(snapshotSort(unorderedSnapshots, chromeBrowser)).to.eql([
      snapshotWithDiffs,
      snapshotWithNoDiffs,
    ]);
  });

  it('returns snapshots with diffs at widest widths before snapshots with no diffs at widest width', function() { // eslint-disable-line
    const snapshotWithWideDiff = Object.create({
      maxComparisonWidth: wideWidth,
      comparisonsForChrome: [wideComparisonWithHighDiff],
    });
    const snapshotWithNarrowDiff = Object.create({
      maxComparisonWidth: narrowWidth,
      comparisonsForChrome: [narrowComparisonWithHighDiff],
    });
    const unorderedSnapshots = [snapshotWithNarrowDiff, snapshotWithWideDiff];

    expect(snapshotSort(unorderedSnapshots, chromeBrowser)).to.eql([
      snapshotWithWideDiff,
      snapshotWithNarrowDiff,
    ]);
  });

  it('returns snapshots with high diff ratio before snapshots with low diff ratio', function() {
    const snapshotWithHighDiffRatio = Object.create({
      maxComparisonWidth: wideWidth,
      comparisonsForChrome: [wideComparisonWithHighDiff],
    });
    const snapshotWithLowDiffRatio = Object.create({
      maxComparisonWidth: wideWidth,
      comparisonsForChrome: [wideComparisonWithLowDiff],
    });
    const unorderedSnapshots = [snapshotWithLowDiffRatio, snapshotWithHighDiffRatio];

    expect(snapshotSort(unorderedSnapshots, chromeBrowser)).to.eql([
      snapshotWithHighDiffRatio,
      snapshotWithLowDiffRatio,
    ]);
  });

  it('returns snapshots with low diff ratio in the selected browser before snapshots with high diff ratio in other browsers ', function() { // eslint-disable-line
    wideComparisonWithLowDiff.browser = firefoxBrowser;
    const chromeSnapshotWithHighDiffRatio = Object.create({
      maxComparisonWidth: wideWidth,
      comparisonsForChrome: [wideComparisonWithHighDiff],
      comparisonsForFirefox: [wideComparisonWithLowDiff],
    });
    const firefoxSnapshotWithLowDiffRatio = Object.create({
      maxComparisonWidth: wideWidth,
      comparisonsForChrome: [wideComparisonWithLowDiff],
      comparisonsForFirefox: [wideComparisonWithHighDiff],
    });

    expect(
      snapshotSort(
        [chromeSnapshotWithHighDiffRatio, firefoxSnapshotWithLowDiffRatio],
        firefoxBrowser,
      ),
    ).to.eql([firefoxSnapshotWithLowDiffRatio, chromeSnapshotWithHighDiffRatio]);
  });
});
