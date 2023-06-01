$(document).ready(function () {
  $("#searchInput").on("input", function () {
    var query = $(this).val();
    $("#infop").empty();
    if (query) {
      $.ajax({
        type: "POST",
        url: "/autocomplete",
        data: { q: query },
        success: function (data) {
          var suggestions = data.map(function (suggestion) {
            return "<li>" + suggestion + "</li>";
          });
          $("#autocompleteList").html(suggestions.join(""));
        },
        error: function (error) {
          console.log("no data");
        },
      });
    } else {
      $("#autocompleteList").empty();
    }
  });
});
$(document).ready(function () {
  $("#searchButton").click(function () {
    $("#autocompleteList").empty();
    var query = $("#searchInput").val();
    if (query) {
      $.ajax({
        type: "POST",
        url: "/searchmore",
        data: { q: query },
        success: function (data) {
          // 處理搜索結果
          console.log(data);
          var suggestions = data.map(function (suggestion) {
            //- return '<div>' + suggestion.overview + '</div>';
            return `
              <div class="movie">  
                <div class="movie-title"> Title: ${suggestion.title} </div>
                <div class="movie-rel_date"> Release Date: ${suggestion.release_date} </div>
                <div class="movie-overview"> ${suggestion.overview} </div>
              </div>
              `;
          });
          $("#infop").html(suggestions.join(""));
        },
        error: function (error) {
          console.log("no data");
        },
      });
    } else {
      $("#infop").empty();
    }
  });
});
