
var coords ;
var selected = null;	
var filteredData = null;
var datanames = null;
var  lines = null;      
var jsonorigin ;
var jsondestination;



const stateDict = {
    "1": { state: "Alabama", id: "1", value: 0 },
    "2": { state: "Alaska", id: "2", value: 0 },
    "4": { state: "Arizona", id: "4", value: 0 },
    "5": { state: "Arkansas", id: "5", value: 0 },
    "6": { state: "California", id: "6", value: 0 },
    "8": { state: "Colorado", id: "8", value: 0 },
    "9": { state: "Connecticut", id: "9", value: 0 },
    "10": { state: "Delaware", id: "10", value: 0 },
    "11": { state: "District of Columbia", id: "11", value: 0 },
    "12": { state: "Florida", id: "12", value: 0 },
    "13": { state: "Georgia", id: "13", value: 0 },
    "15": { state: "Hawaii", id: "15", value: 0 },
    "16": { state: "Idaho", id: "16", value: 0 },
    "17": { state: "Illinois", id: "17", value: 0 },
    "18": { state: "Indiana", id: "18", value: 0 },
    "19": { state: "Iowa", id: "19", value: 0 },
    "20": { state: "Kansas", id: "20", value: 0 },
    "21": { state: "Kentucky", id: "21", value: 0 },
    "22": { state: "Louisiana", id: "22", value: 0 },
    "23": { state: "Maine", id: "23", value: 0 },
    "24": { state: "Maryland", id: "24", value: 0 },
    "25": { state: "Massachusetts", id: "25", value: 0 },
    "26": { state: "Michigan", id: "26", value: 0 },
    "27": { state: "Minnesota", id: "27", value: 0 },
    "28": { state: "Mississippi", id: "28", value: 0 },
    "29": { state: "Missouri", id: "29", value: 0 },
    "30": { state: "Montana", id: "30", value: 0 },
    "31": { state: "Nebraska", id: "31", value: 0 },
    "32": { state: "Nevada", id: "32", value: 0 },
    "33": { state: "New Hampshire", id: "33", value: 0 },
    "34": { state: "New Jersey", id: "34", value: 0 },
    "35": { state: "New Mexico", id: "35", value: 0 },
    "36": { state: "New York", id: "36", value: 0 },
    "37": { state: "North Carolina", id: "37", value: 0 },
    "38": { state: "North Dakota", id: "38", value: 0 },
    "39": { state: "Ohio", id: "39", value: 0 },
    "40": { state: "Oklahoma", id: "40", value: 0 },
    "41": { state: "Oregon", id: "41", value: 0 },
    "42": { state: "Pennsylvania", id: "42", value: 0 },
    "44": { state: "Rhode Island", id: "44", value: 0 },
    "45": { state: "South Carolina", id: "45", value: 0 },
    "46": { state: "South Dakota", id: "46", value: 0 },
    "47": { state: "Tennessee", id: "47", value: 0 },
    "48": { state: "Texas", id: "48", value: 0 },
    "49": { state: "Utah", id: "49", value: 0 },
    "50": { state: "Vermont", id: "50", value: 0 },
    "51": { state: "Virginia", id: "51", value: 0 },
    "53": { state: "Washington", id: "53", value: 0 },
    "54": { state: "West Virginia", id: "54", value: 0 },
    "55": { state: "Wisconsin", id: "55", value: 0 },
    "56": { state: "Wyoming", id: "56", value: 0 },
    "72": { state: "Puerto Rico", id: "72", value: 0 },
  };

  
const dateInput = document.getElementById("datePicker");
const display = document.getElementById("selectedDate");
const displayStates = document.getElementById("selectedStatesBox");

dateInput.addEventListener("change", () => {
    selected = dateInput.value;
    display.textContent = `You selected: ${selected}`;
    console.log("selected date",selected)
});

var origin_state_selected = []; // Array to store selected state values
const originSelect = document.getElementById("originStateSelector");
var selectedStateNames = []; 
originSelect.addEventListener("change", () => {
    // Clear the array and re-push all selected options
    origin_state_selected = Array.from(originSelect.selectedOptions)
        .map(option => option.value);  // Get all selected values
    selectedStateNames = Array.from(originSelect.selectedOptions)
        .map(option => option.text);

    displayStates.textContent = selectedStateNames.join(", ");
    
});

    var destination_state_selected = []; // Array to store selected state values
    destinationSelect = document.getElementById("destinationStateSelector");
    var selectedStateNamesdest = []; 
    const displayStatesdest = document.getElementById("selectedStatesBox2");
    destinationSelect.addEventListener("change", () => {
        // Clear the array and re-push all selected options
        destination_state_selected = Array.from(destinationSelect.selectedOptions)
            .map(option => option.value);  // Get all selected values
    
        selectedStateNamesdest = Array.from(destinationSelect.selectedOptions)
            .map(option => option.text);

        displayStatesdest.textContent = selectedStateNamesdest.join(", ");
            });
    



