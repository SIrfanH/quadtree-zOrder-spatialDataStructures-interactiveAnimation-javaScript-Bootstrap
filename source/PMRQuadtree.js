// This Program is Written using Object Oriented Programming Paradigm

class Point {
    // A point is Defined and represented by Ordered Pair (x, y)
    constructor(x,y){
        this.x = x;
        this.y = y;
    }

    // Function to check if two point are similar
    checkSimilarity(point){
        // If both X and Y of two points are similar then the points are said to be similar points
        if(this.x == point.x && this.y == point.y){
            return 1;
        }else{
            return 0;
        }
    }
}

class qEdge {
    // Line segment is defined and represented by Ordered Pairs (x1, y1) and (x2, y2) as two endpoints of the Line
    constructor(x1, y1, x2, y2) {
        this.point1 = new Point(x1, y1);
        this.point2 = new Point(x2, y2);

        // slope of the line, value of m in equation y = mx + b
        this.slope = (this.point2.y - this.point1.y)/(this.point2.x-this.point1.x);

        // y-intecept of the line, value of b in equation y = mx + b
        this.interceptY = this.point1.y - this.slope * this.point1.x;
        this.color = 'rgba(0,0,0,1)';

        // Used inside Peiority Queue for determining Nearest Neighbor; it is calculated using distanceFromPoint function
        this.priority = null;
    }

    // Function to calcultate slop of a line
    calculateSlope() {
        this.slope = (this.point2.y - this.point1.y)/(this.point2.x-this.point1.x);
    }

    // Function to calculate Y-Intercept of a line
    calculateYIntercept() {
        this.interceptY = this.point1.y - this.slope * this.point1.x;
    }
    // Function to check if two lines are similer
    checkSimilarity(line) {
        // if both points of two lines are similar then they are said to be two similar lines
        if (this.point1.x == line.x1 && this.point2.x == line.x2 && this.point1.y == line.y1 && this.point2.y == line.y2) {
            return true;
        }
        return false;
    }

    // Function for calculating distance between this line and a given point. Also used for distance between Line and Circle
    distanceFromPoint(point){
        // Check Projection of two vectors from the internet

        // Lets say we have a point (x0, y0) and a line segment with endpoints (x1, y1) and (x2,y2) we need to make two vector.
        // First vector is our line segment which is [ (x2-x1) , (y2-y1) ] lets call this vector Z.
        // Lets make another vector from point (x0, y0) and any of the point from our line segment. lets take (x1, y1).
        // now we make vector K which is [ (x0 - x1), (y0-y1)]
        // Now if vector K is projected onto vector Z then we get another vector. Lets call this new vector J.
        // Vector J has an starting point which is (x1,y1) and a second point which i call (projX, projY)
        // now if we calculate distance from our point to (projX, projY) then that is the distance between our point
        // and our line segment

        // Creating a vector from point to one end of the line segment. The created vector is K = ( K1, K2 )
        let K1 = point.x - this.point1.x;
        let K2 = point.y - this.point1.y;

        // Creating vector Z from One end to another end of the Line segment where Z = ( Z1 , Z2 )
        let Z1 = this.point2.x - this.point1.x;
        let Z2 = this.point2.y - this.point1.y;

        // Projection of vector K onto vector Z is = projectionMultiple * vector Z
        // Where projectionMultiple = ( dotproduct(K and Z) / (length(Z))^2 )
        let lineLengthSqr = Z1*Z1 + Z2*Z2;
        let dotProduct = K1*Z1 + K2*Z2;
        let projectionMultiple = -1;

        // if line length is not zero
        if(lineLengthSqr != 0){
            // projectionMultiple = ( dotproduct(K and Z) / (length(Z))^2 )
            projectionMultiple = dotProduct/lineLengthSqr;
        }
        
        // Projection Vector of Vector K onto Z is Proj = ( projX, projY)
        let projX, projY;   

        // If Projection Multiple is less than 0 then point is over and if greater than 1 then point is under the line segment
        if(projectionMultiple < 0){
            // If point is over the line segment then it means x1 and y1 is the nearest end of the line segment to the point 
            projX = this.point1.x;
            projY = this.point1.y;
        }else if(projectionMultiple > 1){
            // If point is over the line segment then it means x2 and y2 is the nearest end of the line segment to the point
            projX = this.point2.x;
            projY = this.point2.y;
        }else{
            // If Projection multiple is 0 < Projection Multiple < 1 then point is perpendicular to the line segment
            projX = this.point1.x + projectionMultiple * Z1;
            projY = this.point1.y + projectionMultiple * Z2;
        }
        
        // Calculating distance from nearest line segment to the point
        let dx = point.x - projX;
        let dy = point.y - projY;

        return Math.sqrt(dx*dx + dy*dy);
    }

    distanceFromLine(line){
        // Distance between two line segment AB and CD is the shortest of the distances of point A to Segment CD
        // point B to Segment CD , point C to segment AB and point D to segment AB

        let arr = [];
        // Distance from segment 1 to point1 of the segment 2
        arr[0] = this.distanceFromPoint(line.point1);
        // Distance from segment 1 to point2 of the segment 2
        arr[1] = this.distanceFromPoint(line.point2);
        // Distance from segment 2 to point1 of the segment 1
        arr[2] = line.distanceFromPoint(this.point1);
        // Distance from segment 2 to point2 of the segment 1
        arr[3] = line.distanceFromPoint(this.point2);

        let min = arr[0];
        // Find the shortest of the distances
        for(let k = 1; k<arr.length; k++){
            if(min>arr[k]){
                min = arr[k];
            }
        }

        return min;
    }

    lineIntersection(line){

        // Lets assume a point X(x0, y0) and a line segment with endpoints A(x1,y1) and B(x2,y2)
        // Orientation of line segment AB is the rotation angle that AB takes in order to reach point X
        // in order to calcualte if two line segment intersect we have to check orientation of one of the line segments
        // to one point of the second line segment and then to the other point of the second line segment
        // if one is clockwise orientation and the other is anticlockwise orientation then they intersect

        // Orientation of line segment1 to point1 of line segment2
        let o1 = getOrientation(this.point1, this.point2, line.point1);
        // Orientation of line segment1 to point 2 of line segment2
        let o2 = getOrientation(this.point1, this.point2, line.point2);
        // Orientation of line segment2 to point1 of line segment1
        let o3 = getOrientation(line.point1, line.point2, this.point1);
        // Orientation of line segment2 to point2 of line segment1
        let o4 = getOrientation(line.point1, line.point2, this.point2);

        // If both the orientations are different then they intersect
        if (o1 != o2 && o3 != o4)
            return true;

        // Special Cases
        // Point1 of the segment2 is on segment1 . They are colinear which means they intersect
        if (o1 == 0 && onSegment(this.point1, line.point1, this.point2)) return true;

        // Point2 of segment2 is on segment1. They intersect
        if (o2 == 0 && onSegment(this.point1, line.point2, this.point2)) return true;

        // Point1 of segment1 is on segment2. They intersect
        if (o3 == 0 && onSegment(line.point1, this.point1, line.point2)) return true;

        // Point2 of segment1 is on segment2. They intersect
        if (o4 == 0 && onSegment(line.point1, this.point2, line.point2)) return true;

        return false; // Doesn't fall in any of the above cases
    }

