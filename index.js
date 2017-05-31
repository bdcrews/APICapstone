'use strict';

var TASTEDIVE_URL = 'https://tastedive.com/api/similar?callback=?';

var RESULTS_IDENTIFIER = '.js-results';
var RESULTS_LIST_IDENTIFIER = '.js-results-list';
var RESULTS_START_IDENTIFIER = '.js-results-start';
var RESULTS_NAME_IDENTIFIER = '.js-result-name';
var RESULTS_TEASER_IDENTIFIER = '.js-result-teaser';
var RESULTS_TYPE_IDENTIFIER = '.js-result-type';
var RESULTS_WIKI_URL_IDENTIFIER = '.js-result-wiki-url';
var RESULTS_YOUTUBE_ID_IDENTIFIER = '.js-result-youtube-id';
var RESULTS_YOUTUBE_URL_IDENTIFIER = '.js-result-youtube-url';
var SEARCH_FORM_IDENTIFIER = '.js-search-form';
var RESULT_CONTAINER_IDENTIFIER = '.js-result-container';
var MINIMIZE_IDENTIFIER = 'js-minimize';
var FILTER_BUTTON_IDENTIFIER = '.js_filter_button';
var FILTER_LIST_IDENTIFIER = '.js-filter-list';
var DROPDOWN_BUTTON_IDENTIFIER = '.js_dropBtn';
var SHOW_DROPDOWN_IDENTIFIER = 'js-show'

var IMAGES_LOCATION = 'Images/';
var IMAGE_MUSIC = IMAGES_LOCATION + 'music-player.png';
var IMAGE_MOVIE = IMAGES_LOCATION + 'movie.png';
var IMAGE_SHOW = IMAGES_LOCATION + 'television.png';
var IMAGE_BOOK = IMAGES_LOCATION + 'open-book.png';
var IMAGE_AUTHOR = IMAGES_LOCATION + 'author-sign.png';
var IMAGE_GAME = IMAGES_LOCATION + 'gamepad.png';
var IMAGE_UNKNOWN = IMAGES_LOCATION + 'unknown.png';

var RESULT_HTML_TEMPLATE = (
  '<div class="js-result-container js-minimize">' +
    '<h3 class="js-result-name"></h3>' +
    '<img class="js-result-type">' +
    '<p class="js-result-teaser"></p>' +
    '<p class="js-result-wiki-url"></p>' +
    '<p class="js-result-youtube-id"></p>' +
    '<p class="js-result-youtube-url"></p>' +
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
  template.find(RESULTS_NAME_IDENTIFIER).text(result.Name);
  template.find(RESULTS_TEASER_IDENTIFIER).text(result.wTeaser);
  template.find(RESULTS_TYPE_IDENTIFIER).text(result.Type);
  template.find(RESULTS_WIKI_URL_IDENTIFIER).text(result.wUrl);
  template.find(RESULTS_YOUTUBE_ID_IDENTIFIER).text(result.yID);
  template.find(RESULTS_YOUTUBE_URL_IDENTIFIER).text(result.yUrl);

  var imageSrc;
  switch(result.Type){
    case 'music': imageSrc = IMAGE_MUSIC; break;
    case 'movie': imageSrc = IMAGE_MOVIE; break;
    case 'show': imageSrc = IMAGE_SHOW; break;
    case 'book': imageSrc = IMAGE_BOOK; break;
    case 'author': imageSrc = IMAGE_AUTHOR; break;
    case 'game': imageSrc = IMAGE_GAME; break;
    case 'unknown' : imageSrc = IMAGE_UNKNOWN; break;
    default: console.log(result.Type); break;
  }
  template.find(RESULTS_TYPE_IDENTIFIER).attr("src", imageSrc);
  template.find(RESULTS_TYPE_IDENTIFIER).attr("alt", result.Type + ' image');

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
    $(FILTER_LIST_IDENTIFIER).toggleClass(SHOW_DROPDOWN_IDENTIFIER);
  });
}

$(watchSubmit);
$(watchItemClicked);
$(watchFilterButton);
$(watchFilterDropdown);
