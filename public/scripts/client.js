/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

/* global timeago */
/* global $ */
/* eslint-disable no-undef */

const escapeHTML = (str) => {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

const createTweetElement = (tweet) => {
  console.log("createTweetElement input:", tweet);

  try {
    if (!tweet || !tweet.user || !tweet.content) {
      console.error("Invalid tweet structure:", tweet);
      return "<div class='error'>Invalid tweet data</div>";
    }

    const { user, content, created_at } = tweet;
    console.log("Extracted tweet data:", { user, content, created_at });
    const timeSince = timeago.format(created_at || Date.now());

    const tweetHTML = `
    <article class="tweet">
      <header class="tweet-header">
        <div class="tweet-avatar">
          <img src="${user.avatars || 'https://via.placeholder.com/50'}" alt="Avatar of ${user.name || "Anonymous"}">
        </div>
       
          <span class="tweet-username">${user.name || "Anonymous"} </span>
          <span class="tweet-handle">${user.handle || "@anonymous"} </span>
       
      </header>
      <main class="tweet-body">
        <p>${escapeHTML(content.text)}</p>
      </main>
      <footer class="tweet-footer">
        <span class="tweet-timestamp">${timeSince}</span>
        <div class="tweet-actions">
          <i class="fas fa-flag"></i>
          <i class="fas fa-retweet"></i>
          <i class="fas fa-heart"></i>
        </div>
      </footer>
    </article>
  `;
    console.log("Generated tweet HTML:", tweetHTML);
    return $(tweetHTML);
  } catch (error) {
    console.error("Error in createTweetElement:", error);
    return `<div class="error">Error rendering tweet</div>`;
  }
};

const renderTweets = (tweets) => {
  console.log("Tweets passed to renderTweets:", tweets);

  // Ensure tweets is an array
  if (!Array.isArray(tweets)) {
    console.error("renderTweets received invalid data:", tweets);
    return;
  }

  // Clear existing tweets to avoid duplicates
  $("#tweets-list").empty();

  // Append each tweet to the list
  tweets.forEach((tweet) => {
    console.log("Processing tweet:", tweet);
    try {
      const $tweet = createTweetElement(tweet);
      $("#tweets-list").prepend($tweet);
    } catch (error) {
      console.error("Error rendering tweet:", tweet, error);
    }
  });
};

const loadTweets = () => {
  console.log("loadTweets called");
  $.ajax({
    url: "/tweets",
    method: "GET",
    success: function(tweets) {
      console.log("AJAX response received:", tweets);

      // Check if tweets is an array and log the first item
      if (Array.isArray(tweets)) {
        console.log("First tweet in response:", tweets[0]);
        console.log("Number of tweets received:", tweets.length);
      } else {
        console.error("Unexpected response format:", tweets);
      }


      const reversedTweets = tweets.reverse();
      console.log("Tweets after rendering:", tweets);
      renderTweets(tweets);
    },
    error: function(err) {
      console.error("Error loading tweets:", err);
    }
  });
};

$(document).ready(function() {
  console.log("DOM is ready.");

  $(".new-tweet form").on("submit", function(event) {
    event.preventDefault();

    const $textarea = $(this).find("#tweet-text");
    const tweetText = $textarea.val().trim();

    if (!tweetText) {
      showError("🛑 Tweet cannot be empty!");
      return;
    }
    if (tweetText.length > 140) {
      showError("🤔 Tweet exceeds the 140 character limit!");
      return;
    }

    console.log("Error message container exists:", $("#error-message").length > 0);
    if ($("#error-text").length === 0) {
      $("#error-message").prepend('<span id="error-text"></span>');
    }

    $("#close-error").on("click", function() {
      $("#error-message").slideUp();
    });

    $("#error-message").slideUp();
    $("#error-message").removeClass("hidden").find("#error-text").text("");

    console.log("After clearing error message:", $("#error-message").html());

    $.ajax({
      url: "/tweets",
      method: "POST",
      data: $(this).serialize(),
      success: function() {
        loadTweets(); // Reload all tweets after posting a new one
        $textarea.val(""); // Clear the text area
        console.log("Textarea cleared successfully.");
        $(".counter").text(140); // Reset the character counter
      },
      error: function(err) {
        showError("An error occurred while posting your tweet. Please try again.");
        console.error("Error posting tweet:", err);
      }
    });
  });

  const showError = (message) => {
    console.log("showError called with message:", message);

    const errorTextElement = $("#error-text");
    console.log("Error text element exists:", errorTextElement.length > 0);

    if (errorTextElement.length === 0) {
      console.error("Error: #error-text not found in the DOM!");
    } else {
      errorTextElement.text(message);
      console.log("After adding text:", errorTextElement.html());
      $("#error-message").removeClass("hidden").slideDown();
    }
  };

  // Initial load of tweets
  loadTweets();
});