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
          var url = data.items[i].html_url;
          var description = data.items[i].description;

          $("#search-result").prepend(
            `<div class="results">
              <h4><a class="owner">${ ownerName }</a></h4>
              <div class="details hidden">
                <b>Language: </b>${ language }
                </br><b>URL: </b>${ url }
                </br><b>Description: </b>${ description }
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
        $("#search-result").prepend(
          "Sorry, there's an error. </br> Github API might be down.."
        )
      }
    })
  })
})