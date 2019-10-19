---
layout: post
title: "The Elements of Winning Basketball"
description: "and the three-point revolution"
date: 2017-06-15
share: true
---
NBA games produce a proliferation of statistics. Check any box score on basketball-reference.com and you'll see no less than 4 tables with numbers detailing all aspects of the game.

These numbers represent a gold-mine for an analytical nerd such as myself, but it's too easy to get caught up in individual numbers while ignoring the bigger picture. In this post, I want to examine the importance of various basketball statistics, and how their value has changed over the last few years.

## The Data

I scraped every basketball-reference box score from the 2016-2017 regular season, and for each game, I recorded which team "won" various statistical categories, as well as which team won the game.

For example, scraping the first game of the season between the Cavaliers and the Knicks produced the following vector:

Team | FG | FGA | FG% | 3P | 3PA | TRB | AST | STL | BLK | TO | eFG% | TS% | Win
---- | - | - | - | - | - | - | - | | - | - | - | - | - | - | - | - |
CLE | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 0 | 1 | 1 | 1 | 1
NYK | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0

By aggregating these game vectors over the 2016-2017 regular season, I was able to come up with a compact picture of (1) how different statistical categories contribute to winning basketball, and (2) how they rank relative to one another.

Stat            | Win % When Stat is Won |
--------------- | ----------------------- |
true shooting % | 84.60% |
effective field % |	82.72%
field goal % |	81.16%
field goals made |	80.17%
defensive rebounds |	75.14%
three point % |	72.62%
assists	| 72.61%
three point attempts |	68.17%
total rebounds |	64.63%
blocks	| 61.55%
steals	| 60.94%
free throws made	| 59.40%
turnovers |	57.50%
offensive rebounds |	49.03%
field goal attempts	| 48.35%

In other words, the team with a higher true shooting percentage won 84.60% of games; the team with more assists won 72.61% of games; the team with fewer turnovers won 57.50% of games, etc.

## Observations

* Offensive efficiency (true shooting %, effective field goal %, and field goal %) is by far the most important factor for winning basketball games, which should be no surprise. Among these efficiency metrics, true shooting % emerges as the definitive measure.

* Winning the offensive rebounding battle is a detriment to winning. I believe this is due (in part) to the fact that crashing the offensive glass leads to easier transition opportunites for the opposition. Ben Falk provides an excellent breakdown of that concept <a href="https://cleaningtheglass.com/making-the-transition/">here</a>.

* Raw field goal attempts rank dead last. I believe this is because free throws don't count as field goal attempts, and free throws are much more efficient than the average field goal opportunity. It would be interesting to look at how often the team with more <i>shooting possessions</i> (which incorporate free-throw attempts) win the game. If I had to guess, the associated win % would be somewhere around 65%.

* The importance of merely <i>attempting</i> more three pointers - you don't even have to make them! - is surprisingly high, and is even more important than total rebounds. This observation leads us to the next section.

## The Revolution

The importance of three point attempts is the result of a revolution currently transforming basketball. Offensively, teams are moving away from centers and power forwards patrolling the low post, favoring versatile guards and wings who can score in transition, create through the pick and roll, and space the floor with outside shooting instead. The Golden State Warriors are the current frontier of this revolution, and their recent dominance demonstrates the effectiveness of the approach.

When we look at how the importance of various statistics have changed over time, we see a steady increase in the importance three pointers made and three pointers attempted (+9.9% and +10.6%, respectively), while the other categories have more or less stayed the same.

Note: Click on a stat to make that line more/less visible.

