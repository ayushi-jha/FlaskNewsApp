var slides_start = 0;
var create_cloud_counter = 0;
var source_list_dict = {};
function show_slides() {
  var all_slides = document.getElementsByClassName("slide");
  for ( var i = 0; i < all_slides.length; i++) {
    all_slides[i].style.display = "none";  // hide all first
  }
  slides_start++;
  if (slides_start > all_slides.length)
  {
      slides_start = 1;
  }
  all_slides[slides_start-1].style.display = "block";  // now show the slide
  setTimeout(show_slides, 2000); // Change image every 2 seconds
}
getDate();
function getDate() {
    document.getElementById("To").value = new Date().toISOString().substring(0, 10);
    var fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 7);
    document.getElementById("From").value = fromDate.toISOString().substring(0, 10);
}

function showNews() {

    console.log("Show News");
    document.getElementById("search_form").style.display = 'none';
    document.getElementById("search_result").style.display = 'none';
     document.getElementById("rightdiv").style.display = 'flex';
    document.getElementById("bottomdiv").style.display = 'block';
    document.getElementById("search_button").classList.remove("active");
    document.getElementById("news_button").classList.add("active");

        var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
           if (xmlhttp.status === 200) {
               var myObj = JSON.parse(xmlhttp.responseText);
               if (myObj.error)
               {
                   alert(myObj.error);
                   return;
               }
               var articles_list = myObj.slides;
               var html_text_for_slideshow = "";

               html_text_for_slideshow += "<ul id='slides'>";
               for (var i=0; i < articles_list.length; i++)
               {
                   //html_text_for_slideshow += "<li class='slide' style='background-image: url(" + articles_list[i].urlToImage + "); background-size: contain; background-repeat: no-repeat;'><a href=" + "'" + articles_list[i].url + "'" + "target='_blank'><p>" + articles_list[i].title + "<br>" + articles_list[i].description + "</p></a></li>";
                   html_text_for_slideshow += "<li class='slide'><a href=" + "'" + articles_list[i].url + "'" + "target='_blank'><figure><img src='" + articles_list[i].urlToImage + "'><figcaption><p><h3>" + articles_list[i].title + "</h3>" + articles_list[i].description + "</p></figcaption></a></li>";
                   if (i >= 5)
                       break;

               }
               html_text_for_slideshow += "</ul>";
               var cnn_list = myObj.cnn;
               var html_cnn = "<h1>CNN</h1><hr>";
               html_cnn += "<ul class='cardlist'>";
               for (var j = 0; j < cnn_list.length; j++)
               {
                   html_cnn += "<li class='card'><a href=" + "'" + cnn_list[j].url + "'" + "target='_blank'><img src=" + "'" + cnn_list[j].urlToImage + "'" + "><div id='innerstretch'><h3>" + cnn_list[j].title + "</h3>" + cnn_list[j].description + "</div></a></li>";
                   if (j >= 4)
                       break;
               }
               html_cnn += "</ul>";

               var fox_list = myObj.fox;
               var html_fox = "<h1>Fox News</h1><hr>";
               html_fox += "<ul class='cardlist'>";
               for (var k = 0; k < fox_list.length; j=k++)
               {
                   html_fox += "<li class='card'><a href=" + "'" + fox_list[k].url + "'" + "target='_blank'><img src=" + "'" + fox_list[k].urlToImage + "'" + "><div id='innerstretch'><h3>" + fox_list[k].title + "</h3>" + fox_list[k].description + "</div></a></li>";
                   if (k >= 4)
                       break;
               }
               html_fox += "</ul>";

               document.getElementById("slideshow").innerHTML = html_text_for_slideshow;
               myWords = myObj.cloud;
               console.log("Mywords: ", myWords);
               create_cloud(myWords);

               // document.getElementById("word_cloud").innerText = (myObj.cloud);
               document.getElementById("CNN").innerHTML = html_cnn;
               document.getElementById("Fox").innerHTML = html_fox;
               show_slides();
           }
           else if (xmlhttp.status === 400) {
              alert('There was an error 400');
           }
           else {
               alert('something else other than 200 was returned');
           }
        }
    };

    xmlhttp.open("GET", "/show_news", true);
    xmlhttp.send();

}

function showSearch() {
    console.log("Show Search");
    document.getElementById("rightdiv").style.display = 'none';
    document.getElementById("bottomdiv").style.display = 'none';
    // document.getElementById("CNN").style.display = 'none';
    // document.getElementById("Fox").style.display = 'none';
    document.getElementById("search_form").style.display = 'block';
    document.getElementById("search_result").style.display = 'block';
    document.getElementById("news_button").classList.remove("active");
    document.getElementById("search_button").classList.add("active");
    getsources();
}

function showmoreres() {
    var show_more_list = document.getElementsByClassName('extra-res');
    for (var smr_i = 0; smr_i < show_more_list.length; smr_i++)
    {
        show_more_list[smr_i].style.display = 'block';
    }
    var smr_button = document.getElementById('show-more');
    smr_button.style.display = 'none';
}

