async function drawBar(data,id) {
    const dataset = await d3.json("my_weather_data.json")
    const xAccessor = d => d[data];
    const yAccessor = d => d.length;
    // console.log(yAccessor(data))
    const width = 1200
    let dimensions = {
        width: width,
        height: width * 0.6,
        margin: {
            top: 20,
            right: 30,
            bottom: 20,
            left: 30,
        },
    }
    
    dimensions.boundedWidth = dimensions.width
        - dimensions.margin.left
        - dimensions.margin.right
    dimensions.boundedHeight = dimensions.height
        - dimensions.margin.top
        - dimensions.margin.bottom

    const wrapper = d3.select("#wrapper").html("")
        .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height);

    const bounds = wrapper.append("g")
        .style("translate",`translate(${dimensions.margin.left}px,${dimensions.margin.top}px)`);

    const xScaler = d3.scaleLinear()
        .domain(d3.extent(dataset,xAccessor))
        .range([0,dimensions.boundedWidth])
        .nice()

    const binsGen = d3.bin()
        .domain(xScaler.domain())
        .value(xAccessor)
        .thresholds(12);

    const bins = binsGen(dataset);
    //console.log(bins);

    const yScaler = d3.scaleLinear()
        .domain([0, d3.max(bins, yAccessor) + 10])
        .range([dimensions.boundedHeight,0])

    const binGroup = bounds.append("g");
    const binGroups = binGroup.selectAll("g")
        .data(bins)
        .enter()
        .append("g");


    const barPadding = 1
    const barRect = binGroups.append("rect")
        .attr("x", d => xScaler(d.x0) + barPadding/2 + 50) 
        .attr("y", d => yScaler(yAccessor(d)))
        .attr("width", d => d3.max([0, xScaler(d.x1) - xScaler(d.x0) - barPadding]))
        .attr("height", d => dimensions.boundedHeight - yScaler(yAccessor(d)))
        .attr("fill", "#AAAAEE");

    const mean = d3.mean(dataset,xAccessor);
    const meanLine = bounds.append("line")
        .attr("x1", xScaler(mean))
        .attr("x2", xScaler(mean))
        .attr("y1", -15)
        .attr("y2", dimensions.boundedHeight)
        .attr("stroke","black")
        .attr("stroke-dasharray","2px 4px");

    const meanLabel = bounds.append("text")
        .attr("x",xScaler(mean))
        .attr("y",10)
        .text("Mean")
        .attr("fill","maroon")
        .attr("font-size","12px")
        .attr("text-anchor","middle");

    const xAxisGen = d3.axisBottom()
        .scale(xScaler);
    const xAxis = bounds.append("g")
        .call(xAxisGen)
        .attr("transform", `translate(${50},${dimensions.boundedHeight} )`);


    
    const yAxisGen = d3.axisLeft()
        .scale(yScaler);
    const yAxis = bounds.append("g")
        .call(yAxisGen)
        .attr("transform", `translate(${50}, 0)`);

    const barText = binGroups.filter(yAccessor)
        .append("text")
        .attr("x", d => xScaler(d.x0) + (xScaler(d.x1)-xScaler(d.x0))/2 + 50)
        .attr("y", d => yScaler(yAccessor(d)) - 5)
        .text(yAccessor)
        .attr("fill","darkgrey")
        .attr("font-size","16px")
        .attr("text-anchor","middle");

    const xLabel = bounds.append("text")
        .attr("x",dimensions.boundedWidth - width + 150 )
        .attr("y",dimensions.boundedHeight + 35)
        .text("Temperature")
        .attr("fill","black")
        .attr("font-size","18px")
        .attr("text-anchor","middle");

    const yLabel = bounds.append("text")
        .attr("x",0-dimensions.boundedHeight+30)
        .attr("y",20)
        .text("Count")
        .attr("fill","black")
        .attr("font-size","18px")
        .attr("text-anchor","middle")
        .attr("transform", "rotate(-90)");

    changeData(id);
}

function changeData(id){
    if(id == null){
        return 0;
    }
    const btnAct = document.getElementsByClassName("active");
    btnAct[0].classList.remove("active");
    const clickedButton = document.getElementById(id)
    clickedButton.classList.add("active");
}

drawBar("temperatureLow", null);