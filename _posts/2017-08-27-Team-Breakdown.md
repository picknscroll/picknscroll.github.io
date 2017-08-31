---
layout: post
title: "The Elements of Winning Basketball, Part 2"
description: "interactive team by team breakdown"
date: 2017-08-27
share: true
---

<style type="text/css">
    circle.dark {
        opacity: 1.0;
    }

    text.avgLine {
        font-size: 12px;
    }

    .label {
        fill: gray;
        font-size: 13px;
    }

    circle.light {
        opacity: 0.05;
    }

    #statToggle ul>li {
        background: #099;
    }

    .container {
        width: 100%;
        margin: auto;
    }

    .avgLine {
        stroke-dasharray: 5,5;
    }

    .avgLine.dark {
        opacity: 1.0;
    }

    .avgLine.light {
        opacity: 0.0;
    }

    .toggle {
        margin-bottom: 15px;
    }
</style>


Part 2 in an examination of the elements of winning basketball. Part 1 is <a href="https://picknscroll.github.io/2017-06-15/The-NBA-Evolution/">here</a>

The chart below is an interactive view into how important different stats are for different teams. Each point in the chart represents a particular team and stat. For each point, the x-coordinate is the number of the games in which the team won the particular stat and the y-coordinate is the team's win percentage in those games.

Points towards the upper left corner represent stats that correlate strongly to winning, but are not frequently won by the team. Points toward the lower left represent stats that do not correlate strongly to winning, yet are more frequently won. The upper right corner is the holy grail.

Interact with the graph by toggling the buttons for teams, stats or both. Selecting a team and a particular stat filters the view to a single point. In the initial view below, for example, the single visible point represents the Golden State Warriors and offensive rebounds. Hovering over the point yields the coordinates (24, 91.7%). Translation: the Warriors won 91.7% of the 24 games in which they grabbed more offensive rebounds than their opponent.

Toggle "gsw" off to see the importance of offensive rebounds for all teams. The Warriors are quite an outlier.

## Chart

<div class="toggle" id="statToggle"></div>

<div class="vert toggle" id="teamToggle"></div>
<svg class="graph" height="630" width="850"></svg>

<div class="tooltip" id="statTooltip"></div>

