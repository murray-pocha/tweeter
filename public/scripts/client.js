/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

/* global timeago */
/* global $ */
/* eslint-disable no-undef */



// prevents malicious input(XSS)
const escapeHTML = (str) => {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};


// function to create a tweet element
const createTweetElement = (tweet) => {
  const { user, content, createdAt } = tweet; //deconstruct tweet object to extract necessary fields
  const timeSince = timeago.format(createdAt); //format the timestamp

  //construct the HTML structure for the tweet
  const tweetHTML = `
  <article class="tweet">
   <header class="tweet-header">
    <div class="tweet-avatar">
     <img src="${user.avatars}" alt="Avatar of ${user.name}">
    </div>
    <div class ="tweet-user-info">
     <p class="tweet-username">${user.name}</p>
     <p class="tweet-handle">${user.handle}</p>
    </div>
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


  return $(tweetHTML); // return the HTML wrapped in a jQuery object for DOM manipulation
};

//function to render multiple tweets at once
const renderTweets = (tweets) => {
  tweets.forEach((tweet) => {
    const $tweet = createTweetElement(tweet); //create each tweet element
    $("#tweets-list").prepend($tweet); // prepend to the tweets container
  });
};

// fetch tweets from the server
const loadTweets = () => {
  $.ajax({
    url: "/tweets",
    method: "GET",
    success: function(tweets) {
      renderTweets(tweets); // render tweets on success
    },
    error: function(err) {
      console.error("Error loading tweets:", err);
    }
  });
};


$(document).ready(function() {
  console.log("DOM is ready.");

  // handle tweet submission / posts a new tweet and reloads tweets list
  $(".new-tweet form").on("submit", function(event) {
    event.preventDefault();

    const $textarea = $(this).find("#tweet-text");
    const tweetText = $textarea.val().trim();

    if (!tweetText) {
      showError("🛑 Tweet cannot be empty!");
      return;
    }

    if (tweetText.length > 140) {
      showError("🤔Tweet exceeds the 140 character limit!");
      return; // exit function after showing error
    }


    console.log("Error message container exists:", $("#error-message").length > 0);
    // hide the error message on manual close
    if ($("#error-text").length === 0) {
      $("#error-message").prepend('<span id="error-text"></span>');

    }

    // Hide the error message on manual close
    $("#close-error").on("click", function() {
      $("#error-message").slideUp();
    });




    // hide the error message initially
    $("#error-message").slideUp();
    $("#error-message").removeClass("hidden").find("#error-text").text("");

    // Log the current state of #error-message after clearing it
    console.log("After clearing error message:", $("#error-message").html());


    $.ajax({
      url: "/tweets",
      method: "POST",
      data: $(this).serialize(),
      success: function() {
        $textarea.val("");       // clear the textarea
        $(".counter").text(140); // reset char counter
        loadTweets();            // reload tweets to include new one
      },
      error: function(err) {
        showError("An error occurred while posting your tweet. Please try again.");
        console.error("Error posting tweet:", err);
      }
    });

    //load tweets on page load
    loadTweets();
  });

  const showError = (message) => {
    console.log("showError called with message:", message);

    const errorTextElement = $("#error-text"); // Select the element
    console.log("Error text element exists:", errorTextElement.length > 0); // Log if it exists

    if (errorTextElement.length === 0) {
      console.error("Error: #error-text not found in the DOM!");
    } else {
      errorTextElement.text(message); // Add the error message
      console.log("After adding text:", errorTextElement.html());
      $("#error-message").removeClass("hidden").slideDown(); // Show the error message
    }
  };
});