    haveSimilarPoints(line){
        if(this.point1.checkSimilarity(line.point1) || this.point1.checkSimilarity(line.point2) 
        || this.point2.checkSimilarity(line.point1) || this.point2.checkSimilarity(line.point2)){
            return true;
        }
        return false;
    }
}

// This function checks if a point is lying on the line segment
function onSegment(p, q, r){
    if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
        q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y)){
            return true; 
        }

    return false;
}

function getOrientation(p, q, r){
    // Orientation of a line segment to a point is the side at which the line segment should rotate in order to reach the point
    let val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    if (val > 0) {
        // Clockwise orientation
        return 1
    } else if (val < 0) {
        // Counterclockwise orientation
        return 2
    } else {
        // Colinear orientation
        return 0
    }
}

// Priority Queueu is used for calculating K-Nearest Neighbor Search using Best First Method
class PriorityQueue {
    constructor(){
        this.list = [];
    }

    heapify(index){
        let size = this.list.length;
        let largest = index;
        let left = 2*index+1;
        let right = 2*index+2;
        if( left < size && this.list[left].priority < this.list[largest].priority){
            largest = left;
        }
        if(right < size && this.list[right].priority < this.list[largest].priority){
            largest = right;
        }
        if(largest != index){
            let tmp = this.list[largest];
            this.list[largest] = this.list[index];
            this.list[index] = tmp;
            this.heapify(largest);
        }
    }

    enqueue(node, priority){
        let size = this.list.length;
        node.priority = priority;
        if(size == 0){
            this.list.push(node);
        }else{
            this.list.push(node);
            size++;
            for(let index = Math.floor((size/2) - 1); index>=0; index--){
                this.heapify(index);
            }
        }
    }

    dequeue(){
        let node;
        let size = this.list.length;
        if (size > 1) {
            node = this.list[0];
            this.list[0] = this.list.pop();
            size--;
            for (let index = Math.floor((size / 2) - 1); index >= 0; index--) {
                this.heapify(index);
            }
        }else if(size == 1){
            node = this.list.pop();
        }else{
            return 0;
        }
        return node;
    }
}

// Circle is used for Nearest Neighbor Search
class Circle{
    // It is represented by ordered pair (x,y) as its Center and a Radius of r
    constructor(x,y,r){
        this.x = x;
        this.y = y;
        this.r = r;
    }

    draw(color){
        context.save();
        context.fillStyle = 'rgba(128,128,128,0.5)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'white';
        context.strokeStyle = color || 'red';
        context.beginPath();
        context.arc(this.x, this.y, this.r, 0, 2 * Math.PI, true);
        context.fill();
        context.stroke();
        drawPoint(this.x, this.y, 'red');
        context.restore();
    }
}

// This Class represents an Axis Aligned Bounding Box (AABB) for the quadtree Nodes
class Boundry {
    constructor(centerX, centerY, height, width, level = 0, Xcoordinate = 0, Ycoordinate = 0) {
        this.centerX = centerX;                 // x-coordinate of the center of boundry
        this.centerY = centerY;                 // y-coordinate of the center of boundry
        this.height = height;                   // height of the boundry from its Center
        this.width = width;                     // width of the boundry from its Center
        this.level = level;                     // boundry level in tree
        this.graphXcoordinate = Xcoordinate;    // x-coordinate of the boundry in second canvas
        this.graphYcoordinate = Ycoordinate;    // y-coordinate of the boundry in second canvas 
        this.graphWidth = 0;                    // width of the boundry in second canvas
        this.graphHeight = 0;                   // height of the boundry in second cavnas
        this.color = 'rgba(0,0,0,0)';
    }

    // Function for determining if a line passes through a rectangle or boundry
    containsLine(line) {
        // This function returs 1 if point1 of the line is inside the rectangle
        // returns 2 if point2 of the line is inside the rectangle
        // returns 3 if both point1 and point2 of the lines is inside the rectangele
        // returns 4 if no point is inside the rectangle but the line passes inside the rectangle
        
        
        // If both points of the line segment is inside the rectangle
        if (this.containsPoint(line.point1) && this.containsPoint(line.point2)) {
            return 3;
        } else if (this.containsPoint(line.point1)) {
            // If points1 is inside the ractangle
            return 1;
        } else if (this.containsPoint(line.point2)) {
            // If point2 is inside the rectangle
            return 2;
        } else {
            // if both y coordinate of the line is greater than the boundry then it means line is under the boundry
            if (line.point1.y > this.centerY + this.height && line.point2.y > this.centerY + this.height) {
                return 0;
            }
            // if both y coordinate of the line is less than the boundry then it means line is over the boundry
            if (line.point1.y < this.centerY - this.height && line.point2.y < this.centerY - this.height) {
                return 0;
            }
            // if both x coordinate of the line is greater than boundry then it means line is in the right side of the boundry
            if (line.point1.x > this.centerX + this.width && line.point2.x > this.centerX + this.width) {
                return 0;
            }
            // if both x coordinate of the line is less than boundry then it means line is in the left side of the boundry
            if (line.point1.x < this.centerX - this.width && line.point2.x < this.centerX - this.width) {
                return 0;
            }

            // calculating intersection of a line and a rectangle  Y-Slope*X-YIntecept = 0
            // upper left is lower left and upper right is lower right in real coordinate system
            let uppLeftDif = (this.centerY - this.height) - line.slope * (this.centerX - this.width) - line.interceptY;
            let uppRightDif = (this.centerY - this.height) - line.slope * (this.centerX + this.width) - line.interceptY;

            // lower left is upper left and lower right is upper right in real coordinate system
            let lowLeftDif = (this.centerY + this.height) - line.slope * (this.centerX - this.width) - line.interceptY;
            let lowRightDif = (this.centerY + this.height) - line.slope * (this.centerX + this.width) - line.interceptY;

            // calculating intersection of a line and a rectangle  Y-Slope*X-YIntecept = 0
            if (line.slope > 0) {
                // if line passes through upper left and upper right section of the boundary
                if (uppLeftDif >= 0 && uppRightDif <= 0) {
                    return 4; // line passes through upper left and upper right section of the boundary
                } else if (lowLeftDif >= 0 && lowRightDif <= 0) {
                    return 4; // line passes through lower left and lower right section of the boundary
                } else if (uppLeftDif >= 0 && lowLeftDif <= 0) {
                    return 4; // line passes through upper left and lower right section of the boundary
                } else if (uppRightDif <= 0 && lowRightDif >= 0) {
                    return 4; // line passes through upper right and lower right section of the boundary
                } else {
                    return 0; // line does not pass through any section of the boundary
                }
            } else {
                if (uppLeftDif <= 0 && uppRightDif >= 0) {
                    return 4; // line passes through upper left and upper right section of the boundary
                } else if (lowLeftDif <= 0 && lowRightDif >= 0) {
                    return 4; // line passes through lower left and lower right section of the boundary
                } else if (uppLeftDif <= 0 && lowLeftDif >= 0) {
                    return 4; // line passes through upper left and lower right section of the boundary
                } else if (uppRightDif >= 0 && lowRightDif <= 0) {
                    return 4; // line passes through upper right and lower right section of the boundary
                } else {
                    return 0; // line does not pass through any section of the boundary
                }
            }
        }
    }

