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
  r: 6;
}

.pointDot:hover {
  cursor: pointer;
}

.active.pointDot {
  fill: #5b9ead;
  r: 10;
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

i:hover {
  border: solid #5b9ead;
  border-width: 0 2.5px 2.5px 0;
}

.next {
    transform: rotate(-45deg);
    -webkit-transform: rotate(-45deg);
}

.previous {
  transform: rotate(135deg);
  -webkit-transform: rotate(135deg);
}

.arrow.inactive {
  cursor: default;
  border: solid #bbb;
  border-width: 0 2.5px 2.5px 0;
}

</style>
<svg id="fontTest">
  <text></text>
</svg>

<div class="textHeader"></div>

<div class="navigationContainer">
  <div class="arrowContainer"><i class="arrow previous"></i></div>
  <div class="text"></div>
  <div class="arrowContainer"><i class="arrow next"></i></div>
</div>

<div class="chartContainer">
  <svg id="svgContainer"></svg>
</div>

<script src="{{ site.baseurl }}/assets/js/react-timeline.js"></script>
<script type="text/javascript">
  $(document).ready(function() {
    const INTRODUCTION_ENTRY = 'React has transformed how I think about front-end development, and I am grateful to have learned about it this past year. It took me some time to grasp how to do things the "React" way, so I wanted to build a timeline documenting when I was first understood various concepts within the React stack, and in what context.';

    const INTRODUCTION_INDEX = -1;
    const FIRST_INDEX = 0;
    const LAST_INDEX = timelinePoints.length - 1;

    function renderIntroduction() {
      $('.textHeader').text('Introduction');
      $('.arrow.previous').addClass("inactive");
    }

    function getDateForIndex(index) {
      return $('.pointDot[index=' + index + ']');
    }

    function getLabelForIndex(index) {
      return $('.labelContainer[index=' + index + ']');
    }

    function renderIntroduction() {
      $('.arrow.previous').addClass("inactive");
      date = 'Introduction';
      entry = INTRODUCTION_ENTRY;
      return { date: date, entry: entry }
    }

    function renderPoint() {
      getDateForIndex(currIndex).addClass("active");
      $('.arrow.previous').removeClass("inactive");
      date = getDate(timelinePoints[currIndex]).toDateString() + ':';
      entry = getEntry(timelinePoints[currIndex]);
      return { date: date, entry: entry };
    }
    
    function renderCurrIndex() {

      let toRender;
      if (currIndex === INTRODUCTION_INDEX) {
         toRender = renderIntroduction();   
      } else {
         toRender = renderPoint();   
      }

      $('.textHeader').text(toRender.date);
      $('.text').text(toRender.entry);

      if (currIndex === LAST_INDEX) {
        $('.arrow.next').addClass("inactive");
      } else {
        $('.arrow.next').removeClass("inactive");
      }
    }

    function hidePrevIndex() {
      getDateForIndex(currIndex).removeClass("active");
    }

    let currIndex = -1;
    renderCurrIndex();

    $('.pointDot').on('click', function() {
      hidePrevIndex();
      currIndex = $(this).index();
      renderCurrIndex();
    })

    $('.arrow.previous').on('click', function() {
      if (currIndex == INTRODUCTION_INDEX) {
        return;
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