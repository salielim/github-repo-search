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
          $("#searchResult").prepend(data.items[i].full_name + "</br>");       
        };

        // show 'language', 'followers', 'url', 'description' when clicked
        console.log(data.items[0].language);
        //console.log(data.items[0].followers);
        console.log(data.items[0].html_url);
        console.log(data.items[0].description); 
     },
      error: function(errorMessage){
        alert("GET Error")
      }
    })
  })
})