(function() {
    var margin = { top: 0, right: 0, bottom: 0, left: 0 },
        width = 1200 - margin.left - margin.right,
        height = 740 - margin.top - margin.bottom;

    var svg = d3.select("#map")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        function loadDataForDate() {
            console.log("selected date", selected);
        
            // if (!selected || origin_state_selected.length === 0 || destination_state_selected.length === 0) {
            //     console.error("Missing required filter values:", {
            //         selected,
            //         origin_state_selected,
            //         destination_state_selected
            //     });
            //     return;
            // }
        
            Promise.all([
                d3.json("us.json"),
                d3.csv("mergeddata.csv")
            ])
            .then(function([us, flow]) {
                flow = flow.map(d=>d.date_range!=""?{...d,date:d.date_range}:d)
                filteredData = flow.filter(d => {
        
                    return (
                        origin_state_selected.includes(d.geoid_o) &&
                        destination_state_selected.includes(d.geoid_d) &&
                        selected.includes(d.date) 
                    );
                });
        
                // if (filteredData.length === 0) {
                //     console.error("No data found for the selected date and states.");
                //     return;
                // }

                if(filteredData.length !== 0){

                console.log("Data to export", filteredData);
                datanames = filteredData.map(row => ({
                    ...row,
                    geoid_o: stateDict[row.geoid_o]?.state || "Unknown",
                    geoid_d: stateDict[row.geoid_d]?.state || "Unknown"
                }));
                console.log("Data with names", datanames);
            }
                ready(null, us, filteredData);
            })
            .catch(function(error) {
                console.error("Error loading data:", error);
            });
        }
        
        
        var projection = d3.geoAlbersUsa()
        .translate([width / 2, height / 2])
        .scale(1600);

    var path = d3.geoPath().projection(projection);

    function ready(error, us, flow) {

    d3.json("us.json").then(function(data) {

        var states = topojson.feature(data, data.objects.states).features;

        svg.selectAll(".state")
            .data(states)
            .enter().append("path")
            .attr("class", "state")
            .attr("d", path)
            .attr("fill", "steelblue")
            .attr("stroke", "#fff");
        
            svg.selectAll(".flow")
            .data(flow.filter(function(d) {
                var coords = projection([+d.lng_d, +d.lat_d]);
                return coords !== null; 
            }))
            .enter().append("circle")
            .attr("class", "flow")
            .attr("r", 5)
            .attr("cx", function(d) {
                coords = projection([+d.lng_d, +d.lat_d]);
                return coords[0];
            })
            .attr("cy", function(d) {
                coords = projection([+d.lng_d, +d.lat_d]);
                return coords[1];
            });
            svg.selectAll(".flow-line")
            .data(flow.filter(function(d) {
                var source = projection([+d.lng_o, +d.lat_o]); 
                var target = projection([+d.lng_d, +d.lat_d]); 
                return source !== null && target !== null;
            }))
            svg.selectAll(".flow-line")
            .data(flow)
            .enter().append("line")
            .attr("class", "flow-line")
            .attr("x1", function(d) {
                var source = projection([+d.lng_o, +d.lat_o]);
                return source ? source[0] : null;
            })
            .attr("y1", function(d) {
                var source = projection([+d.lng_o, +d.lat_o]);
                return source ? source[1] : null;
            })
            .attr("x2", function(d) {
                var target = projection([+d.lng_d, +d.lat_d]);
                return target ? target[0] : null;
            })
            .attr("y2", function(d) {
                var target = projection([+d.lng_d, +d.lat_d]);
                return target ? target[1] : null;
            })

            .on("mouseover", function(event, d) {
                d3.select("#tooltip")
                    .style("visibility", "visible")
                    .html(`${Math.floor(d.pop_flows)} people in motion from ${stateDict[d.geoid_o].state} to ${stateDict[d.geoid_d].state}`);
            })
            .on("mousemove", function(event) {
                d3.select("#tooltip")
                    .style("top", (event.pageY + 10) + "px")
                    .style("left", (event.pageX + 10) + "px");
            })
            .on("mouseout", function() {
                d3.select("#tooltip").style("visibility", "hidden");
            });
                                //trouver une repartition des couleurs adequate
            var moyenne = d3.mean(filteredData, d => d.pop_flows);
            var max = d3.max(filteredData, d => d.pop_flows);
            var min = d3.min(filteredData, d => d.pop_flows);
            var std = d3.deviation(filteredData, d => d.pop_flows);
            var median = d3.median(filteredData, d => d.pop_flows);
            var q1 = d3.quantile(filteredData, 0.25, d => d.pop_flows);
            var q3 = d3.quantile(filteredData, 0.75, d => d.pop_flows);
            var iqr = q3 - q1;
            var myColor = d3.scaleSequential().domain([min,max]).range(["#ffffb2","#fecc5c","#fd8d3c","#f03b20","#bd0026"]);

            lines = svg.selectAll(".flow-line")
            lines
            .attr("x2", d => projection([+d.lng_o, +d.lat_o])[0]) // set to source
            .attr("y2", d => projection([+d.lng_o, +d.lat_o])[1])
            .attr("stroke", d => myColor(d.pop_flows)) // fix stroke syntax
            .attr("stroke-width", 2)
            lines.transition()
            .duration(4000)
            .attr("x2", d => projection([+d.lng_d, +d.lat_d])[0])
            .attr("y2", d => projection([+d.lng_d, +d.lat_d])[1]);
            })
}        
    loadDataForDate(); 
    var submitbutton = document.getElementById("submitGPT");
    submitbutton.addEventListener("click", function(event) { 
        event.preventDefault(); // Prevent form submission
        var params = document.getElementById("gpt").value;  
        var http = new XMLHttpRequest();
        var sysPrompt = "You are a smart assistant inside a flow visualization app. Your job is to understand natural language and return a JSON object with the structure: { date, origin, destination }. date is in YYYY-MM-DD format. origin and destination must be U.S. if there is multiple origins or destinations just store them in one variable with commas as goeids of the respective states. state GEOIDs. Only return JSON. No explanations, no other text"
        var baseUrl = "https://text.pollinations.ai/"
        http.open('GET', baseUrl+encodeURIComponent(sysPrompt+params), true);
        http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        var jsonResponse;
        http.onreadystatechange =  function() {
            if (http.readyState == 4 && http.status == 200) {
                let response = http.responseText;
                var rawresponse = response.replace(/```json|```/g, '').trim();
                console.log("response", rawresponse);
                try {
                    jsonResponse = JSON.parse(rawresponse);
                    jsondate = jsonResponse.date.trim();
                    selected = jsondate; // Set this first
                    origin_state_selected = jsonResponse.origin.trim().split(",").map(id => id[0]=='0' ? id[1] : id);
                    destination_state_selected = jsonResponse.destination.trim().split(",").map(id => id[0]=='0' ? id[1] : id);
                    selectedStateNames = Array.from(origin_state_selected)
                    .map(option => stateDict[option].state);
                    selectedStateNamesdest = Array.from(destination_state_selected)
                    .map(option => stateDict[option].state);
                    loadDataForDate(); 
                    document.getElementById("gpt").value = "waiting AI to plot ...";
                    setTimeout(() => {
                    document.getElementById("gpt").value = "";
                    }
                    , 2000);
                } catch (error) {
                    console.error("Parsing error:", error);
                }}                
        };http.send();
    })                    


    loadingdata = document.getElementById("load");
    loadingdata.addEventListener("click", function() {
        loadDataForDate();
    });

const reset = () => {
    origin_state_selected = null;
    destination_state_selected = null;
    originStateSelector.value = "";
    destinationStateSelector.value = "";
    selectedStateNames = null;
    selectedStateNamesdest = null;
    dateInput.value = ""; 
    display.textContent = `You selected: `;
    console.log("origin state selected",origin_state_selected);
    console.log("destination state selected",destination_state_selected);
    d3.selectAll(".flow-line").remove();
    d3.selectAll(".flow").remove();
    d3.selectAll("circle").remove();
}

resetbutton = document.getElementById("reset");
resetbutton.addEventListener("click", reset);

const csvdata = null;
const exportButton = document.getElementById("Export");

exportButton.addEventListener("click", () => {
    try {
        const csvData = json2csv.parse(datanames);
        console.log("Exported data:", csvData);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", selected+selectedStateNames,"to",destination_state_selected +"_flow_data.csv");
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (err) {
        console.error("CSV export failed:", err);
    }
});
})(); // Close the IIFE properly
