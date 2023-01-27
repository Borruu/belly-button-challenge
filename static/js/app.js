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
  init(940, data);
});

// define function optionChanged. Data promise.
function optionChanged(subId) {
  var newName = subId;
  dataPromise.then(function (data) {
    changeAll(newName, data);
  });
}
// define function changeAll to update all information.
function changeAll(newName, data) {
  // Access key 'metadata'
  let metaArray = Object.values(data.metadata);
  // Isolate individual subject's demographic information
  let meta_dict = metaArray.filter(function findSubject(subject) {
    return subject.id == newName;
  });
  let demo_data = Object.values(meta_dict[0]);
  let age = demo_data[3];
  let bbtype = demo_data[5];
  let ethnicity = demo_data[1];
  let gender = demo_data[2];
  let location = demo_data[4];
  let wfreq = demo_data[6];

  let idValue = d3.select("#idV");
  idValue.text(newName);

  let ethValue = d3.select("#idE");
  ethValue.text(ethnicity);

  let genValue = d3.select("#idG");
  genValue.text(gender);

  let ageValue = d3.select("#idA");
  ageValue.text(age);

  let locValue = d3.select("#idL");
  locValue.text(location);

  let bbtValue = d3.select("#idB");
  bbtValue.text(bbtype);

  let wfValue = d3.select("#idW");
  wfValue.text(wfreq);
  // GET DATA FOR BAR CHART
  // Access key 'samples'
  let sampleArray = Object.values(data.samples);
  // Isolate individual subject's sample information
  let sample_dict = sampleArray.filter(function findSubject(subject) {
    return subject.id == newName;
  });
  let sample_data = sample_dict[0];
  let samV = Object.values(sample_data.sample_values);
  let otuIds = Object.values(sample_data.otu_ids);
  let otuLabels = Object.values(sample_data.otu_labels);
  // restructure data into array of single-bacterium objects
  let data_restructured = [];
  for (i in samV) {
    let x = samV[i];
    let y = otuIds[i];
    let z = otuLabels[i];
    let item_dict = { item_sample: x, item_otuId: y, item_otuLabel: z };
    data_restructured.push(item_dict);
  }
  // sort data by bacteria count descending
  let sorted_data = data_restructured.sort(
    (a, b) => b.item_sample - a.item_sample
  );
  // get top 10 bacteria to plot bar chart
  let sliced_data = sorted_data.slice(0, 10);
  console.log(sliced_data);
  let rev_sliced_data = sliced_data.reverse();
  let plotx = [];
  let ploty = [];
  let plotz = [];
  for (j in rev_sliced_data) {
    let dict = rev_sliced_data[j];
    plotx.push(dict.item_sample);
    ploty.push(`OTU ID ${dict.item_otuId}`);
    plotz.push(dict.item_otuLabel);
  }
  var newTrace = {
    type: "bar",
    x: [plotx],
    y: [ploty],
    orientation: "h",
    text: [plotz],
  };
  Plotly.restyle("bar", newTrace);
  // GET DATA FOR BUBBLE CHART (all data points, otuIds remain as integer)
  let bubx = [];
  let buby = [];
  let bubz = [];
  for (i in sorted_data) {
    let bdict = sorted_data[i];
    bubx.push(bdict.item_otuId);
    buby.push(bdict.item_sample);
    bubz.push(bdict.item_otuLabel);
  }
  var newTrace2 = {
    x: [bubx],
    y: [buby],
    text: [bubz],
    mode: "markers",
    marker: {
      size: buby,
      sizeref: 0.05,
      sizemode: "area",
      color: bubx,
      colorscale: "Bluered",
    },
  };
  Plotly.restyle("bubble", newTrace2);
  // RESTYLE GAUGE
  var newgData = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: wfreq,
      title: { text: "Wash frequency per week" },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {
          range: [null, 9],
          tickmode: "array",
          // ticks: "inside",
          ticktext: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        },
        bar: { color: "aqua" },
        steps: [
          { range: [0, 1], color: "#b3db5d" },
          { range: [1, 2], color: "#70cd6d" },
          { range: [2, 3], color: "#00bc81" },
          { range: [3, 4], color: "#00a892" },
          { range: [4, 5], color: "#00939d" },
          { range: [5, 6], color: "#007c9f" },
          { range: [6, 7], color: "#006597" },
          { range: [7, 8], color: "#004d85" },
          { range: [8, 9], color: "#16366b" },
        ],
      },
    },
  ];

  Plotly.restyle("gauge", "value", wfreq);
}

