var resultsHtml = function resultsHtml(ownerName, url, description, languageHtml, followers) {
  return `<div class="results">
    <h4>
      <a class="owner">
        ${ ownerName }
        <span class="glyphicon glyphicon glyphicon-info-sign pull-right" aria-hidden="true"></span>
      </a>
    </h4>

    <div class="details hidden">
      <hr>
        <a href="${ url }" target="blank" class="repo-url">
          ${ url }
          <span class="glyphicon glyphicon-new-window" aria-hidden="true"></span>
        </a>
    </br>
      ${ description }
    </br>
    <hr>
      ${ languageHtml }
      <p class="pull-right">
        &nbsp${ followers }
      </p>
      <span class="glyphicon glyphicon-eye-open pull-right"></span>
    </br>
  </div>
</div >`
};

$(document).ready(function () {
  var totalPages = 0;

  // Hide loading div 
  $("#loading-div").hide();
  
  // Disable search button if input is empty
  $("#search-button").attr("disabled", true);
  $("#search-query").keyup(function () {
    ($(this).val().length != 0) ? $("#search-button").attr("disabled", false) : $("#search-button").attr("disabled", true);
  })

    
  var search = function search(page) {
    var searchQuery = $("#search-query").val();
    var url = `https://api.github.com/search/repositories?q=${ searchQuery }&per_page=5&page=${ page }`;
    
    $("#result-count").html("");
    $("#search-result").html("");

    $.ajax({
      type: "GET",
      url: url,
      async: true,
      dataType: "json",
      beforeSend: function () { $("#loading-div").show(); },
      success: function (data) {
        var recordsPerPage = 5;
        var totalRecords = data.total_count;
        var pages = Math.ceil(totalRecords/recordsPerPage);
        totalPages = data.total_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        totalPages = Math.floor(parseInt(totalPages.replace(/\s/g, "").replace(",", "")) / recordsPerPage)
        var resultsShowing = (totalPages > recordsPerPage ) ? `${ recordsPerPage }` : totalPages;
        
        // Show no. of results
        $("#result-count").html(
          `<small class="text-muted">
            Showing page ${ page } of ${ totalPages } results
          </small>`
        );

        // Loop each search result
        for (var i = 0; i < data.items.length; i++) {

          var ownerName = data.items[i].full_name;
          var language = data.items[i].language;
          var followers = data.items[i].watchers.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          var url = data.items[i].html_url;
          var description = data.items[i].description;
          var languagesUrl = data.items[i].languages_url;
          var languageHtml;

          // If values are null show no language / description
          if (!language) {
            var languageHtml = "No language";
          } else {
            $.ajax({
              type: "GET",
              url: languagesUrl,
              async: false,
              dataType: "json",
              success: function (languagesData) {

                var languages = Object.keys(languagesData);
                languageHtml = "";
                languages.slice(0, 6).forEach(function (language) {
                  languageHtml += `<span class="label label-default pull-left x">${language}</span>`
                });

              },

              error: function (errorMessage) {
                $("#search-result").html(
                  "Sorry, GitHub API might be down.."
                )
              }
            });
          }

          if (!description) {
            var description = "No description";
          }

          // Append repo info
          $("#search-result").append(
            resultsHtml(ownerName, url, description, languageHtml, followers)
          );
        };

        $(".pagination").jqPagination({
          max_page: (totalPages),
          paged: function(page) {
            console.log(page);
            search(page);
          }
        });

        // Toggle repo cards
        $(".results").click(function () {
          $(this).children().eq(1).toggleClass("hidden");
        });
      },
      complete: function () { 
        $("#loading-div").hide();
        $(".pagination").css("display","block");
      },
      error: function (errorMessage) {
        $("#search-result").html("Sorry, GitHub API might be down..")
      }
    });
  };

  $("#search-button").click(function () {
    search(1); //load page 1
  });
});