//'use strict';

var TASTEDIVE_URL = 'https://tastedive.com/api/similar?callback=?';


var RESULT_HTML_TEMPLATE = (
  '<div>' +
    '<h3 class="js-result-name"></h3>' +
    '<a class="js-result-teaser"></a>' +
  '</div>'
);

var RESULTS_IDENTIFIER = '.js-results';
var RESULTS_START_IDENTIFIER = '.js-results-start';
var RESULTS_NAME_IDENTIFIER = '.js-result-name';
var RESULTS_TEASER_IDENTIFIER = '.js-result-teaser';
var SEARCH_FORM_IDENTIFIER = '.js-search-form';

function getDataFromApi(searchTerm, callback) {
  var query = {
    q: searchTerm,
    //type:,
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
  console.log(template);
  /*
  template.find(".js-image").attr("src", result.snippet.thumbnails.medium.url);
  template.find(".js-image-link").attr("href", 
  'https://www.youtube.com/watch?v=' + result.id.videoId)
  console.log(result.name);
  */
  return template;
}

function displayTasteDiveAPI(data) {
  console.log(data);
  var results;
  results = data.Similar.Info.map(function(item, index) {
    return renderResult(item);
  });
  $(RESULTS_START_IDENTIFIER).html(results);

  results = data.Similar.Results.map(function(item, index) {
    return renderResult(item);
  });
  console.log(results);
  $(RESULTS_IDENTIFIER).html(results);

  return(data);
}

function watchSubmit() {
  $(SEARCH_FORM_IDENTIFIER).submit(function(event) {
    event.preventDefault();
    var queryTarget = $(event.currentTarget).find('.js-query');
    var query = queryTarget.val();
    // clear out the input
    queryTarget.val("");
    getDataFromApi(query, displayTasteDiveAPI);
  });
}

$(watchSubmit);
