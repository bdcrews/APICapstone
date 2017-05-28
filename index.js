var YOUTUBE_SEARCH_URL = 'https://tastedive.com/api/similar';


var RESULT_HTML_TEMPLATE = (
  '<div>' +
    '<a class="js-image-link" href=""><img class="js-image" src=""></a>' +
  '</div>'
);

function getDataFromApi(searchTerm, callback) {
  var query = {
    q: searchTerm,
    //type:,
    //info: 1,
    //limit: 5,
    k: '271092-BrandonC-L99WRBFW',
    callback: callback,
  };
  $.getJSON(YOUTUBE_SEARCH_URL, query, callback);
}

function renderResult(result) {
  var template = $(RESULT_HTML_TEMPLATE);
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
  /*var results = data.items.map(function(item, index) {
    return renderResult(item);
  });
  $('.js-search-results').html(results);*/
  return(data);
}

function watchSubmit() {
  $('.js-search-form').submit(function(event) {
    event.preventDefault();
    var queryTarget = $(event.currentTarget).find('.js-query');
    var query = queryTarget.val();
    // clear out the input
    queryTarget.val("");
    getDataFromApi(query, displayTasteDiveAPI);
  });
}

$(watchSubmit);
