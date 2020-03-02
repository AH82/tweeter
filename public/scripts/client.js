// import { json } from "body-parser";

/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// GLOBAL VARIABLES / SETTINGS.
const maxTweetChar = 140;

//HELPER FUNCTION: GET DATE AGE of a tweet
const getTweetAge = function(tweetCreateTime) {
  let date = (Date.now() - tweetCreateTime) / (1000 * 60 * 60 * 24);
  if (date < 1) {
    return Math.floor(date * 24) + " hrs ago";
  } else return Math.floor(date) + " days ago";
};

// HELPER/ INIT FUNCTION: creates new tweet HTML elements, feedsinto renderTweets().
const createTweetElement = function(tweetData) {
  console.log('tweetData = ', tweetData);
  console.log('tweetData.content.text =', tweetData.content.text);
  const $tweet = $('<article>').text(tweetData.content.text);
  console.log('$tweet = ',$tweet);
  console.log('$tweet[0].innerHTML = ', $tweet[0].innerHTML);
  const dateAgo = getTweetAge(tweetData.created_at);
  const rightSideFooter =
  `<img src="/images/flagIcon.png" alt="" height="15px" width="15px"> 
  <img src="/images/retweetIcon.png" alt="" height="15px" width="15px"> 
  <img src="/images/heartIcon.png" alt="" height="15px" width="15px"> 
  `;
  const markup = `
  <section class="tweet">

  <header>
    <div> <img src="${tweetData.user.avatars}" alt=""> ${tweetData.user.name}</div><div class="tweet-header-username">${tweetData.user.handle}</div>
  </header>

<article>`
+ $tweet[0].innerHTML +
`</article>

  <footer>
    <!-- left: tweetAge; right: 3 icons: flag,retweet,heart -->
    <div>${dateAgo}</div><div class="RSF">${rightSideFooter}</div>
  </footer>
</section>
  `;

  return markup;
};

// FUNCTION: render tweets from database to the page.
const renderTweets = function(arrayOfTweetObjs) { /* tweets */
  $('#tweets-container').empty();
  // appending each tweet to the #tweets-container
  // loops through tweets
  for (let tweetObj of arrayOfTweetObjs) {
    console.log(tweetObj);
    // calls createTweetElement for each tweet
    // takes return value and appends it to the tweets container
    let $tweet = createTweetElement(tweetObj);
    $('#tweets-container').prepend($tweet);
  }
};

// FUNCTION: ASYNC/AJAX : Get request from database
const loadTweets = function() {
  $.ajax({
    method: 'GET',
    url:'/tweets'
  
  })
    .then(function(tweetData) {
      console.log('tweetData is : ', tweetData);
      renderTweets(tweetData);
    }
    );
};

// calling loadTweets
$(function() {
  loadTweets();
});

// TWEET user submition logic
$(function() {
  $('.new-tweet').hide();
  $('.tweetValidationError').hide();

  const $submitTweetButton = $('.new-tweet').find('input');
  console.log($submitTweetButton);
  $submitTweetButton.on('click', function(event) {
    console.log('EVENT OF PREV',event);
    console.log('New Tweet Button clicked, performing ajax call...');
    event.preventDefault();
    const $tweetText = $(this).parents('form').serialize();

    // VALIDATIONS: Empty box or max char exceeded, followed by logic POST REQ

    if ($tweetText === "text=") {
      // NOTE TO FUTURE SELF: LEAVING "text=" AS IS COULD BE PROBLEMATIC IN THE FUTURE, YOUR PRESENT.
      $('.tweetValidationError').slideDown(1000);
      $('.tweetValidationError > div').html("The Tweet Box can not be empty.");

    } else if ($tweetText.length > maxTweetChar) {
      // alert(`The Tweet box can not exceed ${maxTweetChar} characters`);
      $('.tweetValidationError').slideDown(1000);
      $('.tweetValidationError > div').text(`The Tweet box can not exceed ${maxTweetChar} characters`);
      // maxTweetChar is on top, in "GLOBAL VARIABLES".
    } else {
      $('.tweetValidationError').slideUp(1000);
      $.ajax({
        method: 'POST',
        url:'/tweets',
        data: $tweetText,
      })
        .then(function() {
          $('.new-tweet textarea').val('');
          $('.new-tweet').find('span.counter').text(maxTweetChar);
          loadTweets();
          console.log('Success: ');
        });
    }

  });
});

// NAV BAR event listening and functionality.
$(function() {
  const writeNewTweetButton = $('nav > button');
  writeNewTweetButton.on('click', function(event) {
    $('.new-tweet').slideToggle(1000);
  });
});