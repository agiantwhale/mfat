/* global MichiganResource */

(function () {
  'use strict';

  describe('Load menu info from server', function () {
    this.timeout(15000);

    it('should load dining hall info from the Michigan\'s server.',
       function (done) {
         var resource = new MichiganResource('Bursley Dining Hall');
         var request = resource.retrieve();

         request.done(function() {
           assert(resource.menus.length != 0);
           for(var i in resource.menus) {
             var meals = resource.menus[i];
             assert.isAbove(meals.length, 0);
           }

           done();
         });
       }
    );
  });
})();
