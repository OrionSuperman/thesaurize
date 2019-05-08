var assert = require("assert");
var should = require("should");

const thesaurize = require("../index.js");

describe("Thesaurize", function() {
  describe("#thesaurize()", function() {
    it("should not change common words", function() {
      var result = thesaurize("the world");
      result.should.startWith("the");
    });

    it("should change words", function() {
      var result = thesaurize("the world");
      result.should.not.endWith("world");
    });

    it("should not crash when a word does not exist", function() {
      var result = thesaurize("the including");
      result.should.endWith("including");
    });
  });
});
