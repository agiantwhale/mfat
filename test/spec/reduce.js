/* global MFat, chai, _ */

(function () {
    'use strict';

    describe('Find the most optimal values to eat.', function () {
        it('return the correct number', function () {
          var menu = [
            {min: 5, max: 1},
            {min: 15, max: 1},
            {min: 50, max: 10},
            {min: 40, max: 9},
            {min: 200, max: 50}
          ];

          MFat.collection(menu, 'min', 'max', true);

          var result = MFat.optimize(150);
          var totalMin = _.reduce(result.collection, function(memo, val) { return memo + val.min; }, 0);
          chai.assert.isTrue(totalMin <= 150);
          chai.assert.equal(result.accumulator, 33);

          result = MFat.optimize(160);
          totalMin = _.reduce(result.collection, function(memo, val) { return memo + val.min; }, 0);
          chai.assert.isTrue(totalMin <= 160);
          chai.assert.equal(result.accumulator, 36);

          result = MFat.optimize(170);
          totalMin = _.reduce(result.collection, function(memo, val) { return memo + val.min; }, 0);
          chai.assert.isTrue(totalMin <= 170);
          chai.assert.equal(result.accumulator, 38);

          result = MFat.optimize(200);
          totalMin = _.reduce(result.collection, function(memo, val) { return memo + val.min; }, 0);
          chai.assert.isTrue(totalMin <= 200);
          chai.assert.equal(result.accumulator, 50);
        });
    });
})();
