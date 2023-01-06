const url =
  "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

dataPromise.then(function (data) {
  console.log(data);
});

// read subject names from dataset and reflect these in the dropdown menu
dataPromise.then(function (data) {
  let nameList = Object.values(data.names);
  console.log(nameList);
  let drop = d3.select("#selDataset");
  for (each in nameList) {
    let thisOp = drop.append("option");
    thisOp.text(nameList[each]);
    thisOp.attr("value", parseInt(thisOp.text()));
  }
});

// create a horizontal bar chart to display the top 10 OTUs found in the individual

// use sample_values as values for the bar chart (y axis)

// event listener dropdown menu
function optionChanged() {
  console.log(this);
  let subject = d3.select(this.value);

  dataPromise.then(function (data) {
    let sampleArray = Object.values(data.samples);
    function findSubject(subject) {
      return subject.id == this.text;
    }
    let sample_dict = sampleArray.filter(findSubject);
    console.log(sample_dict);
  });
}
// let samId = sampleArray.id;
// let samV = sampleArray.sample_values;
// let otuIds = sampleArray.otu_ids;
// let otuLables = sampleArray.otu_labels;
// use otu_isd as labels (x axis)

// use otu_labels as hovertext for chart

function init() {
  let myData = dataPromise.then(function (data) {
    console.log(data);
    return data;
  });

  let drop = d3.select("#selDataset");
  let sb_names = myData.names;

  for (each in sb_names) {
    let thisOp = drop.append("option").text(sb_names[each]);
    thisOp.value(parseInt(sb_names[each]));
  }
}

dataPromise.then(init());
// Uncaught TypeError: Cannot convert undefined or null to object
// at Function.values (<anonymous>)
// at init (app.js:21:25)
