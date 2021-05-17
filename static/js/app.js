
function Plot(id) {

  d3.json("../data/samples.json").then((info)=> {

    var washing_freq = info.metadata.map(d => d.wfreq)

    var samples = info.samples.filter(s => s.id.toString() === id)[0];

    var sampleValues = samples.sample_values.slice(0,10).reverse();

    var OTU_top10 = samples.otu_ids.slice(0,10).reverse();

    var OTU_id = OTU_top10.map(d => "OTU " + d)

    var labels = samples.otu_labels.slice(0,10);

    var trace_bar = {
       x: sampleValues,
       y: OTU_id,
       text: labels,
       marker: {
         color: 'rgb(78, 66, 245)'
        },
       type: "bar",
       orientation: "h",
    };

    var layout_bar = {
      title: "<b>Top 10 OTU</b>",
      "titlefont": {"size": 20},
      yaxis: {
        tickmode: "linear",
      },
      xaxis: {title: "Frequency"},
      margin: {
        l: 100,
        r: 20,
        t: 100,
        b: 30
      }
    };

    var data_bar = [trace_bar];

    Plotly.newPlot("bar", data_bar, layout_bar);

    var trace_bubble = {
      x: samples.otu_ids,
      y: samples.sample_values,
      mode: "markers",
      marker: {
        size: samples.sample_values,
        color: samples.otu_ids
      },
      text: samples.otu_labels
    };

    var layout_bubble = {
      title: "<b>Number of OTU</b>",
      "titlefont": {"size": 20,},
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Frequency"},
      height: 600,
      width: 1200
    };

  
    var data_bubble = [trace_bubble]; 

  
    Plotly.newPlot("bubble", data_bubble, layout_bubble);

    var data_gauge = [{
      domain: { x: [0,1], y: [0,1] },
      value: parseFloat(washing_freq),
      title: "<b>Belly Button Washing Frequency</b><br><i>Scrubs Per Week</i>",
      "titlefont": {"size": 20,},
      type: "indicator",
      mode: "gauge+number",
      gauge: { axis: { range: [null, 10] },
              steps: [
                { range: [0,2], color: 'rgb(255,0,0)' },
                { range: [2,4], color: 'rgb(200,100,0)' },
                { range: [4,6], color: 'rgb(150,150,0)' },
                { range: [6,8], color: 'rgb(100,200,0)' },
                { range: [8,10], color: 'rgb(0,255,0))' },
              ]}
    }
    ];

    var layout_gauge = {
      width: 700,
      height: 600,
      margin: {
        t:20,
        b:40,
        l: 0,
        r: 275 }
      };

    Plotly.newPlot("gauge", data_gauge, layout_gauge);

  });
}


function getInfo(id) {

  d3.json("../data/samples.json").then((data)=> {
  

    var metadata = data.metadata;
    console.log(metadata)

    var result = metadata.filter(meta => meta.id.toString() === id)[0];

    var demographic_info = d3.select("#sample-metadata");

    demographic_info.html("");

    Object.entries(result).forEach((key) => {
      demographic_info.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");
    });
  });
}

function optionChanged(id) {
  Plot(id);
  getInfo(id);
}

function init() {

  var dropdown = d3.select("#selDataset");

  d3.json("../data/samples.json").then((data)=> {

    data.names.forEach(function(name){
      dropdown.append("option").text(name).property("value");
    });

    Plot(data.names[0]);
    getInfo(data.names[0]);
  
  });
}

init();