    // Function for determining if a point is inside a boundry
    containsPoint(point) { // function to check if a point is inside a rectangle

        let boundryX1 = this.centerX - this.width;
        let boundryX2 = this.centerX + this.width;
        let boundryY1 = this.centerY - this.height;
        let boundryY2 = this.centerY + this.height;

        if (point.x >= boundryX1 && point.x <= boundryX2 && point.y >= boundryY1 && point.y <= boundryY2) {
            // If point is inside the boundry
            return 1;
        } else {
            return 0;
        }
    }

    // Function for determining if two rectangle overlap
    rectangleOverlap(rectangleB) {
        // X and Y values of the first rectangle
        let rectangleAX1 = this.centerX - this.width;
        let rectangleAX2 = this.centerX + this.width;
        let rectangleAY1 = this.centerY - this.height;
        let rectangleAY2 = this.centerY + this.height;

        // X and Y values of the second rectangle
        let rectangleBX1 = rectangleB.centerX - rectangleB.width;
        let rectangleBX2 = rectangleB.centerX + rectangleB.width;
        let rectangleBY1 = rectangleB.centerY - rectangleB.height;
        let rectangleBY2 = rectangleB.centerY + rectangleB.height;

        if (rectangleAX1 < rectangleBX2 && rectangleAX2 > rectangleBX1 && rectangleAY1 < rectangleBY2 && rectangleAY2 > rectangleBY1) {
            return 1;
        } else {
            return 0;
        }
    }

    // Function for determining if a Circle overlaps with a rectangle or the boundary
    circleOverlap(knnCircle){

        let X1 = this.centerX - this.width;
        let X2 = this.centerX + this.width;
        let Y1 = this.centerY - this.height;
        let Y2 = this.centerY + this.height;

        // Find the nearest point on the rectangle to the center of the circle
        let Xn = Math.max(X1, Math.min(knnCircle.x, X2));
        let Yn = Math.max(Y1, Math.min(knnCircle.y, Y2));

        // Find the distance between the nearest point and the center of the circle
        // Distance between 2 points, (x1, y1) & (x2, y2) in 2D Space
        let Dx = Xn - knnCircle.x;
        let Dy = Yn - knnCircle.y;
        return Math.sqrt(Dx * Dx + Dy * Dy) <= knnCircle.r;
    }

    // Function for evaluating distance between a rectangle and a point
    pointDistance(point){
        let dx = Math.max((this.centerX-this.width) - point.x, 0 , point.x - (this.centerX+this.width));
        let dy = Math.max((this.centerY-this.height) - point.y, 0, point.y - (this.centerY+this.height));
        return Math.sqrt(dx*dx + dy*dy);
    }
}

class Quadtree {
    // Create a quadtree of specified height
    constructor(boundry, capacity) {
        //this.height = height;
        this.boundry = boundry;
        this.priority = null;
        this.vertex = null;
        this.points = [];
        this.qEdges = [];
        this.array = [];
        this.capacity = capacity;
        this.nodes = [];
    }

    // function for dividing a quadtree node to 4 children
    subdivide() {

        // saving values into another variable beforehand for the sake of clarity
        let x = this.boundry.centerX;
        let y = this.boundry.centerY;
        let w = this.boundry.width;
        let h = this.boundry.height;

        let level = this.boundry.level + 1;

        // For determining coordinate for the new nodes in the tree canvas
        const dx = 300 / Math.pow(2, this.boundry.level + 1);

        // Create new Boundry objects for every node
        let nW = new Boundry(x - w / 2, y - h / 2, w / 2, h / 2,
            this.boundry.level + 1, this.boundry.Xcoordinate - dx, this.boundry.Ycoordinate + 50);
        let nE = new Boundry(x + w / 2, y - h / 2, w / 2, h / 2,
            this.boundry.level + 1, this.boundry.Xcoordinate + dx, this.boundry.Ycoordinate + 50);
        let sW = new Boundry(x - w / 2, y + h / 2, w / 2, h / 2,
            this.boundry.level + 1, this.boundry.Xcoordinate - dx / 2, this.boundry.Ycoordinate + 50);
        let sE = new Boundry(x + w / 2, y + h / 2, w / 2, h / 2,
            this.boundry.level + 1, this.boundry.Xcoordinate + dx / 2, this.boundry.Ycoordinate + 50);

        // Create every node
        this.nodes[0] = new Quadtree(nW, capacity);
        this.nodes[1] = new Quadtree(nE, capacity);
        this.nodes[2] = new Quadtree(sW, capacity);
        this.nodes[3] = new Quadtree(sE, capacity);

        //Transfering all the data from this node to the new children
        // for (let i = 0; i < this.qEdges.length; i++) {
        //     this.insertLine(this.qEdges[i]);
        // }

        for (let i = 0; i < this.qEdges.length; i++) {
            let indexes = this.getLineIndex(this.qEdges[i]);
            for (let j = 0; j < indexes.length; j++) {
            
                this.nodes[indexes[j]].qEdges.push(this.qEdges[i]);
                this.nodes[indexes[j]].boundry.color = 'rgba(0,0,0,0.5)';
            }
        }

        // Emptying this node
        this.points = [];
        this.qEdges = [];
        console.log(this);
    }

