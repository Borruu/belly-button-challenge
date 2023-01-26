const url =
  "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

// dataPromise.then(function (data) {
//   console.log(data);
// });

let output = {
  metadata: [],
  names: [],
  samples: [],
};
// dataPromise.then(function (data) {
//   (output.metadata = data[metadata]),
//     (output.names = data[names]),
//     (output.samples = data[samples]);
//   console.log(output);
// });

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
    // Access key 'metadata'
    let metaArray = Object.values(data.metadata);
    // Isolate individual subject's demographic information
    let meta_dict = metaArray.filter(function findSubject(subject) {
      return subject.id == findName;
    });
    let demo_data = Object.values(meta_dict[0]);
    let age = demo_data[3];
    let bbtype = demo_data[5];
    let ethnicity = demo_data[1];
    let gender = demo_data[2];
    let location = demo_data[4];
    let wfreq = demo_data[6];

    // <div id="sample-metadata" class="panel-body">CONTENT GOES HERE</div>
    // </div>
    // add demographic info in panel
    let pbody = d3.select("#sample-metadata");
    let idRow = pbody.append("div").attr("class", "key-text").text(`id: `);
    // ${findName}`);
    let idValue = idRow
      .append("span")
      .attr("class", "value-text")
      .text(findName);

    let ethRow = pbody
      .append("div")
      .attr("class", "key-text")
      .text(`Ethnicity: `);
    // ${ethnicity}`);
    let ethValue = ethRow
      .append("span")
      .attr("class", "value-text")
      .text(ethnicity);

    let genderRow = pbody
      .append("div")
      .attr("class", "key-text")
      .text(`Gender: `);
    let genValue = genderRow
      .append("span")
      .attr("class", "value-text")
      .text(gender);

    let ageRow = pbody.append("div").attr("class", "key-text").text(`Age: `);
    let ageValue = ageRow.append("span").attr("class", "value-text").text(age);

    let locationRow = pbody
      .append("div")
      .attr("class", "key-text")
      .text(`Location: `);
    let locValue = locationRow
      .append("span")
      .attr("class", "value-text")
      .text(location);

    let bbtypeRow = pbody
      .append("div")
      .attr("class", "key-text")
      .text(`Belly button type: `);
    let bbtValue = bbtypeRow
      .append("span")
      .attr("class", "value-text")
      .text(bbtype);

    let wfreqRow = pbody
      .append("div")
      .attr("class", "key-text")
      .text(`Wash frequency: `);
    let wfValue = wfreqRow
      .append("span")
      .attr("class", "value-text")
      .text(wfreq);

    // Access key 'samples'
    let sampleArray = Object.values(data.samples);
    console.log(sampleArray);
    let nameIn = d3.select("#selDataset").value;
    console.log(nameIn);
    // Isolate individual subject's sample information
    let sample_dict = sampleArray.filter(function findSubject(subject) {
      return subject.id == findName;
    });
    let sample_data = sample_dict[0];
    console.log(sample_data);

    let samId = Object.values(sample_data.id);
    let samV = Object.values(sample_data.sample_values);
    let otuIds = Object.values(sample_data.otu_ids);
    let otuLabels = Object.values(sample_data.otu_labels);
    console.log(`samId: ${samId}`);
    console.log(`samV: ${samV}`);
    console.log(`otuIds: ${otuIds}`);
    console.log(`otuLabels: ${otuLabels}`);
    let data_restructured = [];
    for (i in samV) {
      let x = samV[i];
      console.log(x);
      let y = otuIds[i];
      let z = otuLabels[i];
      let item_dict = { item_sample: x, item_otuId: y, item_otuLabel: z };
      data_restructured.push(item_dict);
    }

    let sorted_data = data_restructured.sort(
      (a, b) => b.item_sample - a.item_sample
    );

    let sliced_data = sorted_data.slice(0, 10);
    console.log(sliced_data);
    let rev_sliced_data = sliced_data.reverse();
    let plotx = [];
    let ploty = [];
    let plotz = [];
    for (i in rev_sliced_data) {
      let dict = rev_sliced_data[i];
      plotx.push(dict.item_sample);
      ploty.push(`OTU ID ${dict.item_otuId}`);
      plotz.push(dict.item_otuLabel);
    }
    console.log(plotx);
    console.log(ploty);
    console.log(plotz);

    // get data for bubble chart (all data points, otuIds remain as integer)
    let bubx = [];
    let buby = [];
    let bubz = [];
    for (i in sorted_data) {
      let bdict = sorted_data[i];
      bubx.push(bdict.item_otuId);
      buby.push(bdict.item_sample);
      bubz.push(bdict.item_otuLabel);
    }

    // use otu_ids as labels (x axis)
    // use sample_values as values for (y axis) and marker size
    // use otuIds as scale for colour
    // use otu_labels as hovertext for chart
    var trace1 = {
      type: "bar",
      x: plotx,
      y: ploty,
      orientation: "h",
      text: plotz,
    };
    var data = [trace1];
    Plotly.newPlot("bar", data);

    // var desired_maximum_marker_size = 10;
    console.log(bubx);

    var trace2 = {
      x: bubx,
      y: buby,
      text: bubz,
      mode: "markers",
      marker: {
        size: buby,
        sizeref: 0.05,
        // sizeref: (2.0 * Math.max(buby)) / desired_maximum_marker_size ** 2,
        sizemode: "area",
        color: bubx,
        colorscale: "Bluered",
      },
    };
    var bubble_data = [trace2];

    var layout2 = {
      showlegend: false,
      plot_bgcolor: "#F8F9EA",
      height: 600,
      width: 1000,
      xaxis: { title: { text: "OTU ID" } },
    };

    Plotly.newPlot("bubble", bubble_data, layout2);
  });
}
// event listener dropdown menu
// let drop = d3.selectAll("#selDataset");
// drop.on("change", optionChanged);

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

//
