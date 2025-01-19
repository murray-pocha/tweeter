console.log("comp-char-counter is loaded");


$(document).ready(function() {

  console.log("DOM is ready and composer-char-counter.js is loaded");
  //target the textarea inside .new-tweet
  $(".new-tweet textarea").on("input", function() {

    const inputLength = $(this).val().length;
    const maxLength = 140;
    const remainingChars = maxLength - inputLength;

    //update the counter element
    const counter = $(this).siblings("div").find(".counter");
    counter.text(remainingChars);

    //change counter color if over limit
    if (remainingChars < 0) {
      counter.addClass("over-limit");
    
    } else {
      counter.removeClass("over-limit");
    }
  });

});