    // Function for determining quadrants that the Line being inserted belongs to. Used inside insertLine function
    getLineIndex(line) {
        let indexes = [];
        console.log("getindex");
        let northWContains = this.nodes[0].boundry.containsLine(line);
        let northEContains = this.nodes[1].boundry.containsLine(line);
        let southWContains = this.nodes[2].boundry.containsLine(line);
        let southEContains = this.nodes[3].boundry.containsLine(line);

        // if northWest quadrant contains the line
        if (northWContains) {
            console.log("northWContains "+ northWContains);
            indexes.push(0);
        }

        // if northEast quadtrant contains the line
        if (northEContains) {
            console.log("northEContains "+northEContains);
            indexes.push(1);
        }

        // if southWest quadrant contains the line
        if (southWContains) {
            console.log("southWContains "+southWContains);
            indexes.push(2);
        }

        // if southEast quadtrant contains the line
        if (southEContains) {
            console.log("southEContains "+southEContains);
            indexes.push(3);
        }

        return indexes;
    }

    // Function for determining the quadrants that the Search Window Overlaps with. Used inside WindowSearch Function
    getWindowIndex(window) {
        let indexes = [];

        let northWOverlaps = this.nodes[0].boundry.rectangleOverlap(window);
        let northEOverlaps = this.nodes[1].boundry.rectangleOverlap(window);
        let southWOverlaps = this.nodes[2].boundry.rectangleOverlap(window);
        let southEOverlaps = this.nodes[3].boundry.rectangleOverlap(window);

        // if northWest quadrant overlaps with the window
        if (northWOverlaps) {
            indexes.push(0);
        }

        // if northEast quadrant overlaps with the window
        if (northEOverlaps) {
            indexes.push(1);
        }

        // if southWest quadrant overlaps with the window
        if (southWOverlaps) {
            indexes.push(2);
        }

        // if southEast quadrant overlaps with the window
        if (southEOverlaps) {
            indexes.push(3);
        }

        return indexes;
    }

    // Function for adding new line to the quadtree
    insertLine(line) {
        let indexes;

        // if(this.array.includes(line)){
        //     return;
        // }

        // If this is the root then put the qEdges into the array for easy access
        if (this.boundry.level == 0 && !this.array.includes(line)) {
            this.array.push(line);
        }else if(this.array.includes(line)){
            return;
        }

        // If this node has children then call insert for the children
        if (this.nodes.length) {
            // Get the quadrants(nodes) that this line belongs to
            indexes = this.getLineIndex(line);

            // Call insert for the child nodes
            for (let i = 0; i < indexes.length; i++) {
                this.nodes[indexes[i]].insertLine(line);
            }
            return;
        }

        if(this.qEdges.length <this.capacity){
            this.qEdges.push(line);
            this.boundry.color = 'rgba(0,0,0,0.5)';
        }else{
            this.subdivide();

            indexes = this.getLineIndex(line);

            for(let i=0; i<indexes.length; i++){
                this.nodes[indexes[i]].qEdges.push(line);
                this.nodes[indexes[i]].boundry.color = 'rgba(0,0,0,0.5)';
            }
        }
    }

    // Function for drawing Quadtree
    draw() {
        if (this.boundry.level == 0) {
            // first draw every line which is inside the quadtree
            for (let i = 0; i < this.array.length; i++) {
                drawLine(this.array[i], this.array[i].color);
            }
        }

        // if this node does not have children which means it is a leaf node then draw the node
        if (this.nodes.length == 0) {
            context.save();
            context.lineWidth = "0.5";
            context.strokeStyle = 'rgba(0,0,0,0.5)';
            context.beginPath();
            context.rect(this.boundry.centerX - this.boundry.width, this.boundry.centerY - this.boundry.height, this.boundry.height * 2, this.boundry.width * 2);
            if(this.qEdges.length != 0 && this.boundry.color != 'rgba(0,0,0,0.5)') {
                // if this node has lines then draw its color
                context.fillStyle = this.boundry.color;
                context.fillRect(this.boundry.centerX - this.boundry.width, this.boundry.centerY - this.boundry.height, this.boundry.height * 2, this.boundry.width * 2);
            }
            context.stroke();
            context.closePath();
            context.restore();

            // if this node has lines then push the line inside the lines array
            for (let i = 0; i < this.qEdges.length; i++) {
                if (!lines.includes(this.qEdges[i])) {
                    lines.push(this.qEdges[i]);
                }
            }
        } else {
            // don't draw until leaf node is reached
            this.nodes[0].draw();
            this.nodes[1].draw();
            this.nodes[2].draw();
            this.nodes[3].draw();
        }
    }

    // Function for Window Search on quadtree
    windowSearch(window) {

        let indexes;

        // If this is the root
        if (this.boundry.level == 0) {
            // Push the node 
            indexArray.push(this);
        }

        // If this node has children
        if (this.nodes.length) {
            indexes = this.getWindowIndex(window);

            for (let i = 0; i < indexes.length; i++) {
                indexArray.push(this.nodes[indexes[i]]);
                this.nodes[indexes[i]].windowSearch(window);
            }
            return;
        }

        // if this node has qEdges
        if(this.qEdges.length != 0){
            this.boundry.color = 'rgba(240, 255, 0, 0.3)'; // Yellow
        }

        // Color the lines that are inside the search window
        for (let i = 0; i < this.qEdges.length; i++) {
            if (window.containsLine(this.qEdges[i])) {
                // Coloring Lines
               this.qEdges[i].color = 'rgba(225,0,0,0.5)' // Orange
            }
        }
        return;
    }

