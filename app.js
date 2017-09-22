$(document).ready(function(){
  $("#search-button").click(function(){
    
    var searchQuery = $("#search-query").val();
    var url = "https://api.github.com/search/repositories?q=" + searchQuery;
    
    $.ajax({
      type: "GET",
      url: url,
      async: true,
      dataType: "json",
      success: function(data) {
        $("#search-result").html("");

        for(var i=0; i<data.items.length; i++) {
          var ownerName = data.items[i].full_name;
          var language = data.items[i].language;
          var followers = data.items[i].watchers;
          var url = data.items[i].html_url;
          var description = data.items[i].description;

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
        
        $(".results").click(function(){
          $(this).children().eq(1).toggleClass( "hidden" );
        });
      },
      error: function(errorMessage){
        $("#search-result").append(
          "Sorry there's an error, GitHub API might be down.."
        )
      }
    })
  })
})