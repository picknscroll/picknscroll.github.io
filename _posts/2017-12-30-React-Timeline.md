---
layout: post
title: "Learning React: A Visual Timeline"
date: 2017-12-30
share: true
---
<style type="text/css">
.chartContainer {
  height: 300px;
}

#svgContainer {
  width: 100%;
  height: 100%;
}

.conceptLabel > line {
  stroke-width: 1;
  stroke-opacity: .8;
  stroke: grey;
}

.conceptLabel > text {
  font-size: 15px;
  opacity: .6;
}

/* Dates and Date Labels */
.pointDot {
  fill: white;
  stroke: black;
}

.pointDot:hover {
  cursor: pointer;
}

.dateLabels {
  font-size: 18px;
  font-family: Consolas;
  fill: grey;
  opacity: 0;
}

.dateLine {
  stroke-width: 1
  stroke: grey;
}

.active.pointDot {
  fill: #89c6d3;
}

.active > .dateLabels {
  opacity: 1;
  fill: black;
}

.active > .dateLine {
  stroke: black;
  stroke-width: 1;
  opacity: 1 
}

/* Text Area */
.textHeader {
  margin-top: 30px;
  text-align: center;
  font-size: 30px;
}

#fontTest {
  font-size: 18px;
  font-family: Consolas;
  position: absolute;
  visibility: hidden;
  height: auto;
  width: auto;
  white-space: nowrap;
}

.text { 
  margin-top: 30px;
  margin-bottom: 30px;
  height: 100px;
}

.textHeader {
  display: inline;
  margin: 0px 10px;
}

/* Text Area Navigation Buttons */
.navigation {
  margin-top: 45px;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
  text-align: center;
}

.navigation > .pointer {
    text-decoration: none;
    display: inline;
    padding: 8px 16px;
    cursor: pointer;
}

.navigation > .pointer:hover {
    background-color: #ddd;
    color: black;
}

.previous {
    background-color: #f1f1f1;
    color: black;
}

.next {
    background-color: #89c6d3;
    color: white;
}

.round {
    border-radius: 50%;
}

</style>
<svg id="fontTest">
  <text></text>
</svg>

<div class="navigation">
  <div class="pointer previous round">&#8249;</div>
  <div class="textHeader"></div>
  <div class="pointer next round">&#8250;</div>
</div>

<div class="text"></div>
<div class="chartContainer">
  <svg id="svgContainer"></svg>
</div>

<script src="{{ site.baseurl }}/assets/js/react-timeline.js"></script>
<script type="text/javascript">
  $(document).ready(function() {

    const FIRST_INDEX = 0;
    const LAST_INDEX = timelinePoints.length - 1;

    function getDateForIndex(index) {
      return $('.pointDot[index=' + index + ']');
    }

    function getLabelForIndex(index) {
      return $('.labelContainer[index=' + index + ']');
    }
    
    function renderCurrIndex() {
      getLabelForIndex(currIndex).addClass("active");
      getDateForIndex(currIndex).addClass("active");

      var date = toDateString(getDate(timelinePoints[currIndex]));
      var entry = getEntry(timelinePoints[currIndex]);
      $('.textHeader').text(date);
      $('.text').text(entry);
    }

    function hidePrevIndex() {
      getLabelForIndex(currIndex).removeClass("active");
      getDateForIndex(currIndex).removeClass("active");
    }

    let currIndex = 0;
    renderCurrIndex();

    $('.pointDot').on('click', function() {
      hidePrevIndex();
      const nextIndex = $(this).index();
      currIndex = nextIndex;
      renderCurrIndex();
    })

    $('.pointer.previous').on('click', function() {
      if (currIndex == FIRST_INDEX) {
        return
      }
      hidePrevIndex();
      currIndex = currIndex - 1;
      renderCurrIndex();
    });

    $('.pointer.next').on('click', function() {
      if (currIndex == LAST_INDEX) {
        return
      }
      hidePrevIndex();
      currIndex = currIndex + 1;
      renderCurrIndex();
    });
})
</script>