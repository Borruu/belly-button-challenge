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

// function to select one dictionary from array in samples

// define function optionChanged
function optionChanged(subId) {
  console.log(subId);
  var findName = subId;
  // let nameIn = d3.select(this.text);
  dataPromise.then(function (data) {
    let sampleArray = Object.values(data.samples);
    console.log(sampleArray);
    let nameIn = d3.select("#selDataset").value;
    console.log(nameIn);
    let sample_dict = sampleArray.filter(function findSubject(subject) {
      // console.log(subject.id == findName);
      return subject.id == findName;
    });
    console.log(sample_dict);

    let samId = sample_dict.id;
    let samV = sample_dict.sample_values;
    let otuIds = sample_dict.otu_ids;
    let otuLabels = sample_dict.otu_labels;
    // use otu_ids as labels (x axis)
    // use sample_values as values for the bar chart (y axis)
    // use otu_labels as hovertext for chart
    var trace1 = {
      x: otuIds,
      y: samV,
      type: "bar",
      orientation: "h",
      text: otuLabels,
    };
    var data = [trace1];
    Plotly.newPlot("bar", data);
  });
}
// event listener dropdown menu
let drop = d3.selectAll("#selDataset");
drop.on("change", optionChanged);

// sample_dict

// let samId = sampleArray.id;
// let samV = sampleArray.sample_values;
// let otuIds = sampleArray.otu_ids;
// let otuLables = sampleArray.otu_labels;

// function init() {
//   let myData = dataPromise.then(function (data) {
//     console.log(data);
//     return data;
//   });

//   let sb_names = myData.names;

//   for (each in sb_names) {
//     let thisOp = drop.append("option").text(sb_names[each]);
//     thisOp.value(parseInt(sb_names[each]));
//   }
// }

// dataPromise.then(init());
// Uncaught TypeError: Cannot convert undefined or null to object
// at Function.values (<anonymous>)
// at init (app.js:21:25)
