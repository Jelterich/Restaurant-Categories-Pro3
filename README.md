# Restaurant-Categories-Pro3 Team readme file

#### Overview

### HTML STUFF ###

### Bootstrap

The bootstrap script gets written into the main html file, `index.html.`, to create the layout of the page by making 5 empty containers. The first container takes the top half of the page with the lower half of the page being split into 4 equal size containers.

### iframe

iframe allows us to treat each of the 5 created containers as their own separate pages. An html file will be made for each map, chart, and graph and assigned a container with iframe.


[ Main HTML (index.html) ]
        |
  +-----+--------+
  |              |
[ Bootstrap ]  [ iframe (assigns src via JavaScript) ]
                   |
     +------------+------------+------------+------------+
     |            |            |            |            |  
[ iframe 1 ] [ iframe 2 ] [ iframe 3 ] [ iframe 4 ] [ iframe 5 ]
(map.html) (chart1.html) (chart2.html)(chart3.html) (chart4.html) 



The map and each chart can be written individually like in the class activity examples from the basics of charting single graphs in html and of using leaflet and openstreetmap. Can probable just go right to the activity files from those module. We'll end up keeping the html files those created and then copying most of the JavaScript to the main javascript file.


#### Open the complete-dashboard-sample.html in your browser to get an idea