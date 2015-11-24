var expect = require('chai').expect;
var User = require('../models/user');

describe('User', function() {
  var user = new User({username: "stanleyyork", email: "stanleyyork@gmail.com"});

  describe('user initial attributes', function() {
	  it ('should have email', function() {
	    expect(user.email).to.eq("stanleyyork@gmail.com");
	  });

	  it ('should have username', function() {
	    expect(user.username).to.eq("stanleyyork");
	  });
  });

  describe('user initial activities', function() {
    it ('should be an array', function() {
      expect(user.activities).to.be.an('array');
    });

    it ('should initially be empty', function() {
      expect(user.activities).to.be.empty;
    });
  });

});