function showlessres() {
    var show_more_list = document.getElementsByClassName('extra-res');
    for (var smr_i = 0; smr_i < show_more_list.length; smr_i++)
    {
        show_more_list[smr_i].style.display = 'none';
    }
    var smr_button = document.getElementById('show-more');
    smr_button.style.display = 'block';
}

function showSearchResults() {
    var myform = document.getElementById("search_form");
    if (!myform.checkValidity())
    {
        return;
    }
    var xmlhttp2 = new XMLHttpRequest();

    var from = document.getElementById("From").value;
    var to = document.getElementById("To").value;
    if (from > to)
    {
        alert("Incorrect time");
        return;
    }
    var date = new Date(from);
    var dateString1 = new Date(date.getTime() - (date.getTimezoneOffset() * 60000 )).toISOString().split("T")[0];
    console.log(dateString1);
    var date2 = new Date(to);
    var dateString2 = new Date(date2.getTime() - (date2.getTimezoneOffset() * 60000 )).toISOString().split("T")[0];
    console.log(dateString2);
    var keyword = document.getElementById("Keyword");
    var categories = document.getElementById("categories").value;
    var sources = source_list_dict[document.getElementById("sources").value];
    var params = "?keyword=" + keyword.value + "&from_val=" + dateString1 + "&to_val=" + dateString2;
    console.log("What is sources: ", sources);
    if (sources !== null && sources !== "All" && sources !== "all" && sources !== undefined)
    {
        params += "&sources=" + sources;
    }

    console.log(params);
    xmlhttp2.onreadystatechange = function() {
        if (xmlhttp2.readyState === XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
           if (xmlhttp2.status === 200) {

            document.getElementById("search_form").style.display = 'block';
            document.getElementById("search_result").style.display = 'block';
            console.log(xmlhttp2.responseText, typeof (xmlhttp2.responseText));
            var myObj4 = JSON.parse(xmlhttp2.responseText);
            if (myObj4.error)
               {
                   alert(myObj4.error);
                   return;
               }
            var search_list = myObj4.search_results;
            console.log(search_list);
               var html_search = "";
                var no_results = document.getElementById("search_result");

               if (search_list.length <= 0) {
                   console.log("Search List length: ", search_list.length);
                   html_search += "<div id='no-result' style='width: 800px; margin: 0 auto; padding-top: 40px;'>No Results</div>";
               }
               else {
                   console.log("It was in here");
                   html_search += "<ul>";
                   for (var s_i = 0; s_i < search_list.length; s_i++)
                   {
                        var desc = search_list[s_i].description;
                        var trimmedString = desc.substr(0, 75);
                        if(desc.length > trimmedString.length){
                            trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")));
                            trimmedString += "...";
                        }
                       if (s_i < 5)
                       {
                           html_search += "<div class='card3'><div class='close'>&#10006;</div><li class='card2'><div class='card2-img'><img src=" + "'" + search_list[s_i].urlToImage + "'" + "></div><div class='innerstretch2'><h3>" + search_list[s_i].title + "</h3><p class='innerstretch2-p'>" + trimmedString + "</p><div class='collapse'><b>Author: </b>" + search_list[s_i].author + "<br><b>Source: </b>" + search_list[s_i].source.name + "<br><b>Date: </b>" + search_list[s_i].publishedAt + "<br>" + search_list[s_i].description + "<br><a href='" + search_list[s_i].url + "' target='_blank'>See Original Post</a> </div></div></li></div>";
                       }
                       else if (s_i < 15)
                           {
                               html_search += "<div class='card3 extra-res'><div class='close'>&#10006;</div><li class='card2'><div class='card2-img'><img src=" + "'" + search_list[s_i].urlToImage + "'" + "></div><div class='innerstretch2'><h3>" + search_list[s_i].title + "</h3><p class='innerstretch2-p'>" + trimmedString + "</p><div class='collapse'><b>Author: </b>" + search_list[s_i].author + "<br><b>Source: </b>" + search_list[s_i].source.name + "<br><b>Date: </b>" + search_list[s_i].publishedAt + "<br>" + search_list[s_i].description + "<br><a href='" + search_list[s_i].url + "' target='_blank'>See Original Post</a> </div></div></li></div>";

                           }
                       else
                       {
                           break;
                       }
                   }
                   html_search += "</ul>";
               }

                if (search_list.length > 5)
                {
                    html_search += "<button value='Show More' id='show-more' style='display: block;' onclick=showmoreres()>Show More</button>";
                html_search += "<button value='Show Less' id='show-less' class='extra-res' onclick=showlessres()>Show Less</button>";
                }
document.getElementById("search_result").innerHTML = html_search;
var collapse_items = document.getElementsByClassName("card2");
for (const this_card of collapse_items) {
  this_card.addEventListener('click', function(e) {
      this_card.parentNode.firstChild.style.visibility = 'visible';
    for (var out_i = 0; out_i < this_card.childNodes.length; out_i++) {
        if (this_card.childNodes[out_i].className === "innerstretch2")
        {
            var ele = this_card.childNodes[out_i];
            for (var in_i=0; in_i < ele.childNodes.length; in_i++)
            {
                if (ele.childNodes[in_i].className === "innerstretch2-p") {
                  ele.childNodes[in_i].style.display = "none";
                }
                if (ele.childNodes[in_i].className === "collapse") {
                  ele.childNodes[in_i].style.display = "block";
                }
            }
            break;
        }
    }

  })
}
var collapse_items_cross = document.getElementsByClassName("close");
for (const this_card2 of collapse_items_cross) {
  this_card2.addEventListener('click', function(e) {
      var parent = this_card2.parentNode;
    for (var out_ix = 0; out_ix < parent.childNodes.length; out_ix++) {
        if (parent.childNodes[out_ix].className === "card2")
        {
            var second_parent = parent.childNodes[out_ix];
            for (var out_ii = 0; out_ii < second_parent.childNodes.length; out_ii++)
            {
                if (second_parent.childNodes[out_ii].className === "innerstretch2")
                {
                    var ele = second_parent.childNodes[out_ii];
                    for (var in_ii=0; in_ii < ele.childNodes.length; in_ii++)
                    {
                        if (ele.childNodes[in_ii].className === "innerstretch2-p") {
                          ele.childNodes[in_ii].style.display = "block";
                        }
                        if (ele.childNodes[in_ii].className === "collapse") {
                          ele.childNodes[in_ii].style.display = "none";
                        }
                    }
                    break;
                }
            }
        }
    }
    this_card2.style.visibility = 'hidden';
  })
}

           }
           else if (xmlhttp2.status === 400) {
              alert('There was an error 400');
           }
           else {
               alert('something else other than 200 was returned');
           }
        }
    };

 xmlhttp2.open("GET", "/show_search"+params, true);
    xmlhttp2.send();

}