<div class="toggle" id="filter"></div>
<svg height="600"></svg>
<div class="tooltip" id="lineTooltip"></div>
<div class="tooltip" id="pointTooltip"></div>
<script>

    var translate = function(left, top) { return "translate(" + left + "," + top + ")"; };
    var data = {{ site.data.evolution | jsonify }};

    /* CONFIG VALUES */
    var MIN_YEAR = 2000;
    var EXCLUDE_KEYS = new Set(['fta', 'year']);
    /* END CONFIG VALUES */

    var svgContainer = d3.select("svg"),
        graphMargins = {top: 25, right: 30, bottom: 25, left: 30};

    var graphWidth = $(".post")[0].offsetWidth - graphMargins.left - graphMargins.right;
    svgContainer.attr("width", $(".post")[0].offsetWidth);
    var graphHeight = +svgContainer.attr("height") - graphMargins.top - graphMargins.bottom;

    var graphContainer = svgContainer.append("g")
        .attr("transform", translate(graphMargins.left, graphMargins.top));

    var pctToHeight = d3.scaleLinear().range([graphHeight, 0]);
    var yearToWidth = d3.scaleLinear().range([0, graphWidth]);

    var statLine = d3.line()
        .x(function(d, i) {return yearToWidth(i + MIN_YEAR); })
        .y(function(d) { return pctToHeight(d) } )

    var getClass = function(key) {
      if (state.keyState[key] == true) return 'dark'
      else return 'light'
    }

    // track state of user supplied filters
    var state =  {
      keyState: {} // map key to true if the line should be bold, false if it should be greyed.
    }

    function initState(keysToRender) {

      var activeKeys = new Set(['fg3%', 'fg3']);
      for (var i = 0; i < keysToRender.length; i++) {
        var key = keysToRender[i];
        if (activeKeys.has(key)) state.keyState[key] = true;
        else state.keyState[key] = false;
      }

    }

    var lineTooltip = d3.select("#lineTooltip").style("opacity", 0);
    var pointTooltip = d3.select("#pointTooltip").style("opacity", 0);

    function registerFiltersAndOnClickHandler(keyValues, values) {
       d3.select('#filter').append('ul')
            .selectAll('li')
            .data(keyValues)
            .enter().append('li')
            .attr("class", function(d) {
              if (state.keyState[d] == true) return "ON";
              else return "OFF";
            })
            .text(function(d) {return d;})
            .on('click', function (d) {
              if (state.keyState[d] == true) {
                d3.select(this).attr("class", "OFF");
                state.keyState[d] = false;
              } else {
                d3.select(this).attr("class", "ON");
                state.keyState[d] = true;
              }
              var encoded = encodeKey(d);
              d3.select("#" + encoded).attr("class", 'statLine ' + getClass(d));
              d3.selectAll("circle." + encoded).each(function() {
                  d3.select(this).attr("class", d + " " + getClass(d));
              })
            })

    }

    function encodeKey(key) {
      return key.replace('%', '\\%');
    }

    function filterKeys(allKeys) {
      var filteredKeys = [];

      for (var i = 0; i < allKeys.length; i++) {
        var key = allKeys[i];
        if (EXCLUDE_KEYS.has(key)) continue

        filteredKeys.push(key);
      }
      return filteredKeys;
    }

    function sortKeys(yearData) {
      var sortable = [];

      for (var key in yearData) {
        sortable.push([key, yearData[key]]);
      }

      sortable.sort(function(a, b) {
        return b[1] - a[1];
      })

      var sortedKeys = sortable.map(function(d) { return d[0]});
      return sortedKeys;
    }

    function renderXAxis() {
        svgContainer.append("g")
                      .attr("transform", translate(graphMargins.left, graphMargins.top + graphHeight))
                      .call(d3.axisBottom(yearToWidth).tickFormat(d3.format("d")).ticks(17))
    }

    function renderYAxis() {
        svgContainer.append("g")
                    .attr("transform", translate(graphMargins.left, graphMargins.top))
                    .call(d3.axisLeft(pctToHeight).tickFormat(d3.format(".0%")))
    }

    function renderLines(key, datum) {
        graphContainer.append("g")
              .append("path")
              .attr("id", key)
              .attr("class", function() { return 'statLine ' + getClass(key); })
              .attr("d", statLine(datum))
              .on('mouseover', function() {
                var d = d3.select(this).attr("id");
                lineTooltip.transition().duration(150);
                lineTooltip.html(d)
                       .style("left", (d3.event.pageX) + "px")
                       .style("top", (d3.event.pageY - 24) + "px")
                       .style("opacity", .9);
              })
              .on("mouseout", function(d) {
                lineTooltip.transition().duration(50).style("opacity", 0)
              });
    }

    function renderStatPoints(key, datum) {
        var dotRadius = 2.25;
        graphContainer.selectAll(".dot")
            .data(datum)
            .enter()
            .append("circle")
              .attr("class", function (d, i) {return key + " " + getClass(key); })
              .attr("r", dotRadius)
              .attr("data", function(d) { return d})
              .attr("year", function(d, i) { return i + MIN_YEAR })
              .attr("cx", function(d, i) { return yearToWidth(i + MIN_YEAR) })
              .attr("cy", function(d) { return pctToHeight(d) })
              .on('mouseover', function() {
                  var elem = d3.select(this);

                  var statKey = elem.attr("class").split(" ")[0];
                  var year = elem.attr("year");
                  var value = elem.attr("data");
                  value =  (value * 100).toFixed(1);

                  pointTooltip.transition().duration(350);
                  pointTooltip.html(statKey + "|" + year + ": " + value + "%")
                              .style("left", (d3.event.pageX) + "px")
                              .style("top", (d3.event.pageY - 24) + "px")
                              .style("opacity", .9);
              })
              .on("mouseout", function(d) {
                  pointTooltip.transition().duration(50).style("opacity", 0)
              });
    }

    function draw(keysToShow, rawData) {

        for (var i = 0; i < keysToShow.length; i++) {
            var key = keysToShow[i];

            datum = rawData.map(function(d) {return d[key]});

            renderLines(key, datum);
            renderStatPoints(key, datum);
      }
    }

    var keysToShow = filterKeys(sortKeys(data[data.length - 1]));
    initState(keysToShow);
    registerFiltersAndOnClickHandler(keysToShow , data);

    yearToWidth.domain(d3.extent(data.map(function(y) { return y['year'] })));
    pctToHeight.domain([.35, .875]);

    draw(keysToShow.reverse(), data);
    renderXAxis();
    renderYAxis();

