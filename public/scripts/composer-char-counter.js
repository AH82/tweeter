// his file is responsible for the character counter.

// checking this file is being loaded/read.
console.log(`file "composer-char-counter.js" has loaded. This is its first line`);

// HELPER FUNCTION : counts characters left against a max allowed.
const countsRemainingChar = function(textToCount, maxCharCount) {
  // textToCount : is the text which needs to be counted; type string
  // maxCharCount : is the maximum allowed number of characters; type Number.
  let remainCharCount = maxCharCount - textToCount.length;
  console.log(`remaining chars: ${remainCharCount}`);
  return remainCharCount;
}


$(document).ready(function() {
  // --- our code goes here ---
  console.log(`loggin from within : $(document).ready(function() {...}); .. it is working!`)

  // currenttly using event = "keydown" for responsiveness. However it doesn's handle copy/paste without a keypress.
  // Event = "change" works too, handles copy/paste, yet take a while to respond and I'm unsure what specifically fires it.
  $("textarea").on( "keydown", function() {
    // console.log(this);
    // console.log(`Text Input: ${$(this).val()}`);
    let count = countsRemainingChar($(this).val(), 140);
    // console.log($(this).sibling().get( 0 ).tagName )
    const form = $(this).parent().get( 0 ).tagName 
  
    if (count >= 0) {
      $(form).find($(".counter")).text(count).css("color", "inherit");
    } else {
      $(form).find($(".counter")).text(count).css("color", "red");
    }
    // $(span + ".counter").text(count);
  } );
});
