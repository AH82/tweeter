// import { json } from "body-parser";

/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// GLOBAL VARIABLES / SETTINGS.
const maxTweetChar = 140;

//HELPER FUNCTION: GET DATE DIFFERENCE
const getTweetAge = function(tweetCreateTime) {
  let date = (Date.now() - tweetCreateTime)/(1000*60*60*24)
  if (date < 1) {
    return Math.floor(date*24) + " hrs ago";
  } else return Math.floor(date) + " days ago"
}

const createTweetElement = function (tweetData) {
  // const $tweet = $("<section>").addClass("tweet");
  // document.createTextNode(str)
  console.log('tweetData = ', tweetData)
  console.log('tweetData.content.text =', tweetData.content.text)
  const $tweet = $('<article>').text(tweetData.content.text);
  console.log('$tweet = ',$tweet)
  console.log('$tweet[0].innerHTML = ', $tweet[0].innerHTML)
  const dateAgo = getTweetAge(tweetData.created_at)
  const markup = `
  <section class="tweet">

  <header>
    <div> <img src="${tweetData.user.avatars}" alt=""> ${tweetData.user.name}</div><div class="tweet-header-username">${tweetData.user.handle}</div>
  </header>

<article>`
+$tweet[0].innerHTML+ 
`</article>

  <footer>
    <!-- left: tweetAge; right: 3 icons: flag,retweet,heart -->
    <div>${dateAgo}</div><div>RIGHT SIDE FOOTER</div>
  </footer>
</section>
  `
/*
 <article>
    ${tweetData.content.text}
    ${document.createTextNode(tweetData.content.text)['text']}
  </article>
*/

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
  $('#tweets-container').empty();
  // appending each tweet to the #tweets-container
  // loops through tweets
  for ( let tweetObj of arrayOfTweetObjs) {
    console.log(tweetObj);
    // calls createTweetElement for each tweet
    // takes return value and appends it to the tweets container
    let $tweet = createTweetElement(tweetObj);
    $('#tweets-container').prepend($tweet);
  }
}
// $(document).ready(function() {
//   // renderTweets(data);
//   });

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

  $(function() {
      loadTweets();
  });

$(function(){
  $('.new-tweet').hide();
  $('.tweetValidationError').hide();

  const $submitTweetButton = $('.new-tweet').find('input');
  console.log($submitTweetButton);
  $submitTweetButton.on('click', function(event) {
    console.log('EVENT OF PREV',event)
    console.log('New Tweet Button clicked, performing ajax call...');
    event.preventDefault();
    // console.log('HEEERE, UNSURREAL', $(this).parents('form') );
    console.log('HEEERE, SURREAL', $(this).parents('form').serialize() );
    const $tweetText = $(this).parents('form').serialize() ;
    // VALIDATION: tweetbox can not be null or ex
    // debugger;
    // NOTE TO FUTURE SELF: LEAVING "text=" AS IS COULD BE PROBLEMATIC IN THE FUTURE, YOUR PRESENT.
    if ($tweetText === "text=" ) {
      // alert("The Tweet Box can not be empty.");
      $('.tweetValidationError').slideDown(1000)
      $('.tweetValidationError > div').html("The Tweet Box can not be empty.");

    } else if ($tweetText.length > maxTweetChar) {
      // alert(`The Tweet box can not exceed ${maxTweetChar} characters`);
      $('.tweetValidationError').slideDown(1000);
      $('.tweetValidationError > div').text(`The Tweet box can not exceed ${maxTweetChar} characters`)
      // maxTweetChar is on top, in "GLOBAL VARIABLES".
    } else {
      $('.tweetValidationError').slideUp(1000)
      $.ajax( { 
        method: 'POST',
        url:'/tweets',
        data: $tweetText,
      })
      .then(function () { 
      loadTweets();
      console.log('Success: ');
        // $submitTweetButton.replaceWith(tweetPost);
        // $('#tweets-container').append(tweetPost);
      });
    }

  });
});

$(function(){
  const writeNewTweetButton = $('nav > button');
  writeNewTweetButton.on('click', function(event){
    $('.new-tweet').slideToggle(1000);
  } )
})