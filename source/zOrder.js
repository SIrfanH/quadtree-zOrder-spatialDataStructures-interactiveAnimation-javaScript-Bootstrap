window.onload = function morton() {

    let canvasWidth = 600;
    let canvasHeight = 600;
    // Setting SVG element Height and Width
    let svg = d3.select("svg").attr("width", canvasWidth).attr("height", canvasWidth);
    // Array used for storing z-order indexes and bounds
    let zArray = [];
    // used for order of the curve
    let curveOrder = 2;

    // Function for generating Morton Curve for specified height width and order
    function createIndexes(centerX, centerY, width, height, Order, code = '') {
        let x = centerX;
        let y = centerY;
        let w = width;
        let h = height;

        if (Order != 0) {
            createIndexes(x - w / 2, y - h / 2, w / 2, h / 2, Order - 1, code + '00');
            createIndexes(x + w / 2, y - h / 2, w / 2, h / 2, Order - 1, code + '01');
            createIndexes(x - w / 2, y + h / 2, w / 2, h / 2, Order - 1, code + '10');
            createIndexes(x + w / 2, y + h / 2, w / 2, h / 2, Order - 1, code + '11');
            return;
        }
        zArray.push({ mortonCode: code, x: x, y: y, width: width, height: height });
    }

    // Creating the Morton bounds
    createIndexes(canvasWidth / 2, canvasHeight / 2, canvasWidth / 2, canvasHeight / 2, curveOrder);

    // Initializer function
    function init() {

        // Adding 3 path to svg element, first one for drawing skeleton, second for animating and third for searching
        let canvas = svg.append('g');
        canvas.append('path').attr('class', 'skeleton');
        canvas.append('path');
        canvas.append('path').attr('class', 'search');

        // Event listener for curve order slider
        let orderSlider = document.getElementById('mortonCurveOrderSlider');
        orderSlider.addEventListener('change', function (event) {
            // Get the new order
            curveOrder = orderSlider.value;
            // Set old array to null
            zArray = [];
            // Create the new curve indexes for the given new order
            createIndexes(canvasWidth / 2, canvasHeight / 2, canvasWidth / 2, canvasHeight / 2, curveOrder);
            // Set the older window search selection to zero
            svg.select("path.search")
                .attr("d", 'M0 0');
            svg.select('g').attr('class','brush').call(brush.move, null);
            // Draw the new curve
            drawCurve();
        })
        // Tooltip used for showing mouse moved point coordinates
        let tooltip = d3.select('#val-tooltip');
        svg.on('mouseover', function (event) { tooltip.style("display", "inline"); })
            .on('mouseleave', function (event) { tooltip.style("display", "none"); })
            .on('mousemove', function (event) {
                tooltip.text(getMortonValue(event.offsetX, event.offsetY))
                    .style("left", event.offsetX + "px")
                    .style("top", event.offsetY + "px")
                    .style('tooltip_position', "top")
            });
        drawCurve();
    }

    // Function for getting morton value from array elements. Used for showing mouse move coordinates for tooltip
    function getMortonValue(x, y) {
        for (let i = 0; i < zArray.length; i++) {
            if (containsPoint(zArray[i], x, y)) {
                mortonCode = zArray[i].mortonCode;
                return "Morton Code: "+mortonCode + ", Cell Number: " + parseInt(mortonCode, 2);
            }
        }
    }

    // function to check if a point is inside a bound
    function containsPoint(boundary, x, y) {
        if (x < boundary.x + boundary.width && x >= boundary.x - boundary.width
            && y < boundary.y + boundary.height && y >= boundary.y - boundary.height) {
            return 1;
        }
        return 0;
    }

    // http://stackoverflow.com/questions/4909263/how-to-efficiently-de-interleave-bits-inverse-morton
    deinterleave = function (x) {
        x = x & 0x55555555;
        x = (x | (x >> 1)) & 0x33333333;
        x = (x | (x >> 2)) & 0x0F0F0F0F;
        x = (x | (x >> 4)) & 0x00FF00FF;
        x = (x | (x >> 8)) & 0x0000FFFF;
        return x;
    }

    // http://graphics.stanford.edu/~seander/bithacks.html#InterleaveBMN
    interleave = function (x, y) {

        var B = [0x55555555, 0x33333333, 0x0F0F0F0F, 0x00FF00FF];
        var S = [1, 2, 4, 8];

        x = (x | (x << S[3])) & B[3];
        x = (x | (x << S[2])) & B[2];
        x = (x | (x << S[1])) & B[1];
        x = (x | (x << S[0])) & B[0];

        y = (y | (y << S[3])) & B[3];
        y = (y | (y << S[2])) & B[2];
        y = (y | (y << S[1])) & B[1];
        y = (y | (y << S[0])) & B[0];

        z = x | (y << 1);
        return z;
    }

    let lineFunction = d3.line()
        .x(function (d) { return d.x; })
        .y(function (d) { return d.y; })
        .curve(d3.curveLinear);


    function drawCurve() {

        //Draw the skeleton of the curve first
        svg.select("path.skeleton").attr("d", lineFunction(zArray));

        //Animate the Drawing
        path= svg.select('path:not(.skeleton):not(.search)');
        path.attr("d", lineFunction(zArray));
        path.transition().duration(curveOrder * 1000).ease(d3.easePoly)
            .attrTween('stroke-dasharray', tweenDash);

        function tweenDash() {
            var l = path.node().getTotalLength(),
                i = d3.interpolateString("0," + l, l + "," + l);
            return function (t) { return i(t); };
        }
    }
    // Add brush to the svg element
    let brush = d3.brush().on('end', brushed).extent([[0,0],[canvasWidth,canvasHeight]]);
    svg.append('g').attr('class','brush').call(brush);

    // Function for events of brush element
    function brushed({selection}) {
        if (selection) {
            let extent = selection;
            let array = mortonFromPoint(extent[0][0], extent[0][1],extent[1][0], extent[1][1]);
            if(array){
                svg.select("path.search")
                .attr("d", lineFunction(array));
            }
        }
      }

    // Function for getting morton points intersecting with the brush selection
    function mortonFromPoint(x1,y1, x2,y2) {
        let array = []
        let i = 0,j=0;
        while(i<zArray.length && !containsPoint(zArray[i],x1,y1)){
            i++;
        }

        while(j<zArray.length && !containsPoint(zArray[j],x2,y2)){
            j++;
        }

        if(i<zArray.length && j<zArray.length){
            for(let k=i; k<=j; k++){
                array.push(zArray[k]);
            }
            return array;
        }else{
            return -1;
        }
    }
    init();
}