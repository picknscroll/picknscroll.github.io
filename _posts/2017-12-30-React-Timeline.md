---
layout: post
title: "Learning React: A Visual Timeline"
date: 2017-12-30
share: true
---
<style type="text/css">

#svgContainer {
  width: 100%;
  height: 100%;
  /*border: 1px solid;*/
}

.conceptLabel > line {
  stroke-width: 1;
  stroke: black;
}

.conceptLabel > text {
  font-size: 15px;
  opacity: 1;
}

/* Dates and Date Labels */
.pointDot {
  fill: #f1f1f1;
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
  fill: #5b9ead;
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
  margin: 0px 45px;
  text-align: justify;
}

.textHeader {
  text-align: center;
}

/* Text Area Navigation Buttons */
.navigationContainer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 150px;
}

i {
    border: solid black;
    border-width: 0 2.5px 2.5px 0;
    display: inline-block;
    padding: 3px;
    width: 18px;
    height: 18px;
    cursor: pointer;
}

.next {
    transform: rotate(-45deg);
    -webkit-transform: rotate(-45deg);
}

.previous {
    transform: rotate(135deg);
    -webkit-transform: rotate(135deg);
}


</style>
<svg id="fontTest">
  <text></text>
</svg>

<div class="textHeader"></div>


<div class="navigationContainer">
  <div class="arrowContainer">
    <i class="arrow previous"></i>
  </div>
  <div class="text"></div>
  <div class="arrowContainer"><i class="arrow next"></i></div>
</div>

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
      getDateForIndex(currIndex).addClass("active");

      var date = getDate(timelinePoints[currIndex]).toDateString() + ':';
      var entry = getEntry(timelinePoints[currIndex]);
      $('.textHeader').text(date);
      $('.text').text(entry);
    }

    function hidePrevIndex() {
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

    $('.arrow.previous').on('click', function() {
      if (currIndex == FIRST_INDEX) {
        return
      }
      hidePrevIndex();
      currIndex = currIndex - 1;
      renderCurrIndex();
    });

    $('.arrow.next').on('click', function() {
      if (currIndex == LAST_INDEX) {
        return
      }
      hidePrevIndex();
      currIndex = currIndex + 1;
      renderCurrIndex();
    });
})
</script>