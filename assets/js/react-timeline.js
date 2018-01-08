/* ==== Utility Functions ==== */
function getDate(d) { return d.date };
function getEntry(e) { return e.entry };
function setCircle(r) { $('.pointDot>circle').attr("r", r) };
function getWidth(d) { return dateToWidth(getDate(d)) };
function toDateString(d) { return d.toISOString().substring(5, 10) };
function isEven(i) { return i % 2 == 0};
function em(input) {
 var emSize = parseFloat($('.dateLabels').css('font-size'));
 return (emSize * input);
}

/* ==== Data ==== */
var timelinePoints = [
  {
    date: new Date(2017, 10, 06),
    entry: 'Complete React.js walkthrough tutorial (https://reactjs.org/tutorial/tutorial.html)'
  }, // 0 Tutorial
  {
    date: new Date(2017, 10, 09), 
    entry: 'Modify my first React component at work, which involved adding a title to our online code editor, and adding some styling.'
  }, // 1 First Component Edit: Added Style
  { 
    date: new Date(2017, 10, 10), 
    entry: 'Complete items 1 and 2 in the improvements section of the React tutorial.', 
  }, // 2 Tutorial
  { 
    date: new Date(2017, 10, 16), 
    entry: "First exposure to React and Redux, although I didn't have the slightest idea what was happening at the time. The change involved moving the 'connect to redux' from a parent component to its child component, but introduced no new logic about changing state.",
  }, // 3
  { 
    date: new Date(2017, 10, 17),
    entry: 'First meaningful react component involving local state, and user interaction which changes that state. The component was a "Tab Header", which changed style when the user clicked on tab header. Important to note that I was able to create this component in large because similar functionality existed elswhere in another component.',
  }, // 4 First React Component with state
  { 
    date: new Date(2017, 10, 21),
    entry: 'First pure "presentation" component, which extracted out the style change logic from the above component so that it could be re-used.',
  }, // 5
  { 
    date: new Date(2017, 10, 28),
    entry: 'First modification to a redux reducer.',
  }, // 6
  { 
    date: new Date(2017, 10, 30),
    entry: "First time using the redux cycle to update state: first time dispatching a new action, first time writing a new reducer, first time using mapStateToProps to subsequently take a slice of that Redux store and convert them into a component's props.",
  }, // 7 Redux
  { 
    date: new Date(2017, 11, 05),
    entry: 'Use componentDidMount and componentDidUpdate to integrate the react component with logic implemented in another frame-work.',
  }, // 8
  { 
    date: new Date(2017, 11, 19),
    entry: 'First time writing a new mapDispatchToProps function, and understanding how the function can be used to follow the philosophy of having state updaters used as props of a component.', 
  }, // 9 {
  {
    date: new Date(2017, 11, 23),
    entry: "First big-picture understanding of the various parts of a Javascript/React toolchain. Babel for transpiling, webpack for module bundling and style loaders (makes the import 'styles' modules for our components feasible).",
  }, // 10
  { 
    date: new Date(2017, 11, 26),
    entry: 'Crystallized understanding of JSX, Events and the React Component Lifecycle. First understanding of props.children, and how Higher Ordered Components can be used to enhance the functionality of Components.',
  }, // 11
  {
    date: new Date(2018, 0, 3),
    entry: 'First time writing a saga to tie events to actions'
  }
];

// append timelinePoints with rendered heights and width of each date.
(function() {
  function getTextSize (text) {
    var fontTest = $('#fontTest > text');
    fontTest.text(text);
    var rect = fontTest[0].getBoundingClientRect();
    return rect;
  }

  timelinePoints.forEach(function(point) {
    const textSizeInfo = getTextSize(toDateString(getDate(point)));
    point.textWidth = textSizeInfo.width;
    point.textHeight = textSizeInfo.height;
  })

  fontTest.remove();
})();

const START_DATE = new Date(2017, 10, 04);
const END_DATE = new Date(2018, 0, 05);

/* ==== General UI settings ==== */
var TOP_MARGIN = 50;
var LEFT_MARGIN = 15;
var RIGHT_MARGIN = 50; // TODO: scale this according to the text
var TOTAL_SIDE_MARGIN = LEFT_MARGIN + RIGHT_MARGIN;

