'use strict';

describe('Initialze the stuff', function () {
  // load the controller's module
  beforeEach(module('brickifyApp'));

  var colors;
  var parts;
  var bricks;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_colors_, _bricks_, _parts_) {
    colors = _colors_;
    bricks = _bricks_;
    parts = _parts_;
  }));

  it('All bricks have related data', function () {
    expect(colors).not.toBeNull();
    expect(parts).not.toBeNull();
    expect(bricks).not.toBeNull();
    describe('Test each brick to make sure it has data', function () {
      _.each(bricks, function (brick) {

        it('Testing brick ' + brick.designId + ':' + brick.color, function () {
          expect(_.any(parts, {designId: brick.designId})).toBeTruthy();
          expect(_.any(colors, {num: brick.color})).toBeTruthy();
        });
      });
    })
  });

});
