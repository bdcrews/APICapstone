'use strict';

var TASTEDIVE_URL = 'https://tastedive.com/api/similar?callback=?';

var RESULTS_IDENTIFIER = '.js-results';
var RESULTS_LIST_IDENTIFIER = '.js-results-list';
var RESULTS_START_IDENTIFIER = '.js-results-start';
var RESULTS_NAME_IDENTIFIER = '.js-result-name';
var RESULTS_TEASER_IDENTIFIER = '.js-result-teaser';
var RESULTS_TYPE_IDENTIFIER = '.js-result-type';
var RESULTS_YOUTUBE_URL_IDENTIFIER = '.js-result-youtube-url';
var SEARCH_FORM_IDENTIFIER = '.js-search-form';
var RESULT_CONTAINER_IDENTIFIER = '.js-result-container';
var MINIMIZE_IDENTIFIER = 'js-minimize';
var FILTER_BUTTON_IDENTIFIER = '.js_filter_button';
var FILTER_LIST_IDENTIFIER = '.js-filter-list';
var DROPDOWN_BUTTON_IDENTIFIER = '.js_dropBtn';
var SHOW_DROPDOWN_IDENTIFIER = 'js-show'

//var IMAGES_LOCATION = 'Images/';
//var IMAGE_WIKIPEDIA = IMAGES_LOCATION + 'wikipedia.png';

var RESULT_HTML_TEMPLATE = (
  '<div class="js-result-container js-minimize">' +
    '<div class="js-result-type material-icons md-48 icon"></div>' +
    '<h3 class="js-result-name"></h3>' +
    '<iframe class="js-result-youtube-url youtube-video" allowFullScreen></iframe>' + 
    '<p class="js-result-teaser"><a class="js-result-wiki wiki_link"></a></p>' +
  '</div>'
);

var STATE = {
  filter: 'none',
};

function getDataFromApi(searchTerm, callback, filterValue) {
  var query = {
    q: searchTerm,
    type: filterValue,
    info: 1,
    limit: 5,
    k: '271092-BrandonC-L99WRBFW',
    //callback: callback,
  };
  console.log(query);
  $.getJSON(TASTEDIVE_URL, query, callback);
}

function renderResult(result) {
  var template = $(RESULT_HTML_TEMPLATE);

  if(result.Type !== 'unknown')
  {
    template.find(RESULTS_NAME_IDENTIFIER).text(result.Name);
    template.find(RESULTS_TEASER_IDENTIFIER).text(result.wTeaser);
    template.find(RESULTS_TYPE_IDENTIFIER).text(result.Type);
    template.find(RESULTS_TEASER_IDENTIFIER).append('<a href="' + result.wUrl + '">[more] </a>');
    var strYouTubeStr = 'https://www.youtube.com/embed/' + result.yID;
    template.find(RESULTS_YOUTUBE_URL_IDENTIFIER).attr('src',strYouTubeStr);
  }
  else
  {
    template.find(RESULTS_NAME_IDENTIFIER).text("No suggestions found.  Try again.");
    template.find(RESULTS_YOUTUBE_URL_IDENTIFIER).hide();
  }

  var icon;
   switch(result.Type){
     case 'music': icon = 'music_note'; break;
     case 'movie': icon = 'local_movies'; break;
     case 'show': icon = 'tv'; break;
     case 'book': icon = 'book'; break;
     case 'author': icon = 'person'; break;
     case 'game': icon = 'videogame_asset'; break;
     case 'unknown' : icon = 'error_outline'; break;
   }

  template.find(RESULTS_TYPE_IDENTIFIER).text(icon);

  return template;
}

function displayTasteDiveAPI(data) {
  console.log(data);
  var results;
  results = data.Similar.Info.map(function(item, index) {return renderResult(item);});
  $(RESULTS_START_IDENTIFIER).html(results);
  results = data.Similar.Results.map(function(item, index) {return renderResult(item);});
  $(RESULTS_LIST_IDENTIFIER).html(results);
  return(data);
}

function watchSubmit() {
  $(SEARCH_FORM_IDENTIFIER).submit(function(event) {
    event.preventDefault();
    var queryTarget = $(event.currentTarget).find('.js-query');
    var query = queryTarget.val();
    // clear out the input
    queryTarget.val("");
    getDataFromApi(query, displayTasteDiveAPI, STATE.filter);
  });
}

function watchItemClicked() {
  $(RESULTS_IDENTIFIER).on('click', RESULT_CONTAINER_IDENTIFIER, function(event) {
    $(this).toggleClass(MINIMIZE_IDENTIFIER);
  });
}

function watchFilterButton() {
  $(FILTER_BUTTON_IDENTIFIER).click(function(event) {
    $(FILTER_LIST_IDENTIFIER).toggleClass(SHOW_DROPDOWN_IDENTIFIER);
  });
}

function watchFilterDropdown() {
  $(FILTER_LIST_IDENTIFIER).click(function(event) {
    STATE.filter = $(event.target).attr('value');
    $(FILTER_BUTTON_IDENTIFIER).text(STATE.filter);
    $(FILTER_LIST_IDENTIFIER).removeClass(SHOW_DROPDOWN_IDENTIFIER);
  });
}

$(watchSubmit);
$(watchItemClicked);
$(watchFilterButton);
$(watchFilterDropdown);