    // Function for KNN Search
    nearestNeighborSearch(point, k) {
        let node;   // for storing the nearest node from the queue
        let nearestNodesQueue = new PriorityQueue();
        let nearestLinesQueue = new PriorityQueue();
        nearestNodesQueue.enqueue(this, 0);

        // While the queue is not empty 
        while(nearestNodesQueue.list.length != 0){
        
            node = nearestNodesQueue.dequeue();
            // if this node is a leaf node
            if(node.nodes.length == 0){

                if(node.qEdges.length != 0){
                    // If array has lines then push the lines into the nearestLines queue
                    for(let j = 0; j<node.qEdges.length; j++){
                        if(!nearestLinesQueue.list.includes(node.qEdges[j])){
                            nearestLinesQueue.enqueue(node.qEdges[j], node.qEdges[j].distanceFromPoint(point));
                        }
                    }
                }

                indexArray.push(node);

            }else{
                // insert the children of this node to the priority queue
                for(let i=0; i<node.nodes.length; i++){
                    nearestNodesQueue.enqueue(node.nodes[i], node.nodes[i].boundry.pointDistance(point));
                }
            }
        }
        
        // Dequeue the nearest lines and insert it into the nearestLines array for animation purposes
        for(let j = 0; j<k; j++){
            nearestLines.push(nearestLinesQueue.dequeue());
        }

        // set the radius of the circle to the distance of the farthest line
        knnCircle.r = nearestLines[nearestLines.length-1].priority;
        for(let j = 0; j<indexArray.length; j++){
            // Color the nodes that overlap with the circle
            if(indexArray[j].boundry.circleOverlap(knnCircle) && indexArray[j].qEdges.length != 0){
                indexArray[j].boundry.color = 'rgba(240, 255, 0, 0.3)' // Yellow
            }
        }
        
        // Color the Lines that overlap with the circle
        for(let j = 0; j<nearestLines.length; j++){
            nearestLines[j].color = 'rgba(225,0,0,0.5)';
        }

    }

    // Function for clearing the quadtree
    reset() {
        this.array = [];
        this.nodes = [];
        this.qEdges = [];
        this.points = [];
        this.vertex = null;
        this.boundry.color = "rgba(0,0,0,0)"; // No color
    }

    // Function for determining position of every node for drawing the tree version of the quadtree in the second canvas
    determineTreeCoordinate(x1 = 0, x2 = treeCanvas.width, y = 20, t = 0) {
        let m = x2 - x1;
        //let l = 3 * (11 - 2 * t);
        let l = 16 - t;

        this.boundry.graphXcoordinate = x1 + (m / 2) - (l / 2)
        this.boundry.graphYcoordinate = y;
        this.boundry.graphWidth = l;
        this.boundry.graphHeight = l;

        // If this is not a leaf node
        if (this.nodes.length != 0) {

            if (t > 5) {
                t = t - 5;
            }

            this.nodes[0].determineTreeCoordinate(x1, x1 + (m / 4), y + 75, t + 2);
            this.nodes[1].determineTreeCoordinate(x1 + (m / 4), x1 + (m / 2), y + 75, t + 2);
            this.nodes[2].determineTreeCoordinate(x1 + (m / 2), x1 + 3 * (m / 4), y + 75, t + 2);
            this.nodes[3].determineTreeCoordinate(x1 + 3 * (m / 4), x2, y + 75, t + 2);
            return;

        } else {
            return;
        }
    }

    // Function for drawing the tree version of the quadtree
    drawTree() {
        // Draw this node
        ctxT.strokeStyle = 'rgba(0,0,0,0.7)';
        ctxT.strokeRect(this.boundry.graphXcoordinate, this.boundry.graphYcoordinate, this.boundry.graphWidth, this.boundry.graphHeight)

        if (this.qEdges.length != 0 && this.boundry.level != 0) {
            // color the node if this node has elements
            ctxT.save();
            ctxT.fillStyle = this.boundry.color;
            ctxT.fillRect(this.boundry.graphXcoordinate, this.boundry.graphYcoordinate, this.boundry.graphWidth, this.boundry.graphHeight);
            ctxT.restore();
        }
        
        // If this node has Children
        if (this.nodes.length != 0) {
            
            // Draw every children and draw a line from parent to child node
            ctxT.save();
            this.nodes[2].drawTree();
            ctxT.beginPath();
            ctxT.moveTo(this.boundry.graphXcoordinate + (this.boundry.graphWidth / 2), this.boundry.graphYcoordinate + this.boundry.graphHeight);
            ctxT.lineTo(this.nodes[2].boundry.graphXcoordinate + (this.nodes[2].boundry.graphWidth / 2), this.nodes[2].boundry.graphYcoordinate);
            ctxT.stroke();
            ctxT.closePath();

            this.nodes[0].drawTree();
            ctxT.beginPath();
            ctxT.moveTo(this.boundry.graphXcoordinate + (this.boundry.graphWidth / 2), this.boundry.graphYcoordinate + this.boundry.graphHeight);
            ctxT.lineTo(this.nodes[0].boundry.graphXcoordinate + (this.nodes[0].boundry.graphWidth / 2), this.nodes[0].boundry.graphYcoordinate);
            ctxT.stroke();
            ctxT.closePath();

            this.nodes[1].drawTree();
            ctxT.beginPath();
            ctxT.moveTo(this.boundry.graphXcoordinate + (this.boundry.graphWidth / 2), this.boundry.graphYcoordinate + this.boundry.graphHeight);
            ctxT.lineTo(this.nodes[1].boundry.graphXcoordinate + (this.nodes[1].boundry.graphWidth / 2), this.nodes[1].boundry.graphYcoordinate);
            ctxT.stroke();
            ctxT.closePath();

            this.nodes[3].drawTree();
            ctxT.beginPath();
            ctxT.moveTo(this.boundry.graphXcoordinate + (this.boundry.graphWidth / 2), this.boundry.graphYcoordinate + this.boundry.graphHeight);
            ctxT.lineTo(this.nodes[3].boundry.graphXcoordinate + (this.nodes[3].boundry.graphWidth / 2), this.nodes[3].boundry.graphYcoordinate);
            ctxT.stroke();
            ctxT.closePath();
            ctxT.restore();
        }

    }
}

// First Canvas and its context
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');

// Second Canvas and its context
let treeCanvas = document.getElementById('canvas2');
let ctxT = canvas2.getContext('2d');

// For saving state of the mouse, draw if mouse is down, don't draw if mouse is up
let isDown = false;

// For saving the state of window search on or off
let isWindowSearchOn = false;

// x and y value for animating line and rectangle drawing
let x1, y1, x2, y2;
let line;

// For storing search window
let searchWindow;
// For Order of the tree
let capacity = 2;
// Creating the first Quadtree
let boundry = new Boundry(canvas.width / 2, canvas.height / 2, canvas.height / 2, canvas.width / 2);
let quadTree = new Quadtree(boundry, capacity);

