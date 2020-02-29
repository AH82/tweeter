// import { json } from "body-parser";

/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// GLOBAL VARIABLES / SETTINGS.
const maxTweetChar = 140;

const createTweetElement = function (tweetData) {
  // const $tweet = $("<section>").addClass("tweet");
  const markup = `
  <section class="tweet">

  <header>
    <div> <img src="${tweetData.user.avatars}" alt=""> ${tweetData.user.name}</div><div class="tweet-header-username">${tweetData.user.handle}</div>
  </header>
  <article>
    ${tweetData.content.text}
  </article>
  <footer>
    <!-- left: tweetAge; right: 3 icons: flag,retweet,heart -->
    <div>${tweetData.created_at}</div><div>RIGHT SIDE FOOTER</div>
  </footer>
</section>
  `


return markup;
// return tweet <article>
}




// Test / driver code (temporary). Eventually will get this from the server.
/* const tweetData = {
  "user": {
    "name": "Newton",
    "avatars": "https://i.imgur.com/73hZDYK.png",
      "handle": "@SirIsaac"
    },
  "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
  "created_at": 1461116232227
}
 */
// const $tweet = createTweetElement(tweetData);

// Fake data taken from initial-tweets.json
// const data = [
//   {
//     "user": {
//       "name": "Newton",
//       "avatars": "https://i.imgur.com/73hZDYK.png"
//       ,
//       "handle": "@SirIsaac"
//     },
//     "content": {
//       "text": "If I have seen further it is by standing on the shoulders of giants"
//     },
//     "created_at": 1461116232227
//   },
//   {
//     "user": {
//       "name": "Descartes",
//       "avatars": "https://i.imgur.com/nlhLi3I.png",
//       "handle": "@rd" },
//     "content": {
//       "text": "Je pense , donc je suis"
//     },
//     "created_at": 1461113959088
//   }
// ]

const renderTweets = function (arrayOfTweetObjs) { /* tweets */
  // appending each tweet to the #tweets-container
  // loops through tweets
  for ( let tweetObj of arrayOfTweetObjs) {
    console.log(tweetObj);
    // calls createTweetElement for each tweet
    // takes return value and appends it to the tweets container
    let $tweet = createTweetElement(tweetObj);
    $('#tweets-container').append($tweet);
  }
}
// $(document).ready(function() {
//   // renderTweets(data);
//   });


  $(function() {
    const loadTweets = function() { 
      $.ajax({
        method: 'GET',
        url:'/tweets'
      
      })
      .then(function(tweetData) {
        console.log('tweetData is : ', tweetData);
        renderTweets(tweetData);
      }   
      )};
      loadTweets();
  });

$(function(){
  const $submitTweetButton = $('.new-tweet').find('input');
  console.log($submitTweetButton);
  $submitTweetButton.on('click', function(event) {
    console.log('EVENT OF PREV',event)
    console.log('New Tweet Button clicked, performing ajax call...');
    event.preventDefault();
    console.log('HEEERE, UNSURREAL', $(this).parents('form') );
    console.log('HEEERE, SURREAL', $(this).parents('form').serialize() );
    const $tweetText = $(this).parents('form').serialize() ;
    // VALIDATION: tweetbox can not be null or ex
    // debugger;
    // NOTE TO FUTURE SELF: LEAVING "text=" AS IS COULD BE PROBLEMATIC IN THE FUTURE, YOUR PRESENT.
    if ($tweetText === "text=" ) {
      alert("The Tweet Box can not be empty.");
    } else if ($tweetText.length > maxTweetChar) {
      alert(`The Tweet box can not exceed ${maxTweetChar} characters`);
    } else {
      $.ajax( { 
        method: 'POST',
        url:'/tweets',
        data: $tweetText,
      })
      .then(function (tweetPost) { //the callback argument value from the ajax request.
        
      console.log('Success: ', tweetPost);
        // $submitTweetButton.replaceWith(tweetPost);

      });
    }

  });
});

