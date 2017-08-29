---
layout: post
title: "Team by Team Breakdown"
description: "and the evolving elements of winning basketball"
date: 2017-08-27
share: true
---

<style type="text/css">
    circle.dark {
        fill: #099;
        opacity: 1.0;
    }

    #statToggle ul>li {
        background: #099;
    }

    .container {
        width: 100%;
        margin: auto;
    }

    .avgLine {
        stroke: #8a8a8a;
        stroke-dasharray: 5,5;
    }


</style>

<div class="toggle" id="statToggle"></div>

<div class="vert toggle" id="teamToggle"></div>
<svg class="graph" height="600" width="850"></svg>

<div class="tooltip" id="statTooltip"></div>

<script>

    var translate = function(left, top) { return "translate(" + left + "," + top + ")"; };

    var data = {{ site.data.team_diff_data | jsonify }};

    var EXCLUDE_KEYS = new Set(['ts_pct', 'win', 'base_win_pct', 'fg', 'fg_pct', 'efg_pct']);
    var ACTIVE_TEAMS = new Set(['gsw']);

    var svgContainer = d3.select("svg"),
        graphMargins = {top: 25, right: 25, bottom: 25, left: 35};

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
        state.statState[key] = false;
      }

     for (var i = 0; i < teams.length; i++) {
        var team = teams[i];
        if (ACTIVE_TEAMS.has(team)) {
            state.teamState[team] = true;
            selectedTeams.add(team);
        } else state.teamState[team] = false;
      }

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
              .on('mouseover', function() {
                var stat = d3.select(this).attr("stat");
                var team = d3.select(this).attr("team");
                var pctDiff = d3.select(this).attr("pctDiff");
                var totalGames = d3.select(this).attr("totalGames");

                statTooltip.transition().duration(150);
                statTooltip.html(team + "|" + stat + ": (" + totalGames + ", " + pctDiff + "%)")
                       .style("left", (d3.event.pageX) + "px")
                       .style("top", (d3.event.pageY - 24) + "px")
                       .style("opacity", .9);
              })
              .on("mouseout", function(d) {
                statTooltip.transition().duration(50).style("opacity", 0)
              });
        togglePoints();
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
    }

    function renderXAxis() {
        svgContainer.append("g")
                      .attr("transform", translate(graphMargins.left, graphMargins.top + graphHeight))
                      .call(d3.axisBottom(numGamesToWidth).tickFormat(d3.format("d")).ticks(17))
    }

    function hasSelected(filterType) {
        var obj;
        if (filterType == "stat") obj = state.statState;
        else obj = state.teamState;

        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (obj[key] == true) return true
            }
        }
        return false;
    }

    var getClass = function(team, stat) {
        var teamState = state.teamState[team];
        var statState = state.statState[stat];

        if (teamState == false && statState == false) return 'light'
        if (teamState == true && statState == true) return 'dark'

        var statIsSelected = hasSelected("stat");
        var teamIsSelected = hasSelected("team");

        if (teamState) {
            if (statIsSelected) {
                if (statState) return 'dark'
                else return 'light'
            } else return 'dark'
        }

        if (statState) {
            if (teamIsSelected) {
                if (teamState) return 'dark'
                else return 'light'
            } else return 'dark'
        }
    }

    function encodeKey(key) {
      return key.replace('%', '\\%');
    }

    function togglePoints() {
        /*
        Render the graph based on the state of the State object.
        */

        // first clear all
        d3.selectAll("circle").each(function() {
            var elem = d3.select(this);
            var team = elem.attr("team");
            var stat = elem.attr("stat");
            elem.attr("class", getClass(team, stat));
        })
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
            .text(function(d) {return d})
            .on('click', function (d) {
              if (state.statState[d] == true) {
                d3.select(this).attr("class", "OFF");
                state.statState[d] = false;
              } else {
                d3.select(this).attr("class", "ON");
                state.statState[d] = true;
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
            .text(function(d) {return d})
            .on('click', function (d) {
              if (state.teamState[d] == true) {
                d3.select(this).attr("class", "OFF");
                state.teamState[d] = false;
              } else {
                d3.select(this).attr("class", "ON");
                state.teamState[d] = true;
              }
              togglePoints();
            })

    }

    function draw() {
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var teamName = data[key]['team_name'];
                renderPoints(teamName, parseData(data[key]['diffs']));
            }
        }
    }

    var keys = extractKeys();
    var teams = extractTeams();

    initState(keys, teams);
    draw()

    renderYAxis();
    renderXAxis();

    setUpStatToggles(keys);
    setUpTeamToggles(teams);

    // #TODO: create separate object team_name to base_win_pct
    function drawAvgLine(team) {
        var baseWinPct = null;
        for (var i = 0; i < data.length; i++) {
            if (data[i]["team_name"] === team) {
                baseWinPct = data[i]["diffs"]["base_win_pct"];
            }
        }
        graphContainer.append("line")
                      .attr("class", "avgLine")
                      .attr("x1", numGamesToWidth(0))
                      .attr("x2", numGamesToWidth(82))
                      .attr("y1", pctToHeight(baseWinPct))
                      .attr("y2", pctToHeight(baseWinPct))
    }

    drawAvgLine("gsw");

</script>


## Observations

The most interesting insight here is that stats relating to three pointers (3pt, 3pt%) and rebounding (drb, trb) have a definite negative slope. This implies that teams who benefit the most from winning that stat also win it the least, which intuitively means that the these stats are even <i>more</i> important to these teams.

The Pelicans with respect to defensive rebounding and the Timberwolves are of the most interesting to me. With DeMarcus Cousins and Anthony Davis, it would seem to me that the Pelicans should be dominating the defensive glass. Yet, in the '16-17' season, they only won the defensive rebounding battle 24 times, posting a +37.7% win percentage relative to their base percentage in those games. Digging a little deeper, # TODO: check what this breakdown looked like after the addition of DeMarcus Cousins.

The Timberwolves are fascinating because they posted a +39.5% win pct relative to base in games where they attempted/made? more three-pointers than their opponent, a clear indication how outside shooting benefits their team. By adding Jimmy Butler and Jeff Teague, there's no arguing that the Timberwolves upgraded their arsenal during the off-season. But even so, there still isn't a ton of outside shooting on the floor. It will be interesting to see how the Timberwolves do with respect to the outside shot this season.

