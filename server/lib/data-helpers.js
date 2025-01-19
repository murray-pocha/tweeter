"use strict";

const simulateDelay = (callback) => {
  setTimeout(callback, 1000);
};

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {
    saveTweet: function(newTweet, callback) {
      console.log("Saving tweet:", newTweet);

      // Ensure the new tweet has a `created_at` timestamp
      if (!newTweet.created_at) {
        newTweet.created_at = Date.now();
      }

      simulateDelay(() => {
        db.tweets.push(newTweet);
        console.log("Updated db.tweets:", db.tweets);
        callback(null, true);
      });
    },

    getTweets: function(callback) {
      console.log("Fetching tweets from in-memory database:", db.tweets);
      simulateDelay(() => {
        // Sort tweets by newest first
        const sortNewestFirst = (a, b) => b.created_at - a.created_at;
        const sortedTweets = db.tweets.sort(sortNewestFirst); // Define sortedTweets properly
        console.log("Fetched and sorted tweets:", sortedTweets);
        callback(null, sortedTweets);
      });
    }
  };
};