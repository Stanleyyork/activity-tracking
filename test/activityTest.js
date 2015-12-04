var expect = require('chai').expect;
var Activity = require('../models/activity');

describe('Activity', function() {
  var activity = new Activity({activityLabel: "Read"});

  describe('activity initial attribute', function() {
	  it ('should have activityLabel', function() {
	    expect(activity.activityLabel).to.eq("Read");
	  });
    it ('originalYear should be undefined', function() {
      expect(activity.originalYear).to.eq(undefined);
    });
  });

});