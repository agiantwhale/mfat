(function () {
    'use strict';

    describe('Find the most optimal values to eat.', function () {
        var menu = [
          {min: 5, max: 1},
          {min: 15, max: 1},
          {min: 50, max: 10},
          {min: 40, max: 9},
          {min: 200, max: 50},
        ];

        it('return the correct number', function () {
          MFat.collection(menu, "min", "max");

          {
            var result = MFat.optimize(150);
            var totalMin = _.reduce(result.collection, function(memo, val) {return memo + val.min;}, 0);
            chai.assert.isTrue(totalMin <= 150);
            chai.assert.equal(result.accumulator, 33);
          }

          {
            var result = MFat.optimize(160);
            var totalMin = _.reduce(result.collection, function(memo, val) {return memo + val.min;}, 0);
            chai.assert.isTrue(totalMin <= 160);
            chai.assert.equal(result.accumulator, 36);
          }

          {
            var result = MFat.optimize(170);
            var totalMin = _.reduce(result.collection, function(memo, val) {return memo + val.min;}, 0);
            chai.assert.isTrue(totalMin <= 170);
            chai.assert.equal(result.accumulator, 38);
          }

          {
            var result = MFat.optimize(200);
            var totalMin = _.reduce(result.collection, function(memo, val) {return memo + val.min;}, 0);
            chai.assert.isTrue(totalMin <= 200);
            chai.assert.equal(result.accumulator, 50);
          }
        });
    });
})();
