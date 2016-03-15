/* global MFat, chai, _ */

(function (_) {
  'use strict';

  describe('Load menu info from server', function () {
    this.timeout(15000);

    it('should load dining hall info from the Michigan\'s server.',
       function (done) {
         var request = MFat.scrap('Bursley Dining Hall');

         request.done(function(menus) {
           chai.assert(menus.length !== 0);
           _.each(menus, function(meals) {
             _.each(meals, function(meal) {
               chai.expect(meal).to.include.keys('name');
               chai.expect(meal).to.include.keys('portion');
               chai.expect(meal).to.include.keys('serving');
               _.each(MFat.shortCodes, function(obj, key) {
                 chai.expect(meal).to.include.keys(key);
                 chai.assert.isNumber(meal[key]);
                 chai.assert(!_.isNaN(meal[key]));
               });
             });
           });

           done();
         });
       }
    );
  });
})(_);