let lineInsertMode = true;
let animationMode = false;
let isNearestNeighborSearchOn = false;
let knnCircle = null;

// For storing the search sequence that occured inside window search of quadtree and animating its colors
let indexArray = [];
// For adjusting animation speed
let animationSpeed = 100;
// For storing inserted lines
let lines = [];
// For storing the nearest Lines to the point. Used in nearestNeighborSearchAnimationMode()
let nearestLines = [];
// For storing number of nearest neighbor needed
let k = 0;

let readyLines = [];

function randomeLines(){
    if (readyLines.length == 0) {
        readyLines.push(new qEdge(193, 240, 310, 59));
        readyLines.push(new qEdge(310, 59, 370, 190));
        readyLines.push(new qEdge(430, 450, 185, 380));
        readyLines.push(new qEdge(185, 380, 33, 310));
        readyLines.push(new qEdge(370, 190, 468, 217));
        readyLines.push(new qEdge(468, 217, 430, 450));
        readyLines.push(new qEdge(33, 310, 60, 185));
        readyLines.push(new qEdge(60, 185, 193, 240));
        readyLines.push(new qEdge(185, 380, 370, 190));
    }

    for(let i =0; i<readyLines.length; i++){
        if(!checkForIntersection(readyLines[i]) && !checkForDistance(readyLines[i])){
            quadTree.insertLine(readyLines[i]);
            quadTree.determineTreeCoordinate();
            lines.push(readyLines[i]);
        }
    }
    console.log(quadTree);
}


window.onload = function init() {
    animate();

    let windowSearchBTN = document.getElementById('windowSearchBTN');
    windowSearchBTN.addEventListener('click', function (event) {
        // Turn on and off necessary and unnecessary parts of the program
        i = 0;
        isWindowSearchOn = true;
        searchWindow = null;
        setIndexArrayBackToNull();
        isNearestNeighborSearchOn = false;
        animationMode = false;

        // Button Colors
        this.className = "btn btn-primary btn-sm";
        KNNsearchBTN.className = 'btn btn-outline-secondary btn-sm';
        addLineBTN.className = 'btn btn-outline-secondary btn-sm';
    });

    let addLineBTN = document.getElementById('addLineBTN');
    addLineBTN.className = "btn btn-primary btn-sm";
    addLineBTN.addEventListener('click', function (event) {
        // Turn on and off necessary and unnecessary parts of the program
        i = 0;
        isWindowSearchOn = false;
        searchWindow = null;
        setIndexArrayBackToNull();
        animationMode = false;
        isNearestNeighborSearchOn = false;

        // Button Colors
        this.className = "btn btn-primary btn-sm";
        KNNsearchBTN.className = 'btn btn-outline-secondary btn-sm';
        windowSearchBTN.className = 'btn btn-outline-secondary btn-sm';
    });

    let clearBTN = document.getElementById('clearBTN');
    clearBTN.addEventListener('click', function (event) {
        // Turn on and off necessary and unnecessary parts of the program
        i = 0;
        lines = [];
        isWindowSearchOn = false;
        searchWindow = null;
        isNearestNeighborSearchOn = false;
        setIndexArrayBackToNull();
        animationMode = false;
        quadTree.reset();
        kNearestNeighborSearchSlider.value = 0;
        kNearestNeighborSearchSlider.max = 0;
        document.getElementById('near').value = 0;
        console.log(quadTree);

        // Button Colors
        addLineBTN.className = "btn btn-primary btn-sm";
        KNNsearchBTN.className = 'btn btn-outline-secondary btn-sm';
        windowSearchBTN.className = 'btn btn-outline-secondary btn-sm';

    })

    let randomBTN = document.getElementById('savedBTN');
    randomBTN.addEventListener('click', function (event) {
        randomeLines();
    })

    let animateBTN = document.getElementById('animateBTN');
    animateBTN.addEventListener('click', function (event) {
        // Turn on and off necessary and unnecessary parts of the program
        i = 0;
        resetIndexArrayColor();
        if(knnCircle != null){
            knnCircle.r = 0;
        }
        animationMode = true;
    })

    let KNNsearchBTN = document.getElementById("nearestNeighborSearchBTN");
    KNNsearchBTN.addEventListener('click', function(event){
        // Turn on and off necessary and unnecessary parts of the program
        i = 0;
        isWindowSearchOn = false;
        searchWindow = null;
        setIndexArrayBackToNull();
        animationMode = false;
        isNearestNeighborSearchOn = true;
        kNearestNeighborSearchSlider.max = quadTree.array.length;
        k = kNearestNeighborSearchSlider.value;

        // Button Colors
        this.className = "btn btn-primary btn-sm";
        addLineBTN.className = 'btn btn-outline-secondary btn-sm';
        windowSearchBTN.className = 'btn btn-outline-secondary btn-sm';
    })

    let treeCapacitySlider = document.getElementById('quadTreeCapacitySlider');
    treeCapacitySlider.addEventListener('change', function (event) {
        // Turn on and off necessary and unnecessary parts of the program
        i = 0;
        capacity = treeCapacitySlider.value;
        quadTree = new Quadtree(boundry, capacity);
        isWindowSearchOn = false;
        searchWindow = null;
        isNearestNeighborSearchOn = false;
        setIndexArrayBackToNull();
        lines = [];
        animationMode = false;

        kNearestNeighborSearchSlider.value = 0;
        kNearestNeighborSearchSlider.max = 0;
        document.getElementById('near').value;

        // Button Colors
        addLineBTN.className = "btn btn-primary btn-sm";
        KNNsearchBTN.className = 'btn btn-outline-secondary btn-sm';
        windowSearchBTN.className = 'btn btn-outline-secondary btn-sm';
    })

    let animationDelaySlider = document.getElementById('animationDelaySlider');
    animationDelaySlider.addEventListener('change', function (event) {
        animationSpeed = animationDelaySlider.value;
    })

    let kNearestNeighborSearchSlider = document.getElementById("kNearestNeighborSlider");
    kNearestNeighborSearchSlider.addEventListener('change', function(event){
        k = kNearestNeighborSearchSlider.value;
    })

}

// Function for drawing lines inside quadtree draw function
function drawLine(line, color) {
    context.save();
    context.lineWidth = "1";
    context.strokeStyle = color || 'rgba(0,0,0,1)';
    context.beginPath();
    context.moveTo(line.point1.x, line.point1.y);
    context.lineTo(line.point2.x, line.point2.y);
    context.stroke();
    drawPoint(line.point1.x, line.point1.y, "black");
    drawPoint(line.point2.x, line.point2.y, "black");
    context.restore();
}

