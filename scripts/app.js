// Show information of each repo
function resultsHtml(ownerName, url, description, languageHtml, followers) {
  return `<div class="results-container">
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
  // Hide loading div 
  $("#loading-div").hide();
  
  // Disable search button if input is empty
  $("#search-button").attr("disabled", true);
  $("#search-query").keyup(function () {
    ($(this).val().length != 0) ? $("#search-button").attr("disabled", false) : $("#search-button").attr("disabled", true);
  })
  
  // Search function
  function search(page) {
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
        var totalRecords = (data.total_count > 1000) ? 1000 : data.total_count; // only first 1000 results available
        var totalCount = totalRecords.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        var pagesCount = Math.floor(parseInt(totalRecords / recordsPerPage));
        var totalPages = (pagesCount > 200) ? 200 : (pagesCount === 0) ? 1 : pagesCount; // only first 200 pages available

        // Pagination
        $(".pagination").jqPagination({
          max_page: (totalPages),
          paged: function(page) {
            search(page);
          }
        });
        
        // Show no. of pages & results
        $("#result-count").html(
          `<p class="text-muted">
            Page ${ page } of ${ totalPages } (${ totalRecords } results)
          </p>`
        );

        // If no results show message
        if (totalRecords === 0) {
          $("#search-result").html("No results found for this keyword..");
        }

        // Loop each search result
        for (var i = 0; i < data.items.length; i++) {
          var ownerName = data.items[i].full_name;
          var language = data.items[i].language;
          var followers = data.items[i].watchers.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          var url = data.items[i].html_url;
          var description = data.items[i].description;
          var languagesUrl = data.items[i].languages_url;
          var languageHtml;

          // If value null, show no language
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

          // If description null, show no description
          if (!description) {
            var description = "No description";
          }

          // Append repo info
          $("#search-result").append(
            resultsHtml(ownerName, url, description, languageHtml, followers)
          );
        };

        // Toggle repo cards
        $(".results-container").click(function () {
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
    $(".pagination").load(location.href + " .pagination"); // reset pagination
    var totalPages = 0;
    search(1); // load page 1
  });
});