parentContainer = $('.chartContainer');
var parentWidth = parentContainer.width();
var timelineWidth = parentWidth - TOTAL_SIDE_MARGIN;

var timelineHeight = 100;
var timelineBottom = timelineHeight;
var parentHeight = timelineHeight + TOP_MARGIN;
parentContainer.height(parentHeight);

var svgContainer = d3.select("svg#svgContainer");

/* ==== X-AXIS ==== */

const tickValues =  [
  START_DATE,
  new Date(2017, 11, 01),
  END_DATE,
]


var dateToWidth = d3.scaleTime().range([0, timelineWidth]).domain([START_DATE, END_DATE]);{}
svgContainer.append("g")
            .attr("class", "xAxis")
            .attr("transform", translate(LEFT_MARGIN, TOP_MARGIN))
            d3.select(".xAxis").call(d3.axisBottom(dateToWidth).tickValues(tickValues).tickFormat(d3.timeFormat("%m-%d")))

/* ==== Charting ==== */
var timelineContainer = svgContainer.append("g")
                                    .attr("class", "timelineContainer")
                                    .attr("transform", translate(LEFT_MARGIN, TOP_MARGIN));

/* ==== Concept Regions ==== */
var conceptRegion = [
  { start: 0, label: "Tutorial" },
  { start: 3, label: "Basic Components" },
  { start: 7, label: "Redux" },
  { start: 8, label: "Component Lifecycle"},
  { start: 12, label: "Sagas" },
];

var LINE_HEIGHT = parentHeight * .45;

var REGION_START = TOP_MARGIN;
var conceptSelection = timelineContainer.append("g")
                 .attr("class", "concepts")
                 .selectAll(".regionArea")
                 .data(conceptRegion)
                 .enter()
                 .append("g")
                 .attr("class", "conceptLabel")
                 .attr("transform", d => translate(getWidth(timelinePoints[d.start]), 0))

conceptSelection.append('line')
                .attr('x1', 0)
                .attr('y1', 0)
                .attr('x2', 0)
                .attr('y2', LINE_HEIGHT)

const HORIZ_OFFSET = 5;
const HORIZ_LENGTH = 8;
conceptSelection.append('line')
                .attr('x1', 0)
                .attr('y1', LINE_HEIGHT - HORIZ_OFFSET)
                .attr('x2', HORIZ_LENGTH)
                .attr('y2', LINE_HEIGHT - HORIZ_OFFSET)

conceptSelection.append("text")
                .text(d => d.label)
                .attr("x", 10)
                .attr("dy", LINE_HEIGHT);

/* ==== Timeline Labels ==== */
var labelSelection = timelineContainer.append("g")
                             .attr("class", "labels")
                             .selectAll(".points")
                             .data(timelinePoints)
                             .enter()
                             .append("g")
                             .attr("class", "labelContainer")
                             .attr("index", (d, i) => i)

var LABEL_HEIGHT = -30;
labelSelection.append("line")
             .attr("class", "dateLine")
             .attr("x1", d => getWidth(d) )
             .attr("x2", d => getWidth(d) )
             .attr("y1", d => LABEL_HEIGHT)
             .attr("y2", 0);

const LABEL_TEXT_BUFFER  = -5;
labelSelection.append("text")
             .attr("class", "dateLabels")
             .attr("x", d => getWidth(d) - d.textWidth / 2)
             .attr("dy", LABEL_HEIGHT + LABEL_TEXT_BUFFER)
             .text(d => toDateString(getDate(d)) )

/* ==== Timeline Dates ==== */
var DOT_SIZE = 5.5;
var dateSelection = timelineContainer.append("g")
                             .attr("class", "dates")
                             .selectAll(".points")
                             .data(timelinePoints)
                             .enter()

dateSelection.append("circle")
             .attr("index", (d, i) => i)
             .attr("r", DOT_SIZE)
             .attr("cx", d => getWidth(d))
             .attr("class", "pointDot")
             .attr("cy", 0)