// define function init
function init(subId, data) {
  console.log(subId);
  var findName = subId;
  // let nameIn = d3.select(this.text);
  // dataPromise.then(function (data) {
  // Access key 'metadata'
  let metaArray = Object.values(data.metadata);
  // Isolate individual subject's demographic information
  let meta_dict = metaArray.filter(function findSubject(subject) {
    return subject.id == findName;
  });
  // save values to variables
  let demo_data = Object.values(meta_dict[0]);
  let age = demo_data[3];
  let bbtype = demo_data[5];
  let ethnicity = demo_data[1];
  let gender = demo_data[2];
  let location = demo_data[4];
  let wfreq = demo_data[6];

  // <div id="sample-metadata" class="panel-body">CONTENT GOES HERE</div></div>

  // add html & demographic info in panel
  let pbody = d3.select("#sample-metadata");
  var idRow = pbody.append("div").attr("class", "key-text").text(`id: `);
  var idValue = idRow
    .append("span")
    .attr("class", "value-text")
    .attr("id", "idV")
    .text(findName);
  var ethRow = pbody
    .append("div")
    .attr("class", "key-text")
    .text(`Ethnicity: `);
  var ethValue = ethRow
    .append("span")
    .attr("class", "value-text")
    .attr("id", "idE")
    .text(ethnicity);
  var genderRow = pbody
    .append("div")
    .attr("class", "key-text")
    .text(`Gender: `);
  var genValue = genderRow
    .append("span")
    .attr("class", "value-text")
    .attr("id", "idG")
    .text(gender);
  var ageRow = pbody.append("div").attr("class", "key-text").text(`Age: `);
  var ageValue = ageRow
    .append("span")
    .attr("class", "value-text")
    .attr("id", "idA")
    .text(age);
  var locationRow = pbody
    .append("div")
    .attr("class", "key-text")
    .text(`Location: `);
  var locValue = locationRow
    .append("span")
    .attr("class", "value-text")
    .attr("id", "idL")
    .text(location);
  var bbtypeRow = pbody
    .append("div")
    .attr("class", "key-text")
    .text(`Belly button type: `);
  var bbtValue = bbtypeRow
    .append("span")
    .attr("class", "value-text")
    .attr("id", "idB")
    .text(bbtype);
  var wfreqRow = pbody
    .append("div")
    .attr("class", "key-text")
    .text(`Wash frequency: `);
  var wfValue = wfreqRow
    .append("span")
    .attr("class", "value-text")
    .attr("id", "idW")
    .text(wfreq);

  // Access key 'samples'
  let sampleArray = Object.values(data.samples);
  console.log(sampleArray);

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
  // get top 10 bacteria to plot bar chart
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

  var trace1 = {
    type: "bar",
    x: plotx,
    y: ploty,
    orientation: "h",
    text: plotz,
  };
  var barData = [trace1];
  Plotly.newPlot("bar", barData);

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
      sizemode: "area",
      color: bubx,
      colorscale: "Bluered",
    },
  };
  var bubble_data = [trace2];

  var layout2 = {
    showlegend: false,
    plot_bgcolor: "#F8F9EA",
    // height: 600,
    // width: 1000,
    xaxis: { title: { text: "OTU ID" } },
  };

  Plotly.newPlot("bubble", bubble_data, layout2);

  var gData = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: wfreq,
      title: { text: "Wash frequency per week" },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {
          range: [null, 9],
          tickmode: "array",
          // ticks: "inside",
          ticktext: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        },
        bar: { color: "aqua" },
        steps: [
          { range: [0, 1], color: "#b3db5d" },
          { range: [1, 2], color: "#70cd6d" },
          { range: [2, 3], color: "#00bc81" },
          { range: [3, 4], color: "#00a892" },
          { range: [4, 5], color: "#00939d" },
          { range: [5, 6], color: "#007c9f" },
          { range: [6, 7], color: "#006597" },
          { range: [7, 8], color: "#004d85" },
          { range: [8, 9], color: "#16366b" },
        ],
      },
    },
  ];
  // "#FDD5FF"
  var gLayout = {
    margin: { t: 0, b: 0 },
  };
  Plotly.newPlot("gauge", gData, gLayout);
}
