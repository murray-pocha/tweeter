/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// prevents malicious input(XSS)
const escapeHTML = (str) => {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};


// function to create a tweet element
const createTweetElement = (tweet) => {
  //deconstruct tweet object to extract necessary fields
  const { user, content, created_at } = tweet;

  //format the timestamp
  const timeSince = timeago.format(created_at);

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

  // return the HTML wrapped in a jQuery object for DOM manipulation
  return $(tweetHTML);
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
  //load tweets on page load
  loadTweets();

  // handle tweet submission / posts a new tweet and reloads tweets list
  $(".new-tweet form").on("submit", function(event) {
    event.preventDefault();

    const $textarea = $(this).find("#tweet-text");
    const tweetText = $textarea.val().trim();

    if (tweetText.length > 140) {
      alert("Tweet exceeds the 140 character limit!");
      return;
    }

    $.ajax({
      url: "/tweets",
      method: "POST",
      data: $(this).serialize(),
      success: function () {
        $textarea.val("");
        $(".counter").text(140);
        loadTweets();
      },
      error: function (err) {
        console.error("Error posting tweet:", err);
      }
    });
  });
});
