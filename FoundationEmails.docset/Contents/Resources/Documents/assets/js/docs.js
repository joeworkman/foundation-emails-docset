/**
 * This module adds a copy button to all code examples in the docs.
 */

!function() {

// Look for code samples and set up a copy button on each
$('[data-docs-code]').each(function(index, value) {
  var copyBtnId = 'copy-btn-' + index.toString();
  var $button = $('<button class="docs-code-copy" id="' + copyBtnId + '">Copy</button>');

  var text = $(this).find('code').text()
    .replace('&lt;', '<')
    .replace('&gt;', '>');

  $(this).prepend($button);

  var clipboard = new Clipboard('#' + copyBtnId, {
    text: function() {
        return text;
    }
  });

  // Change the text of the copy button when it's clicked on
  clipboard.on('success', function(event) {
    $button.text('Copied!');
    window.setTimeout(function() {
      $button.text('Copy');
    }, 3000);
  });

  // Log errors on copy failure
  clipboard.on('error', function(event) {
      console.error('Action:', event.action);
      console.error('Trigger:', event.trigger);
  });
});

}();

/**
 * This module activates on a Kitchen Sink page, and changes how code examples are rendered.
 * The code example is hidden, and can be revealed with a toggle.
 */

!function() {

var $ks = $('#docs-kitchen-sink');
if (!$ks.length) return;

$ks.find('[data-docs-code]').each(function() {
  var $code = $(this);

  $link = $('<a class="docs-code-toggle">Toggle Code</a>');
  $link.on('click.docs', function() {
    $code.slideToggle(250);
  });
  $link.insertBefore(this);
  $code.addClass('kitchen-sink').hide(0);
});

}();

/**
 * This module sets up the search bar.
 */

!function() {

var source = {
  // Only show 10 results at once
  limit: 10,

  // Function to fetch result list and then find a result;
  source: function(query, sync, async) {
    query = query.toLowerCase();

    $.getJSON('./data/search.json', function(data, status) {
      async(data.filter(function(elem, i, arr) {
        var name = elem.name.toLowerCase();
        var terms = [name, name.replace('-', '')].concat(elem.tags || []);
        for (var i in terms) if (terms[i].indexOf(query) > -1) return true;
        return false;
      }));
    });
  },

  // Name to use for the search result itself
  display: function(item) {
    return item.name;
  },

  templates: {
    // HTML that renders if there are no results
    notFound: function(query) {
      return '<div class="tt-empty">No results for "' + query.query + '".</div>';
    },
    // HTML that renders for each result in the list
    suggestion: function(item) {
      return '<div><span class="name">' + item.name + '<span class="meta">' + item.type + '</span></span> <span class="desc">' + item.description + '</span></div>';
    }
  }
}

// Search
$('[data-docs-search]')
  .typeahead({ highlight: false }, source)
  .on('typeahead:select', function(e, sel) {
    window.location.href = sel.link;
  });

// Auto-highlight unless it's a phone
if (!navigator.userAgent.match(/(iP(hone|ad|od)|Android)/)) {
  $('[data-docs-search]').focus();
}

}();

/**
 * This module generates a table of contents from the <h2>s on a page.
 */

!function() {

var $h2s = $('.docs-component h2');
var $toc = $('[data-docs-toc]');

$h2s.each(function() {
  // Ignore <h2>s inside of a rendered code sample
  if ($(this).parents('.docs-code-live').length) return;

  var text = $(this).text();
  var anchor = $(this).children('a').attr('href');

  $toc.append('<li><a href="'+anchor+'">'+text+'</a></li>');
});

// Initialize Magellan on the generated table of contents
if ($toc.length) {
  if (typeof Foundation !== 'undefined') {
    new Foundation.Magellan($toc, {});
  }
}

}();

// 2. This code loads the IFrame Player API code asynchronously.

if ($('#main-video').is('*')) {
  var $videoOuter = $('#subpage-intro-video');
  var $videoInner = $videoOuter.find('.docs-video-inner');
  var videoId = $('#main-video').data().video;
  var tag = document.createElement('script');

  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // 3. This function creates an <iframe> (and YouTube player)
  //    after the API code downloads.
  var player;
  function onYouTubeIframeAPIReady() {
    player = new YT.Player('main-video', {
      height: '385',
      width: '690',
      videoId: videoId,
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
  }

  // 4. The API will call this function when the video player is ready.
  function onPlayerReady(event) {
  }

  // 5. The API calls this function when the player's state changes.
  //    The function indicates that when playing a video (state=1),
  //    the player should play for six seconds and then stop.
  function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
      $videoInner.addClass('playing');
    } else {
      $videoInner.removeClass('playing');
    }
  }

  var $window = $(window);
  
  $(window).on("scroll", function() {
    var videoOffset = $videoOuter.offset().top;
    var myScrollPosition = $(this).scrollTop();
 
    if (myScrollPosition > videoOffset) {
      $videoInner.addClass('is-stuck');
    } else {
      $videoInner.removeClass('is-stuck');
    }
  });

  $('[data-close-video]').on('click', function() {
    player.stopVideo();
  });

}

!function() {

var $currentText = $('[data-docs-code-current]');
var $toggleButtons = $('[data-docs-code-toggle]');

$toggleButtons.click(function(e) {
  e.preventDefault();
  $('body').toggleClass('is-inky-enabled');

  if ($('body').hasClass('is-inky-enabled')) {
    $currentText.text('Inky');
    $toggleButtons.text('Switch to HTML');
  }
  else {
    $currentText.text('HTML');
    $toggleButtons.text('Switch to Inky');
  }
});

}();

$(document).foundation();
