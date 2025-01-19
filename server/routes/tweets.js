"use strict";

const express = require("express");
const tweetsRoutes = express.Router();

module.exports = function (DataHelpers) {

  tweetsRoutes.get("/", (req, res) => {
    DataHelpers.getTweets((err, tweets) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        console.log("Sending tweets to frontend:", tweets); // Add this log
        res.json(tweets);
      }
    });
  });
  

  tweetsRoutes.post("/", function (req, res) {
    if (!req.body.text) {
      res.status(400).json({ error: "invalid request: no data in POST body" });
      return;
    }

   
    const tweet = {
      user: {
        name: "Anonymous",
        avatars: "https://i.imgur.com/73hZDYK.png",
        handle: "@anonymous",
      },
      content: {
        text: req.body.text,
        createdAt: Date.now(),
      },
    };
    console.log("Tweet object being saved:", tweet);

    DataHelpers.saveTweet(tweet, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send();
      }
    });
  });

  return tweetsRoutes;
};