</script>

## Why Does This Matter?

The key here is that the value of three point attempts is increasing at about the same rate as that of three point makes. This insight allows us to take a broader view when evaluating the effectiveness of a team's offense, one that decouples the execution from the result. Because regardless of the outcome, three point attempts are generally the sign of a healthy offense.

Shooting a basketball accurately from 24+ feet demands exact precision, which is why even the very, very best shooters <a href="https://www.youtube.com/watch?v=PafaPE_7xRU">miss</a> <a href="https://www.youtube.com/watch?v=Gi6vHMyfVl4">their</a> <a href="https://www.youtube.com/watch?v=bA8OSPs_9_g&t=056s">fair</a> <a href="https://www.youtube.com/watch?v=BqpzHgykD5k&t=1m43s">share</a> of wide open 3s. So instead of focusing on makes and misses, we can treat three point attempts as a proxy for something whose outcome isn't binary: the ability to space the floor. In order for a team to attempt a lot of three-pointers, they must have (1) players confident enough to hoist long attempts and (2) players who can get into the lane, force the defense to collapse, and kick out to those players from (1). These two abilities are perhaps the single most synergistic pair in all of basketball. More outside shooting leads to wider driving lanes, which lead to more open outside shots - and before you know it, the defense is left blitzed and demoralized.

Needless to say, this broader view is only applicable to a certain extent - at the end of the day, 100 missed three point attempts increase your chances of winning by exactly 0%.  It does, however, speak to the potential of analytics and statistical thinking in sports. The Warriors shot an average of 3.4 more three-pointers per game than their opponents in the 2016-2017 season; the Houston Rockets led the league with an astonishing 11.2 more attempts per game. In any given game, Stephen Curry, Klay Thompson, or Kevin Durant might miss all 3.4 of those surplus shots; James Harden, Eric Gordon, and Ryan Anderson may very well miss all 11 of theirs. But as we've seen, over the entire season (and more importantly, a seven-game series), those extra triples translate directly to wins.