// Function for drawing rectangle
function drawRect(boundry) {
    context.save();
    context.lineWidth = "0.5";
    context.beginPath();
    context.strokeStyle = 'red';
    context.rect(boundry.centerX - boundry.width, boundry.centerY - boundry.height, boundry.width * 2, boundry.height * 2);
    context.stroke();
    context.restore();
}

// Function for drawing a point
function drawPoint(x, y, color) {
    context.fillStyle = color || 'black';
    context.beginPath();
    context.arc(x, y, 2, 0, 2 * Math.PI, true);
    context.fill();
}

function addLineMode() {
    if (!isWindowSearchOn) {
        drawLinePreview();
    }
}

// This Function resets the node colors and sets the indexArray to null;
function setIndexArrayBackToNull() {
    // reset the colors of the nodes
    for (let i = 0; i < indexArray.length; i++) {
        if (indexArray[i].boundry.color != 'rgba(0,0,0,0)') {
            // reset the nodes color
            if(indexArray[i].qEdges.length != 0){
                indexArray[i].boundry.color = 'rgba(0,0,0,0.5)';
            }else{
                indexArray[i].boundry.color = 'rgba(0,0,0,0)';
            }

            // reset the lines color
            for (let j = 0; j < indexArray[i].qEdges.length; j++) {
                indexArray[i].qEdges[j].color = 'rgba(0,0,0,1)';
            }
        }
    }
    indexArray = [];
}
// This function resets the line colors and sets nearestLines array to null
function resetNearestLinesArray(){
    for(let i = 0; i<nearestLines.length; i++){
        nearestLines[i].color = 'rgba(0,0,0,1)';
    }
    nearestLines = [];
}

// Function for Only reseting the indexArray colors
function resetIndexArrayColor() {
    for (let i = 0; i < indexArray.length; i++) {
        if (indexArray[i].boundry.color != 'rgba(0,0,0,0)') {
            if(indexArray[i].qEdges.length != 0){
                indexArray[i].boundry.color = 'rgba(0,0,0,0.5)';
            }else{
                indexArray[i].boundry.color = 'rgba(0,0,0,0)';
            }
            for (let j = 0; j < indexArray[i].qEdges.length; j++) {
                indexArray[i].qEdges[j].color = 'rgba(0,0,0,1)'
            }
        }
    }
}

// Function for animating rectangle drawing in window search mode
function windowSearchMode() {
    if (isWindowSearchOn) {
        drawWindowPreview();
        drawWindow();
    }
}

// Function for animating window search
function windowSearchAnimMode(node) {
    if (animationMode && indexArray.length != 0 && isWindowSearchOn) {
        ctxT.save();
        context.save();
        context.fillStyle = 'rgba(255, 99, 71, 0.8)'; // Orange for nodes
        context.fillRect(node.boundry.centerX - node.boundry.width, node.boundry.centerY - node.boundry.height, node.boundry.height * 2, node.boundry.width * 2);
        ctxT.fillStyle = 'rgba(255, 99, 71, 0.8)'; // Orange for nodes
        ctxT.fillRect(node.boundry.graphXcoordinate, node.boundry.graphYcoordinate, node.boundry.graphWidth, node.boundry.graphHeight);
        //node.boundry.color = 'rgba(154, 205, 50, 0.2)';
        if(node.qEdges.length != 0){
            node.boundry.color = 'rgba(240, 255, 0, 0.3)'; // Yellow for nodes that contain lines
        }
        //node.boundry.color = 'rgba(240, 255, 0, 0.3)'; // Yellow
        for (let i = 0; i < node.qEdges.length; i++) {
            if (searchWindow.containsLine(node.qEdges[i])) {
                node.qEdges[i].color = 'rgba(225,0,0,0.5)' // Orange for Lines
            }
        }
        context.restore();
        ctxT.restore();
    }
}

// Function for Animating KNN Search
function knnAnimMode(node){
    if(indexArray.length != 0 && isNearestNeighborSearchOn && animationMode && nearestLines.length != 0){
        if (!node.boundry.circleOverlap(knnCircle)) {
            i--;
            knnCircle.r++;
            return;
        } else {
            ctxT.save();
            context.save();
            context.fillStyle = 'rgba(255, 99, 71, 0.8)'; // Orange for nodes
            context.fillRect(node.boundry.centerX - node.boundry.width, node.boundry.centerY - node.boundry.height, node.boundry.height * 2, node.boundry.width * 2);
            ctxT.fillStyle = 'rgba(255, 99, 71, 0.8)'; // Orange for nodes
            ctxT.fillRect(node.boundry.graphXcoordinate, node.boundry.graphYcoordinate, node.boundry.graphWidth, node.boundry.graphHeight);
            if (node.qEdges.length != 0) {
                node.boundry.color = 'rgba(240, 255, 0, 0.3)'; // Yellow for nodes that contain lines
            }
            context.restore();
            ctxT.restore();
        }

        while (j < nearestLines.length && (nearestLines[j].distanceFromPoint(new Point(knnCircle.x, knnCircle.y)) < knnCircle.r)) {
            nearestLines[j].color = 'rgba(225,0,0,0.5)';
            j++;
        }
        // If all the nearest lines are colored then stop animation
        if (j == nearestLines.length) {
            animationMode = false;
            i = 0;
            j = 0;
            return;
        }
    }
}

// Function for drawing knnCircle in Nearest Neighbor search mode
function NNSearchMode(){
    if(isNearestNeighborSearchOn && knnCircle != null && indexArray.length != 0){
        knnCircle.draw();
    }
}

// Function to check if the new line intersects with the already existing lines or not
function checkForIntersection(line){

    for(let k = 0; k<lines.length; k++){
        if(line.lineIntersection(lines[k])){
            if(!(line.point1.checkSimilarity(lines[k].point1) || line.point1.checkSimilarity(lines[k].point2)
            || line.point2.checkSimilarity(lines[k].point1) || line.point2.checkSimilarity(lines[k].point2))){
                return true;
            }

        }
    }

    return false;
}

// Function to check if the new line is close to the already existing lines
function checkForDistance(line){
    for(let k = 0; k<lines.length; k++){
        let distance = line.distanceFromLine(lines[k]);
        if(distance<10 && distance != 0){
            return true;
        }
    }
    return false;
}