<script>

    d3.selection.prototype.moveToFront = function() {
        return this.each(function(){
            this.parentNode.appendChild(this);
        });
    };

    var translate = function(left, top) { return "translate(" + left + "," + top + ")"; };

    var data = {{ site.data.team_diff_data | jsonify }};

    var EXCLUDE_KEYS = new Set(['win', 'base_win_pct', 'fg']);
    var ACTIVE_TEAMS = new Set(['gsw']);
    var ACTIVE_STATS = new Set(['orb']);

    var svgContainer = d3.select("svg"),
        graphMargins = {top: 25, right: 25, bottom: 55, left: 35};

    var graphWidth = +svgContainer.attr("width") - graphMargins.left - graphMargins.right;
    var graphHeight = +svgContainer.attr("height") - graphMargins.top - graphMargins.bottom;

    var graphContainer = svgContainer.append("g")
        .attr("transform", translate(graphMargins.left, graphMargins.top));

    var pctToHeight = d3.scaleLinear().range([graphHeight, 0]).domain([0, 1.0]);
    var numGamesToWidth = d3.scaleLinear().range([0, graphWidth]).domain([0, 82]);

    var statTooltip = d3.select("#statTooltip").style("opacity", 0);

    var state = {
        selectedStats: new Set([]),
        selectedTeams: new Set([]),
        statState: {},
        teamState: {}
    }

    function initState(keysToRender, teams) {
      for (var i = 0; i < keysToRender.length; i++) {
        var key = keysToRender[i];
        if (ACTIVE_STATS.has(key)) {
            state.statState[key] = true;
            state.selectedStats.add(key);
        } else state.statState[key] = false;
      }

     for (var i = 0; i < teams.length; i++) {
        var team = teams[i];
        if (ACTIVE_TEAMS.has(team)) {
            state.teamState[team] = true;
            state.selectedTeams.add(team);
        } else state.teamState[team] = false;
      }

    }

    function drawToolTip(elem) {
        var stat = elem.attr("stat");
        var team = elem.attr("team");
        var pctDiff = elem.attr("pctDiff");
        var totalGames = elem.attr("totalGames");

        statTooltip.transition().duration(150);
        statTooltip.html(team + "|" + stat + ": (" + totalGames + ", " + pctDiff + "%)")
                   .style("left", (d3.event.pageX) + "px")
                   .style("top", (d3.event.pageY - 24) + "px")
                   .style("opacity", .9);
    }

    function renderPoints(teamName, data) {
        var dotRadius = 2.5;
        graphContainer.selectAll(".dot")
            .data(data)
            .enter()
            .append("circle")
              .attr("r", dotRadius)
              .attr("team", teamName)
              .attr("stat", function(d) { return d['stat'] })
              .attr("totalGames", function(d) { return d['total'] })
              .attr("pctDiff", function(d) { return (100 * d['pctDiff']).toFixed(2) })
              .attr("cx", function(d) { return numGamesToWidth(d['total']) })
              .attr("cy", function(d) { return pctToHeight(d['pctDiff'] )})
              .on('mouseover', function() { drawToolTip(d3.select(this)) })
              .on("mouseout", function() { statTooltip.transition().duration(50).style("opacity", 0)});
    }

    function renderAvgLine(team, baseWinPct) {

        var g = graphContainer.append("g").attr("transform", translate(0, pctToHeight(baseWinPct)));

        g.append("line")
          .style("stroke", teamToColor(team))
          .attr("team", team)
          .attr("x1", numGamesToWidth(0))
          .attr("class", "avgLine")
          .attr("x2", numGamesToWidth(82))
          .attr("y1", 0)
          .attr("y2", 0)

        g.append("text")
         .text("[" + team + "] " + "overall Win %: " + (100 * baseWinPct).toFixed(2) + "%")
         .attr("class", "avgLine")
         .attr("team", team)
         .attr("x", 10)
         .attr("y", -5)
         .style("fill", teamToColor(team))

    }

    function extractTeams() {

        var teams = [];
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var teamName = data[key]['team_name'];
                teams.push(teamName);
            }
        }
        return teams;
    }

    function extractKeys() {

        var keys = [];
        var stats = data[0]['diffs'];

        for (var key in stats) {
            if (EXCLUDE_KEYS.has(key)) continue
            if (stats.hasOwnProperty(key)) {
                keys.push(key)
            }
        }
        return keys;
    }

    function parseData(data) {
        var results = [];
        for (var key in data) {
            if (EXCLUDE_KEYS.has(key)) continue
            if (data.hasOwnProperty(key)) {
                var statMap = {
                    stat: key,
                    pctDiff: data[key]['pct_diff'],
                    total: data[key]['total']
                }
                results.push(statMap);
            }
        }
        return results;
    }

    function renderYAxis() {
        svgContainer.append("g")
                    .attr("transform", translate(graphMargins.left, graphMargins.top))
                    .call(d3.axisLeft(pctToHeight).tickFormat(d3.format(".0%")).ticks(5))

        graphContainer.append("text")
                      .attr("text-anchor", "middle")
                      .attr("class", "label")
                      .attr("y", -15)
                      .attr("x", - graphHeight / 2)
                      .attr("transform", "rotate(-90)")
                      .text("Win %")
    }

    function renderXAxis() {
        svgContainer.append("g")
                      .attr("transform", translate(graphMargins.left, graphMargins.top + graphHeight))
                      .call(d3.axisBottom(numGamesToWidth).tickFormat(d3.format("d")).ticks(17))

        graphContainer.append("text")
                      .attr("class", "label")
                      .attr("text-anchor", "middle")
                      .attr("x", graphWidth / 2)
                      .attr("y", graphHeight + graphMargins.top + 12.5)
                      .text("# games")
    }

    // TODO: move this and the translate function into the a utils.file
    function encodeKey(key) { return key.replace('%', '\\%'); }

    // TODO: refactor this into an applyChanges method
    function togglePoints() {
        // clear all lines and circles
        d3.selectAll("circle").each(function() {
            d3.select(this).attr("class", "light");
        })

        d3.selectAll(".avgLine").each(function() {
            d3.select(this).attr("class", "avgLine light");
        })

        // draw all selected teams
        state.selectedTeams.forEach(function(d) {
            d3.selectAll("circle[team=" + d +"]").each(function() {
                var elem = d3.select(this);
                elem.attr("class", "dark").style("fill", getColorForPoint(elem)).moveToFront();
            })

            d3.selectAll(".avgLine[team=" + d +"]").each(function() {
                d3.select(this).attr("class", "avgLine dark");
            })
        })

        // apply stat filters
        state.selectedStats.forEach(function (s) {
            if (state.selectedTeams.size > 0) {
                state.selectedTeams.forEach(function (t) {
                    d3.selectAll("circle[team=" + t + "]").each(function() {
                        var elem = d3.select(this);
                        var stat = elem.attr("stat");
                        if (state.selectedStats.has(stat)) elem.attr("class", "dark").style("fill", getColorForPoint(elem)).moveToFront()
                        else elem.attr("class", "light")
                    })
                })
            } else {
                d3.selectAll("circle[stat=" + encodeKey(s) + "]").each(function() {
                    var elem = d3.select(this);
                    elem.attr("class", "dark").style("fill", getColorForPoint(elem)).moveToFront();
                })
            }
        });

    }

    function setUpStatToggles(stats) {

        d3.select("#statToggle").append("ul")
            .selectAll("li")
            .data(stats)
            .enter()
            .append("li")
            .attr("class", function(d) {
              if (state.statState[d] == true) return "ON";
              else return "OFF";
            })
            .style("background", function(s) { return statToColor(s)})
            .text(function(d) {return d})
            .on('click', function (d) {
              if (state.statState[d] == true) {
                d3.select(this).attr("class", "OFF");
                state.statState[d] = false;
                state.selectedStats.delete(d);
              } else {
                d3.select(this).attr("class", "ON");
                state.statState[d] = true;
                state.selectedStats.add(d);
              }
              togglePoints();
            })
    }

    function setUpTeamToggles(teams) {
        d3.select("#teamToggle").append("ul")
            .selectAll("li")
            .data(teams)
            .enter()
            .append("li")
            .attr("class", function(d) {
              if (state.teamState[d] == true) return "ON";
              else return "OFF";
            })
            .style("background", function(t) {return teamToColor(t)})
            .text(function(d) {return d})
            .on('click', function (d) {
              if (state.teamState[d] == true) {
                d3.select(this).attr("class", "OFF");
                state.teamState[d] = false;
                state.selectedTeams.delete(d);
              } else {
                d3.select(this).attr("class", "ON");
                state.teamState[d] = true;
                state.selectedTeams.add(d);
              }
              togglePoints();
            })

    }

    function draw() {
        for (var i = 0; i < data.length; i++) {
            var teamData = data[i];
            var teamName = teamData["team_name"];
            renderPoints(teamName, parseData(teamData["diffs"]));
            renderAvgLine(teamName, teamData["diffs"]["base_win_pct"]);
        }
        togglePoints();
    }

    function getColorForPoint(elem) {
        if (state.selectedTeams.size > 0) return teamToColor(elem.attr("team"))
        else return statToColor(elem.attr("stat"))
    }

    var keys = extractKeys();
    var teams = extractTeams();

    // # TODO: up the contrast between colors here.
    var statColors = ["#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5", "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", "#c7c7c7"];

    var teamColors = ["#938c6d", "#936a24", "#a964fb", "#92e460", "#a05787", "#9c87a0", "#20c773", "#8b696d", "#78762d", "#e154c6", "#40835f", "#d73656", "#1afd5c", "#c4f546", "#3d88d8", "#bd3896", "#1397a3", "#f940a5", "#66aeff", "#d097e7", "#fe6ef9", "#d86507", "#8b900a", "#d47270", "#e8ac48", "#cf7c97", "#cebb11", "#718a90", "#e78139", "#ff7463"];

    var teamToColor = d3.scaleOrdinal().range(teamColors).domain(teams);
    var statToColor = d3.scaleOrdinal().range(statColors).domain(keys);

    initState(keys, teams);
    draw()

    renderYAxis();
    renderXAxis();

    setUpStatToggles(keys);
    setUpTeamToggles(teams);



