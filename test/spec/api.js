/* global MFat, chai */

(function () {
  'use strict';

  describe('Load menu info from server', function () {
    this.timeout(15000);

    it('should load dining hall info from the Michigan\'s server.',
       function (done) {
         var request = MFat.scrap('Bursley Dining Hall');

         request.done(function(menus) {
           chai.assert(menus.length !== 0);
           for(var i in menus) {
             var meals = menus[i];
             chai.assert.isAbove(meals.length, 0);
           }

           done();
         });
       }
    );
  });
})();