let j = 0; // for coloring lines inside the knnAnimMode function
let i = 0; // for coloring indexArray elements inside windowSeachAnimation function
function animate() {
    ctxT.clearRect(0, 0, treeCanvas.width, treeCanvas.height);
    context.clearRect(0,0,canvas.width,canvas.height);

    windowSearchMode();
    addLineMode();
    windowSearchAnimMode(indexArray[i]);
    NNSearchMode();
    knnAnimMode(indexArray[i]);
    quadTree.drawTree();
    quadTree.draw();
    if (animationMode) {
        setTimeout(() => {
            requestAnimationFrame(animate)
        }, animationSpeed)

        i++;
        //knnCircle.r = knnCircle.r +10;
        if (i >= indexArray.length) {
            i = 0;
            animationMode = false;
        }
    } else {
        requestAnimationFrame(animate);
    }
}


// Function for animating window drawing in windows search
function drawWindowPreview() {
    context.save();
    if (isWindowSearchOn) {
        // for animating window drawing
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.lineWidth = "1";
        context.strokeStyle = 'red';
        context.beginPath();
        if (x1 < x2 && y1 < y2) {
            context.rect(x1, y1, Math.abs(x2 - x1), Math.abs(y1 - y2));
            context.stroke();
        } else if (x1 < x2 && y1 > y2) {
            context.rect(x1, y2, Math.abs(x2 - x1), Math.abs(y1 - y2));
            context.stroke();
        } else if (x1 > x2 && y1 < y2) {
            context.rect(x2, y1, Math.abs(x2 - x1), Math.abs(y1 - y2));
            context.stroke();
        } else {
            context.rect(x2, y2, Math.abs(x2 - x1), Math.abs(y1 - y2));
            context.stroke();
        }
    }
    context.restore();
}

// Function for drawing search window
function drawWindow() {
    context.save();
    if (searchWindow) {
        // Used for continuously drawing the search window
        context.lineWidth = "1";
        context.fillStyle = 'rgba(128,128,128,0.5)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'white';
        context.strokeStyle = 'red';
        context.beginPath();
        context.rect(searchWindow.centerX - searchWindow.width, searchWindow.centerY - searchWindow.height, searchWindow.width * 2, searchWindow.height * 2);
        context.fillRect(searchWindow.centerX - searchWindow.width, searchWindow.centerY - searchWindow.height, searchWindow.width * 2, searchWindow.height * 2)
        context.stroke();
        context.closePath();
    }
    context.restore();
}

// Function for animating line drawing in add line mode
function drawLinePreview() {
    context.save();
    if (lineInsertMode) {
        // animate line drawing if program is in insert line mode
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.beginPath();
        context.strokeStyle = 'black';
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();
        drawPoint(x1, y1, "black");
        drawPoint(x2, y2, "black");
        context.closePath();
    }
    context.restore();
}

canvas.addEventListener('mousemove', function (ev) {
    if (isDown == true) {
        // if mouse is down, save the coordinates. Used for animation line and rectangle drawing
        x2 = ev.offsetX;
        y2 = ev.offsetY;
        let flag = true;
        let i = 0;
        while(flag && i<lines.length){
            if(((x2-lines[i].point1.x)*(x2-lines[i].point1.x)+(y2-lines[i].point1.y)*(y2-lines[i].point1.y))<=(5*5)){
                x2 = lines[i].point1.x;
                y2 = lines[i].point1.y;
                flag = false;
            }else if(((x2-lines[i].point2.x)*(x2-lines[i].point2.x)+(y2-lines[i].point2.y)*(y2-lines[i].point2.y))<=(5*5)){
                x2 = lines[i].point2.x;
                y2 = lines[i].point2.y;
                flag = false;
            }else{
                i++;
            }
        }
    }
    document.getElementById('text').innerHTML = "("+ev.offsetX+","+ev.offsetY+")"
});
canvas.addEventListener('mousedown', e => {
    // Save the coordinates of the mouse and turn on mouse down mode. Set the second coordinate same as the first. So it is a point
    x1 = e.offsetX;
    y1 = e.offsetY;
    let flag = true;
    let i = 0;
    while(flag && i<lines.length){
        if(((x1-lines[i].point1.x)*(x1-lines[i].point1.x)+(y1-lines[i].point1.y)*(y1-lines[i].point1.y))<=(7*7)){
            x1 = lines[i].point1.x;
            y1 = lines[i].point1.y;
            flag = false;
        }else if(((x1-lines[i].point2.x)*(x1-lines[i].point2.x)+(y1-lines[i].point2.y)*(y1-lines[i].point2.y))<=(7*7)){
            x1 = lines[i].point2.x;
            y1 = lines[i].point2.y;
            flag = false;
        }else{
            i++;
        }
    }
    //isPointClose(x1,y1);
    x2 = x1;
    y2 = y1;
    isDown = true;
});

canvas.addEventListener('mouseup', e => {
    if ((x1 != x2 || y1 != y2) && !isWindowSearchOn && !isNearestNeighborSearchOn) {
        // Add Line Mode
        // This will work if input is not a point and window search is OFF
        line = new qEdge(x1, y1, x2, y2);
        if(!checkForIntersection(line) && !checkForDistance(line)){
            quadTree.insertLine(line);
            quadTree.determineTreeCoordinate();
            lines.push(line);
            console.log(quadTree);
        }
    } else if ((x1 != x2 || y1 != y2) && isWindowSearchOn) {
        // Window Search Mode
        // This will work if input is not a point and window search is ON.  This means input is a rectangle
        setIndexArrayBackToNull();
        searchWindow = new Boundry((x1 + x2) / 2, (y1 + y2) / 2, Math.abs(y1 - y2) / 2, Math.abs(x1 - x2) / 2);
        drawRect(searchWindow);
        quadTree.windowSearch(searchWindow);
    } else if(isNearestNeighborSearchOn) {
        // Nearest Neighbor Search Mode
        // This will work if input is a point and Nearest Neighbor Search is on
        setIndexArrayBackToNull();
        resetNearestLinesArray();
        if(k != 0){
            knnCircle = new Circle(x1, y1, r = 0);
            quadTree.nearestNeighborSearch(new Point(x1, y1), k)
        }
        isDown = false;
    }else{
        // This will work if input is a point
        x1 = 0, x2 = 0, y1 = 0, y2 = 0;
        isDown = false;
    }
    // This will always work
    x1 = 0, x2 = 0, y1 = 0, y2 = 0;
    isDown = false;
});