function clearResults() {
    document.getElementById("Keyword").value = "";
        document.getElementById("categories").options.selectedIndex = 0;
        var sourceElement2 = document.getElementById("sources");
               while (sourceElement2.options.length)
               {
                   sourceElement2.remove(0);
               }
               sourceElement2[sourceElement2.length] = new Option("all", "all");
               for (var item2 in source_list_dict) {
                   sourceElement2[sourceElement2.length] = new Option(item2, item2);
               }
        document.getElementById("search_result").style.display = 'none';
        getDate();
}

function getsources(){
    var e = document.getElementById("categories");
    var category = e.options[e.selectedIndex].text;
     var xmlhttp3 = new XMLHttpRequest();
     var params = "?categ="+category;
     if (category === "All" || category === "all")
     {
         params = "";
     }

    console.log(params);
    xmlhttp3.onreadystatechange = function() {
        if (xmlhttp3.readyState === XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
           if (xmlhttp3.status === 200) {
               var myObj3 = JSON.parse(xmlhttp3.responseText);
               if (myObj3.error)
               {
                   alert(myObj3.error);
                   return;
               }
               var sourceElement = document.getElementById("sources");
               while (sourceElement.options.length)
               {
                   sourceElement.remove(0);
               }
               sourceElement[sourceElement.length] = new Option("all", "all");
               for (var item = 0; item < myObj3.source_list.length; item ++) {
                   sourceElement[sourceElement.length] = new Option(myObj3.source_list[item].source, myObj3.source_list[item].source);
                   source_list_dict[myObj3.source_list[item].source] = myObj3.source_list[item].id;
               }
           }
           else if (xmlhttp3.status === 400) {
              alert('There was an error 400');
           }
           else {
               alert('something else other than 200 was returned');
           }
        }
    };

 xmlhttp3.open("GET", "/get_sources"+params, true);
    xmlhttp3.send();
}


// GRAPH ---------------------

function create_cloud(myWords) {
// List of words
// var myWords = [{word: "Running", size: "10"}, {word: "Surfing", size: "20"}, {word: "Climbing", size: "50"}, {word: "Kiting", size: "30"}, {word: "Sailing", size: "20"}, {word: "Snowboarding", size: "60"} ]

    if (create_cloud_counter > 0)
{
    return;
}
    create_cloud_counter ++;
// set the dimensions and margins of the graph
    var margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = 300 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

// append the svg object to the body of the page
    var svg = d3.select("#word_cloud").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

// Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
// Wordcloud features that are different from one word to the other must be here
    console.log(myWords);
    var layout = d3.layout.cloud()
        .size([width, height])
        .words(myWords.map(function (d) {
            return {text: d.word, size: d.size};
        }))
        .padding(5)        //space between words
        .rotate(function () {
            return ~~(Math.random() * 2) * 90;
        })
        .fontSize(function (d) {
            return d.size*10;
        })      // font size of words
        .on("end", draw);
    layout.start();

// This function takes the output of 'layout' above and draw the words
// Wordcloud features that are THE SAME from one word to the other can be here
    function draw(words) {
        svg
            .append("g")
            .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function (d) {
                return d.size + 'px';
            })
            .style("fill", "#000000")
            .attr("text-anchor", "middle")
            .style("font-family", "Impact")
            .attr("transform", function (d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function (d) {
                return d.text;
            });
    }
}