</script>


## Observations

I had a lot of fun clicking around and interacting with this data. A few of my favorite findings:

* Cleveland wins when they move the ball. They won 96.7% of the 30 games (29-1) where they had more assists than their opponent. Cleveland has never had a truly cohesive offensive system. When you have LeBron James and Kyrie Irving, it turns out you can get along just fine without one. But the data shows how much harder a team is to guard when the ball is swinging, the players are moving, and the cuts are crisp.

* Boston wins when they rebound the ball. They won 97.1% of the 34 games (33-1)  where they grabbed more defensive rebounds than their opponent. Boston has the league's most versatile lineup outside of Oakland - their collection of wings all have above-average ball skills and are also capable of switching on defense. But that versatility comes at the expense of size, and Al Horford, for all of his unique talents as a big, does not exactly dominate the boards.

* For Brooklyn, shooting well doesn't always mean winning. Brooklyn's 51.7 win % in games in which they posted a higher true shooting % than their opponent was by far the lowest in the league (Philly was the next lowest, at 64.5%). Upon closer inspection, the Nets rarely out-rebounded their opponents (23 games), and rarely turned the ball over less (21 games) as well. So even when the Nets made a higher percentage of their shots than their opponent, they usually had fewer possessions to work with, leading to fewer points overall.

* I was shocked by how infrequently the Pelicans out-rebound their opponents (21 games, 71.6 win %). Given that they have the most dominant big man duo in the league, I'm really curious to see how this trend continues in the upcoming season.

* The Timberwolves need more three-point makers. They went 6-11 in games where they attempted more 3s than their opponent, and 17-5 in games where they actually made more. The 42% difference between these two statistics is the highest in the league. The Timberwolves got significantly better this off-season, but I still think they could use some more shooters. While Jimmy Butler's outside shooting numbers are good (not great), I wouldn't consider him a floor stretcher - he likes to get to <a href="http://nbasavant.com/player.php?player_id=202710">his spots</a> in the mid-range and around the basket. Jeff Teague is an upgrade over Ricky Rubio as a shooter, but Zach Lavine, their best outside shooter, is now gone. The Timberwolves have a wealth of offensive talent, but will there be enough space to utilize that talent optimally?

Making this graph only increased my excitement for the upcoming NBA season, one that promises to be full of intrigue after this offseason's flurry of activity. October 17th can't come fast enough!
