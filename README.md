# GitHub Repo Search
Single page JavaScript application that allows one to search Github.com for repos by keyword.

## Why jQuery
I used HTML, CSS and jQuery instead of a framework like Angular or React as it’s a small app with 2 AJAX calls and renders a set of static data. I didn’t need to reuse components, manipulate states, use RESTful API or MVC support, etc.

## Limitations
There are some limitations to this app - only the 30 most popular results are returned and the there’s a rate limit of 60 calls hourly. Would have to do pagination for more than 30 results, and get authenticated API for a higher rate limit.

## Room for Improvement
The AJAX call is slow as a lot of unused data is returned and two different calls has to be made. To solve this problem GraphQL can be used to call GitHub's GraphQL API (https://developer.github.com/v4/). Mutations can be specified to query only the information that is needed. Even nested information can be retrieved with one call. However there will be caching and rerendering issues, might have to use a GraphQL client like Apollo to deal with that.

## Bonus Questions
1) Let's say we told you your app needs to search yet another repository, together with Github. What considerations will you make when update your app?

This has been implemented in the app, when another search is made the html of the containers are cleared
 `$("#search-result").html("”);`

2) How would your app deal with the Github API going down?

Error handling is implemented in the AJAX call to show an error message if the API, or internet connection is down.
`error: function (errorMessage) {
  $("#search-result").html("Sorry, GitHub API might be down..")
}`

3) Did you consider creating a separate branch on your project? What did you do on the other branch?

I didn’t create a new branch on this project as it is small and only I am working on it. It is however good practice to create a separate branch for new features so that the master branch which is deployed wouldn’t be affected and teammates can work on another feature on a different branch.

4) Is your app responsive?

The app is responsive and looks great on desktop, mobile devices and tablets, I used bootstrap for this. It’s also cross-browser compatible.
