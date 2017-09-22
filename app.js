$(document).ready(function(){
  $('#loading-div').hide();

  // Disable search button if input is empty
  $("#search-button").attr("disabled",true);
  $("#search-query").keyup(function(){
    if($(this).val().length !=0)
        $("#search-button").attr('disabled', false);            
    else
        $("#search-button").attr('disabled',true);
  })

  // Get data using keyword
  $("#search-button").click(function(){
    var searchQuery = $("#search-query").val();
    var url = "https://api.github.com/search/repositories?q=" + searchQuery;

    $("#result-count").html("");
    $("#search-result").html("");
    
    $.ajax({
      type: "GET",
      url: url,
      async: true,
      dataType: "json",
      beforeSend: function() { $('#loading-div').show(); },
      complete: function() { $('#loading-div').hide(); },
      success: function(data) {
        // Show no. of results
        var totalCount = data.total_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        $("#result-count").html(
          `<small class="text-muted">
            Showing 30 of ${ totalCount } results
          </small>`
        );

        // Loop each search result
        for(var i=0; i<data.items.length; i++) {
          
          var ownerName = data.items[i].full_name;
          var language = data.items[i].language;
          var followers = data.items[i].watchers;
          var url = data.items[i].html_url;
          var description = data.items[i].description;

          // If value of language & description are null
          if (language === null || language === undefined) {
            var language = "No language";
          }

          if (description === null || description === undefined) {
            var description = "No description";
          }

          // Append info
          $("#search-result").append(
            `<div class="results">
              <h4>
                <a class="owner">
                  ${ ownerName }
                  <span class="glyphicon glyphicon glyphicon-info-sign pull-right" aria-hidden="true"></span>
                </a>
              </h4>
              
              <div class="details hidden">
                <hr>
                <a href="${ url }" target="blank">
                  ${ url } 
                  <span class="glyphicon glyphicon-new-window" aria-hidden="true"></span>
                </a>
                </br>
                ${ description }
                </br>
                <hr>
                <p class="pull-left">
                  ${ language }
                </p>
                <p class="pull-right">
                  &nbsp${ followers }
                </p>
                <span class="glyphicon glyphicon-eye-open
                pull-right"></span>
                </br>
              </div>
            </div>`
          );
        };
        
        // Toggle repo cards
        $(".results").click(function(){
          $(this).children().eq(1).toggleClass( "hidden" );
        });
      },
      error: function(errorMessage){
        $("#search-result").html(
          "Sorry there's an error, GitHub API might be down.."
        )
      }
    })
  })
})