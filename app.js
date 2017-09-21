$(document).ready(function(){
  $("#searchButton").click(function(){
    
    var searchQuery = $("#searchQuery").val();
    var url = "https://api.github.com/search/repositories?q=" + searchQuery;
    
    $.ajax({
      type: "GET",
      url: url,
      async: true,
      dataType: "json",
      success: function(data) {
        $("#searchResult").html("");
        console.log("GET Success");
        console.log(url);
        console.log(data);
        console.log(data.items[0].full_name);

        for(var i=0; i<data.items.length; i++) {
          var ownerName = data.items[i].full_name;
          var language = data.items[i].language;
          var url = data.items[i].html_url;
          var description = data.items[i].description;

          $("#searchResult").prepend("<h4><a id='infoBtn'>" + ownerName + "</a></h4>" + 
          
          "<div id='infoDiv'><b>Language:</b> " + language + "</br><b>URL:</b> " + url + "</br><b>Description:</b> " + description + "</br></div>");
          
          $('#infoDiv').hide();
          $("#infoBtn").click(function(){
            $("#infoDiv").toggle();
          });
        };
     },
      error: function(errorMessage){
        $("#searchResult").prepend("Sorry, there's an error. </br> Github API might be down..")
      }
    })
  })
})