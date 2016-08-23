/* global TheResolver, chai, _ */

(function () {
    'use strict';

    describe('DPResolver', function () {
        it('return the correct number', function () {
          var menu = [
            {min: 5, max: 1},
            {min: 15, max: 1},
            {min: 50, max: 10},
            {min: 40, max: 9},
            {min: 200, max: 50}
          ];

          const TheResolver = new DPResolver('min', 'max');

          var result = TheResolver.optimize(menu, 150);
          var totalMin = _.reduce(result.collection, function(memo, val) { return memo + val.min; }, 0);
          chai.assert.isTrue(totalMin <= 150);
          chai.assert.equal(result.accumulator, 33);

          result = TheResolver.optimize(menu, 160);
          totalMin = _.reduce(result.collection, function(memo, val) { return memo + val.min; }, 0);
          chai.assert.isTrue(totalMin <= 160);
          chai.assert.equal(result.accumulator, 36);

          result = TheResolver.optimize(menu, 170);
          totalMin = _.reduce(result.collection, function(memo, val) { return memo + val.min; }, 0);
          chai.assert.isTrue(totalMin <= 170);
          chai.assert.equal(result.accumulator, 38);

          result = TheResolver.optimize(menu, 200);
          totalMin = _.reduce(result.collection, function(memo, val) { return memo + val.min; }, 0);
          chai.assert.isTrue(totalMin <= 200);
          chai.assert.equal(result.accumulator, 50);
        });
    });
})();
