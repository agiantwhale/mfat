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

        menu = menu.sort(function(a, b) {
          return a["min"] - b["min"];
        });

        it('return the correct number', function () {
          assert.equal(optimize(menu, {control: "min", response: "max", target: 150}).accumulator, 33);
          assert.equal(optimize(menu, {control: "min", response: "max", target: 160}).accumulator, 36);
          assert.equal(optimize(menu, {control: "min", response: "max", target: 170}).accumulator, 38);
          assert.equal(optimize(menu, {control: "min", response: "max", target: 200}).accumulator, 50);
        });

        // it('should complete within reasonable time', function () {
        //   var bigMenu = [];
        //   for (var i = 0; i < 100; i++) {
        //     bigMenu.push({max: Math.random() * i + 1, min: Math.random() * i});
        //   }
        //   optimize(bigMenu, {control: "max", response: "min", target: 200});
        // });
    });
})();
