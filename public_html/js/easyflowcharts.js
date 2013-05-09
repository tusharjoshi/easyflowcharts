/* 
 * Copyright (C) 2013 Tushar Joshi, Nagpur
 * 
 * Permission is hereby granted, free of charge, to any person 
 * obtaining a copy of this software and associated documentation 
 * files (the "Software"), to deal in the Software without restriction, 
 * including without limitation the rights to use, copy, modify, merge, 
 * publish, distribute, sublicense, and/or sell copies of the Software, 
 * and to permit persons to whom the Software is furnished to do so, 
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included 
 * in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES 
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
 * DEALINGS IN THE SOFTWARE.
 */

var text;
var update = false;

var fontstyle = "bold 11px Verdana";
var textcolor = "black";
var shadowcolor = "black";


var fillcolor = "#f4f4f4";


function MyConnector(myContainer, color, x1, y1, x2, y2, text) {

    this.myContainer = myContainer;
    this.x1 = x1;
    this.y1 = y1;
    this.fill = color;
    this.mainObject = this;
    this.x2 = x2; 
    this.y2 = y2;
    this.textwidth = 0;
    this.textheight = 0;
    
    /*GitIssue #4 Begin: 23Apr2013-abhishekanne- Direction arrow on connector line */
    this.arrowSize=10;
    this.angle = Math.atan2(this.y2-this.y1,this.x2-this.x1);
    /*GitIssue #4 End*/
    
    this.displayObjects = new Array();

    this.displayObjects['text'] = new createjs.Text(text, fontstyle, textcolor);
    this.textwidth = this.displayObjects['text'].getMeasuredWidth();
    this.textheight = this.displayObjects['text'].getMeasuredHeight();

    this.displayObjects['line'] = new createjs.Shape();
    this.displayObjects['line'].mainObject = this;
    
    
    
    this.drawGraphics = function () {
        this.angle = Math.atan2(this.y2-this.y1,this.x2-this.x1);
        this.displayObjects['line'].graphics
            .clear()
            .setStrokeStyle(2)
            .beginStroke("black")
            .moveTo(this.x1,this.y1)
            .lineTo(this.x2,this.y2)
            /*GitIssue #4 Begin: 23Apr2013-abhishekanne- Direction arrow on connector line */
            .lineTo(this.x2-this.arrowSize*Math.cos(this.angle-Math.PI/6),this.y2-this.arrowSize*Math.sin(this.angle-Math.PI/6))
            .moveTo(this.x2, this.y2)
            .lineTo(this.x2-this.arrowSize*Math.cos(this.angle+Math.PI/6),this.y2-this.arrowSize*Math.sin(this.angle+Math.PI/6))
            /*GitIssue #4 End */
            .closePath()
            .endStroke();
    };
    
    this.drawGraphics();
    
    this.displayObjects['line'].shadow = new createjs.Shadow(shadowcolor, 2, 2, 5);

    if( text === "undefined" )
    {
            text = "";
    }
    
    this.setTextPosition = function () {
        this.displayObjects['text'].x = (this.x1 + this.x2)/2;
        this.displayObjects['text'].y = (this.y1 + this.y2)/2;
    };
    
    this.setTextPosition();

    this.addChild = function (stage) {
            stage.addChild(this.displayObjects['line']);
            stage.addChild(this.displayObjects['text']);
    };

    this.move = function (xmove, ymove) {
        /* var line = this.mainObject.displayObjects['line'];
        var text = this.mainObject.displayObjects['text'];
        line.x = xmove;
        line.y = ymove;		

        text.x = xmove + (this.mainObject.x1 + this.mainObject.x2)/2;
        text.y = ymove + (this.mainObject.y1 + this.mainObject.y2)/2; */
    };

    this.moveSource = function (xmove, ymove) {
        
        console.log("xmove="+xmove+", ymove=" +ymove);
        this.mainObject.x1 = xmove;
        this.mainObject.y1 = ymove;
        
        this.setTextPosition();
        
        this.mainObject.drawGraphics();
    };

    this.moveTarget = function (xmove, ymove) {
        this.mainObject.x2 = xmove;
        this.mainObject.y2 = ymove;
        
        this.setTextPosition();
        
        this.mainObject.drawGraphics();
    };

    this.displayObjects['line'].mainObject = this;
    this.displayObjects['line'].onPress = pressHandler;   
}

function MyDiamond(myContainer, color, x, y, width, height, text) {

    this.myContainer = myContainer;
    this.width = width;
    this.height = height;
    this.fill = color;
    this.mainObject = this;
    this.x = x; 
    this.y = y;
    this.textwidth = 0;
    this.textheight = 0;
    
    this.connectCount = 0;

    this.displayObjects = new Array();

    this.displayObjects['text'] = new createjs.Text(text, fontstyle, textcolor);
    this.textwidth = this.displayObjects['text'].getMeasuredWidth();
    this.textheight = this.displayObjects['text'].getMeasuredHeight();
    
    if( this.width <= this.textwidth + 50) {
        this.width = this.textwidth + 50;
    }
    
    if( this.height <= this.textheight + 50) {
        this.height = this.textheight + 50;
    }

    this.displayObjects['rect'] = new createjs.Shape();
    this.displayObjects['rect'].mainObject = this;
    this.displayObjects['rect'].graphics
            .beginFill(color)
            .moveTo(this.width/2,0)
            .lineTo(this.width,this.height/2)
            .lineTo(this.width/2,this.height)
            .lineTo(0,this.height/2)
            .closePath()
            //.endStroke()
            .endFill();

    this.displayObjects['rect'].shadow = new createjs.Shadow(shadowcolor, 3, 3, 10);

    this.displayObjects['rect2'] = new createjs.Shape();
    this.displayObjects['rect2'].mainObject = this;
    this.displayObjects['rect2'].graphics
            .setStrokeStyle(2)
            .beginStroke("black")
            .moveTo(this.width/2,0)
            .lineTo(this.width,this.height/2)
            .lineTo(this.width/2,this.height)
            .lineTo(0,this.height/2)
            .closePath()
            .endStroke();

    if( text === "undefined" )
    {
            text = "";
    }

    this.displayObjects['rect'].x = x;
    this.displayObjects['rect'].y = y;

    this.displayObjects['rect2'].x = x;
    this.displayObjects['rect2'].y = y;
    
    this.displayObjects['text'].x = x + (this.width - this.textwidth)/2;
    this.displayObjects['text'].y = y + (this.height - this.textheight)/2;

    this.addChild = function (stage) {
            stage.addChild(this.displayObjects['rect']);
            stage.addChild(this.displayObjects['rect2']);
            stage.addChild(this.displayObjects['text']);
    };

    this.setX = function (xmove) {
        this.mainObject.displayObjects['rect'].x = xmove;
        this.mainObject.displayObjects['rect2'].x = xmove;
        this.mainObject.displayObjects['text']
            .x = xmove + (this.mainObject.width - this.mainObject.textwidth)/2;
    };

    this.setY = function (ymove) {
        this.mainObject.displayObjects['rect'].y = ymove;
        this.mainObject.displayObjects['rect2'].y = ymove;
        this.mainObject.displayObjects['text'].y = 
                ymove + (this.mainObject.height - this.mainObject.textheight)/2;
    };

    this.move = function (xmove, ymove) {
        this.mainObject.setX(xmove);
        this.mainObject.setY(ymove);
    };

    this.displayObjects['rect'].mainObject = this;
    this.displayObjects['rect'].onPress = pressHandler;
}

function MyRect(myContainer, color, x, y, width, height, text) {

    this.myContainer = myContainer;
    this.width = width;
    this.height = height;
    this.fill = color;
    this.mainObject = this;
    this.x = x; 
    this.y = y;
    this.textwidth = 0;
    this.textheight = 0;

    this.displayObjects = new Array();

    this.displayObjects['text'] = new createjs.Text(text, fontstyle, textcolor);
    this.textwidth = this.displayObjects['text'].getMeasuredWidth();
    this.textheight = this.displayObjects['text'].getMeasuredHeight();
    
    if( this.width <= this.textwidth + 50) {
        this.width = this.textwidth + 50;
    }
    
    if( this.height <= this.textheight + 20) {
        this.height = this.textheight + 20;
    }

    this.displayObjects['rect'] = new createjs.Shape();
    this.displayObjects['rect'].mainObject = this;
    this.displayObjects['rect'].graphics
            //.setStrokeStyle(2)
            //.beginStroke("black")
            .beginFill(color)
            .drawRect(0, 0, this.width, this.height)
            //.endStroke()
            .endFill();

    this.displayObjects['rect'].shadow = new createjs.Shadow(shadowcolor, 3, 3, 10);

    this.displayObjects['rect2'] = new createjs.Shape();
    this.displayObjects['rect2'].mainObject = this;
    this.displayObjects['rect2'].graphics
        .setStrokeStyle(2)
        .beginStroke("black")
        //.beginFill("#a0a0a0")
        .drawRect(0, 0, this.width, this.height)
        .endStroke();

    if( text === "undefined" )
    {
            text = "";
    }

    this.displayObjects['rect'].x = x;
    this.displayObjects['rect'].y = y;

    this.displayObjects['rect2'].x = x;
    this.displayObjects['rect2'].y = y;

    this.displayObjects['text'].x = x + (this.width - this.textwidth)/2;
    this.displayObjects['text'].y = y + (this.height - this.textheight)/2;

    this.addChild = function (stage) {
            stage.addChild(this.displayObjects['rect']);
            stage.addChild(this.displayObjects['rect2']);
            stage.addChild(this.displayObjects['text']);
    };

    this.setX = function (xmove) {
        this.mainObject.displayObjects['rect'].x = xmove;
        this.mainObject.displayObjects['rect2'].x = xmove;		

        this.mainObject.displayObjects['text'].x = xmove + (this.mainObject.width - this.mainObject.textwidth)/2;
    };

    this.setY = function (ymove) {
        this.mainObject.displayObjects['rect'].y = ymove;
        this.mainObject.displayObjects['rect2'].y = ymove;		

        this.mainObject.displayObjects['text'].y = ymove + (this.mainObject.height - this.mainObject.textheight)/2;
    };

    this.move = function (xmove, ymove) {
        this.mainObject.setX(xmove);
        this.mainObject.setY(ymove);
    };

    this.displayObjects['rect'].mainObject = this;
    this.displayObjects['rect'].onPress = pressHandler;
}

function MyCircle(myContainer, color, x, y, radius, text) {

    this.myContainer = myContainer;
    this.radius = radius;
    this.fill = color;
    this.mainObject = this;
    this.x = x; 
    this.y = y;
    this.textwidth = 0;
    this.textheight = 0;

    this.displayObjects = new Array();

    this.displayObjects['text'] = new createjs.Text(text, fontstyle, textcolor);
    this.textwidth = this.displayObjects['text'].getMeasuredWidth();
    this.textheight = this.displayObjects['text'].getMeasuredHeight();
    
    if( this.radius <= (this.textwidth + 20)/2) {
        this.radius = (this.textwidth + 20)/2;
    }

    this.displayObjects['circle'] = new createjs.Shape();
    this.displayObjects['circle'].mainObject = this;
    this.displayObjects['circle'].graphics
            //.setStrokeStyle(2)
            //.beginStroke("black")
            .beginFill(color)
            .drawCircle(0, 0, this.radius)
            //.endStroke()
            .endFill();

    this.displayObjects['circle'].shadow = new createjs.Shadow(shadowcolor, 3, 3, 10);

    this.displayObjects['circle2'] = new createjs.Shape();
    this.displayObjects['circle2'].mainObject = this;
    this.displayObjects['circle2'].graphics
        .setStrokeStyle(2)
        .beginStroke("black")
        .drawCircle(0, 0, this.radius)
        .endStroke();

    if( text === "undefined" )
    {
            text = "";
    }

    this.displayObjects['circle'].x = x + this.radius;
    this.displayObjects['circle'].y = y+ this.radius;

    this.displayObjects['circle2'].x = x+ this.radius;
    this.displayObjects['circle2'].y = y+ this.radius;

    this.displayObjects['text'].x = x+ this.radius - this.textwidth/2;
    this.displayObjects['text'].y = y+ this.radius - this.textheight/2;

    this.addChild = function (stage) {
            stage.addChild(this.displayObjects['circle']);
            stage.addChild(this.displayObjects['circle2']);
            stage.addChild(this.displayObjects['text']);
    };

    this.setX = function (xmove) {
        this.mainObject.displayObjects['circle'].x = xmove;
        this.mainObject.displayObjects['circle2'].x = xmove;		

        this.mainObject.displayObjects['text'].x = xmove - this.mainObject.textwidth/2;
    };

    this.setY = function (ymove) {
        this.mainObject.displayObjects['circle'].y = ymove;
        this.mainObject.displayObjects['circle2'].y = ymove;		

        this.mainObject.displayObjects['text'].y = ymove - this.mainObject.textheight/2;
    };

    this.move = function (xmove, ymove) {
        this.mainObject.setX(xmove);
        this.mainObject.setY(ymove);
    };

    this.displayObjects['circle'].mainObject = this;
    this.displayObjects['circle'].onPress = pressHandler;
}

function changeCanvasSize( width, height) {
    var canvas  = document.getElementById("demoCanvas");
    canvas.style.width = "" + width + "px";
    canvas.style.height = "" + height + "px";
    canvas.width = width;
    canvas.height = height;
    
//    var context = canvas.getContext( '2d' );
//    
//    context.save();
//    //context.translate(newx, newy);
//    context.rotate(-Math.PI/2);
//    context.textAlign = "center";
//    context.fillText("www.easyflowcharts.com", 100, 0);
//    context.restore();
    var headingText = new createjs.Text("www.easyflowcharts.com", fontstyle, textcolor);
    headingText.x = 100;
    headingText.y = 30;
    stage.addChild( headingText );
    
    stage.update();
}

var xs = 0;
var ys = 0;

function pressHandler(pressEvent){
    pressEvent.onMouseMove = function(moveEvent){
     
        if( update === false ) {
            xs  = moveEvent.stageX - pressEvent.target.x;
            ys = moveEvent.stageY - pressEvent.target.y;
        }
  
        // the target is the display object
        // call its myContainer for move
        var myShape = pressEvent.target;
        var display = myShape.mainObject;
        if( display.myContainer ) {
            display.myContainer.x = moveEvent.stageX - xs;
            display.myContainer.y = moveEvent.stageY - ys;
            if( display.myContainer.move ) {
                display.myContainer.move();
            }
        }
        update = true;
    };
}

function tick(){ 
    if(update){
        update = false;
        stage.update(); 
    }
}

function showAsImage() {
    var canvas  = document.getElementById("demoCanvas");
    var dataUrl = canvas.toDataURL();

    window.open(dataUrl, "toDataURL() image", "width=600, height=200");
}

function getValidLines(text) {
    var codetext = text;
    var codelines = codetext.split('\n');
    
    var lines = new Array();
    var index = 0;
    for (var i = 0; i < codelines.length; i++) {
        var line = codelines[i];
        if( line) {
            lines[index++] =  codelines[i];
        }
    }
    
    return lines;
}

function getTokenArray(line) {
    var parts = line.split(':');
    
    var relation = parts[0];
    var name = "";
    if( parts.length > 1 ) {
        name = parts[1];
    }
    
    var tokens = new Array();
    
    var parts2 = relation.split('->');
    
    tokens[0] = parts2[0];
    if( parts2.length > 1 ) {
        tokens[1] = parts2[1];
    }
    tokens[2] = name;
    
    return tokens;
}

function FlowNode(name) {
    this.name = name;
    this.type = "rect";
    this.level = 0;
    this.column = 0;
    this.legwidth = 0;
    this.coloffset = 0;
    this.colwidth = 0;
    this.display = null;
    this.x = 0;
    this.y = 0;
    this.outCount = 0;
    this.inCount = 0;
    this.outNodes = new Array();
    this.inNodes = new Array();
    
    this.toString = function () {
        var text = "[Node:" + this.name + ", Level:" + this.level + "]\n";
        for( var i = 0 ; i < this.outNodes.length; i++ ) {
            text = text + "   [Rel: From: " + this.outNodes[i].sourceNode.name + " To: " + this.outNodes[i].targetNode.name + "]\n";
        }                    
        return text;
    };
    
    this.setType = function(type) {
        this.type = type;
        if( this.display ) {
            this.display = null;
        }
    };
    
    this.addOutNode = function (node ) {
        this.outNodes[this.outNodes.length] = node;
        this.outCount = this.outNodes.length;
    };
    
    this.addInNode = function (node ) {
        this.inNodes[this.inNodes.length] = node;
        this.inCount = this.inNodes.length;
    };
    
    this.createDisplay = function () {
        if( this.type === "start" || this.type === "stop" ) {
            this.display = new MyCircle(this, fillcolor, this.x,this.y, 20, this.name ); //+ "(" + this.column + "," + this.level + ")");
        } else if( this.type === "diamond" ) {
            this.display = 
                    new MyDiamond(this, fillcolor, this.x, 
                        this.y, 20, 50, this.name ); //+ "(" + this.column + "," + this.level + ")");

        } else {
            this.display = 
                    new MyRect(this, fillcolor, this.x, 
                        this.y, 20, 50, this.name); //+ "(" + this.column + "," + this.level + ")");       
        }
    };
    
    this.move = function() {
        // move the display object
        this.display.move(this.x, this.y);
        
        // move the connectors
        for( var index = 0 ; index < this.outNodes.length; index++ ) {
            var outNode = this.outNodes[index];
            outNode.moveSource(this.x, this.y);
        }
        
        for( var index = 0 ; index < this.inNodes.length; index++ ) {
            var inNode = this.inNodes[index];
            inNode.moveTarget(this.x, this.y);
        }
    };
    
    this.configureType = function() {
        if( this.level === 0 ) {
            this.type = "start";
        } else {
            if( this.outCount === 2 ) {
                this.type = "diamond";
                
            } else {
                this.type = "rect";       
            }
        }
    };
    
    this.getSourceX = function () {
        if( this.type === "start" || this.type === "stop") {
            return this.x ; //+ this.display.radius;
        } else if( this.type === "diamond") {
            if( this.display.connectCount === 0 ) {
                this.display.connectCount++;
                return this.x;
            } else {
                this.display.connectCount = 0;
                return this.x + this.display.width;    
            }
        } else {
            return this.x + this.display.width/2;            
        }
    };
    
    this.getSourceY = function () {
        if( this.type === "start" || this.type === "stop") {
            return this.y + this.display.radius;
        } else if( this.type === "diamond") {
            return this.y + this.display.height/2;                        
        } else {
            return this.y + this.display.height;            
        }
    };
    
    this.getTargetX = function () {
        if( this.type === "start" || this.type === "stop") {
            return this.x ; //+ this.display.radius;
        } else if( this.type === "diamond") {
            return this.x + this.display.width/2;            
        } else {
            return this.x + this.display.width/2;            
        }
    };
    
    this.getTargetY = function () {
        if( this.type === "start" || this.type === "stop") {
            return this.y - this.display.radius;
        } else if( this.type === "diamond") {
            return this.y;            
        } else {
            return this.y;            
        }
    };
    
    this.getWidth = function () {
        if( this.type === "start" || this.type === "stop") {
            return this.display.radius * 2;
        } else if( this.type === "diamond") {
            return this.display.width;            
        }
    };
    
    this.getHeight = function () {
        if( this.type === "start" || this.type === "stop") {
            return this.display.radius * 2;
        } else if( this.type === "diamond") {
            return this.display.height;            
        }
    };
    
    this.addChild = function (stage) {
        this.display.addChild( stage );
    };
}

function NodeRelation(name, sourceNode, targetNode) {
    this.name = name;
    this.sourceNode = sourceNode;
    this.targetNode = targetNode;
    this.display = null;
    
    this.createDisplay = function () {
        this.display = new MyConnector(this, fillcolor, 
            sourceNode.getSourceX(),sourceNode.getSourceY(), 
            targetNode.getTargetX(), targetNode.getTargetY(), 
            this.name);
    };
    
    this.move = function( xmove, ymove) {
        this.display.move( xmove, ymove);
    };
    
    this.moveSource = function( xmove, ymove) {
        this.display.moveSource( sourceNode.getSourceX(),sourceNode.getSourceY());
    };
    
    this.moveTarget = function( xmove, ymove) {
        if( this.display ) {
            this.display.moveTarget( targetNode.getTargetX(), targetNode.getTargetY());
        }
    };
    
    this.addChild = function (stage) {
        this.display.addChild( stage );
    };
}

var flowNodeArray = new Array();
var nodeRelationArray = new Array();

function configureFlowNodesType() {
    for( var i = 0 ; i < flowNodeArray.length ; i++ ) {
        var node = flowNodeArray[i];
        node.configureType();
    }
}

function getFlowNode(name) {
    for( var i = 0 ; i < flowNodeArray.length ; i++ ) {
        var node = flowNodeArray[i];
        if( node.name === name ) {
            return node;
        }
    }
    
    return null;
}

function updateFlowNodeArray( tokens ) {
    var nodeName = tokens[0];
    var leftNode = getFlowNode( nodeName );
    if( leftNode === null ) {
        leftNode = new FlowNode( nodeName);
        flowNodeArray[flowNodeArray.length] = leftNode;
    }    
    
    var nextNodeName = tokens[1];
    var rightNode = getFlowNode( nextNodeName );
    if( rightNode === null ) {
        rightNode = new FlowNode( nextNodeName);
        flowNodeArray[flowNodeArray.length] = rightNode;
    }
    
    var relName = "";
    if( tokens.length > 1 ) {
        relName = tokens[2];
    }
    var nodeRelation = new NodeRelation(relName,leftNode, rightNode);
    nodeRelationArray[nodeRelationArray.length] = nodeRelation;
    leftNode.addOutNode( nodeRelation );
    rightNode.addInNode( nodeRelation );
    
}

function isTarget(node) {
    for( var j = 0 ; j < flowNodeArray.length ; j++ ) {
        var nodeItem = flowNodeArray[j];
        for( var k = 0 ; k < nodeItem.outNodes.length; k++ ) {
            var nodeRel = nodeItem.outNodes[k];
            if( nodeRel.targetNode === node ) {
                return true;    
            }
        }
    }
    
    return false;
}

function getStartNodes() {
    var startNodes = new Array();
    for( var i = 0 ; i < flowNodeArray.length ; i++ ) {
        var node = flowNodeArray[i];
        if( !isTarget(node) ) {
            startNodes[startNodes.length] = node;
        }
    }
    
    return startNodes;
}

function getSourceNodes( targetNode ) {
    var sourceNodes = new Array();
    for( var i = 0 ; i < flowNodeArray.length ; i++ ) {
        var node = flowNodeArray[i];
        for( var j = 0 ; j < node.outNodes.length ; j++ ) {
            var nodeRel = node.outNodes[j];
            if( nodeRel.targetNode === targetNode ) {
                if( $.inArray(node, sourceNodes) === -1 ) {
                    sourceNodes[sourceNodes.length] = node;
                }
            }
        }
    }
    
    return sourceNodes;
}

function getNodesByLevel(level) {
    var levelNodes = new Array();
    for( var i = 0 ; i < flowNodeArray.length ; i++ ) {
        var node = flowNodeArray[i];
        if( node.level === level ) {
            levelNodes[levelNodes.length] = node;
        }
    }
    
    return levelNodes;
}

/* no longer required */
function calculateLegWidth( node ) {
    if( node.outNodes.length === 0 ) {
        node.legwidth = 1;
    } else {
        var width = 0;
        for( var i = 0 ; i < node.outNodes.length; i++ ) {
            var nodeItem = node.outNodes[i].targetNode;
            calculateLegWidth( nodeItem ) ;
            width += nodeItem.legwidth;
        }
        node.legwidth = width;
    }
}

function setLevelDown( node ) {
    
    if( node.outNodes.length > 0 ) {
        for( var i = 0 ; i < node.outNodes.length; i++ ) {
            var targetNode = node.outNodes[i].targetNode;
            var noLoop = true;
            if( targetNode.level <= node.level) {
                if( targetNode.level === -1 ) {
                    targetNode.level = node.level + 1;
                } else {
                    noLoop = false;
                    if( targetNode.outNodes.length === 0 ) {
                        targetNode.level = node.level + 1;
                    }
                }
            }
            if( noLoop ) {
                setLevelDown( targetNode );
            }
        }
    }
}

function calculateMaxLevel() {
    var maxLevel = 0;
    for( var i = 0 ; i < flowNodeArray.length ; i++ ) {
        var node = flowNodeArray[i];
        if( maxLevel < node.level ) {
            maxLevel = node.level;
        }
    }
    return maxLevel;
}

function calculateMaxColumnLevel() {
    var maxCol = 0;
    var maxColLevel= 0;
    var maxLevel = calculateMaxLevel();
    for( var i = 0 ; i < maxLevel ; i++ ) {
        var levelNodes = getNodesByLevel(i);
        if( maxCol < levelNodes.length ) {
            maxCol = levelNodes.length;
            maxColLevel = i;
        }
    }
    return maxColLevel;
}

function shiftLevelColumns(level, startIndex, endIndex, offset) {
    var levelNodes = getNodesByLevel(level);
    for( var j = startIndex ; j < endIndex; j++ ) {
        var node = levelNodes[j];
        node.column += offset;
    } 
}

function setColOffsets(node) {
    
    node.coloffset = outNodes.length / 2;
    node.colwidth = (node.coloffset*2);
    
    for( var i = 0 ; i < node.outNodes.length; i++ ) {
        var targetNode = node.outNodes[1].targetNode;
        setColOffsets( targetNode );
    }
}

function getCumulativeColWidth( node ) {
    
}

function shiftNodesRight(index, level, offset) {
    
    //start from given level and travel up        
    for( var levelIndex = level; levelIndex >= 0; levelIndex-- ) {
        var levelNodes = getNodesByLevel(levelIndex);
        //travel from col 0 to last
        for( var colIndex = 0 ; colIndex < levelNodes.length; colIndex++ ) {
            var node = levelNodes[colIndex];
            // start process from given level and index onwards
            if( colIndex >= index ) {
                node.column = node.column + offset;
            } 
               
        }
    }
}

function getReminder(num, div) {
    var floatDiv = num/div;
    for( var i = 1 ; i < num ; i++ ) {
        if( i * div >= num ) {
            return (div-1);
        }
    }
    
    return 0;
}

function calculateFlowNodeColumns() {
    
    var maxLevel = calculateMaxLevel();
    
    // start with the initial nodes
    var level = 0;
    var levelNodes = getNodesByLevel(level);
    
    // make init columns
    for( var index = 0 ; index < levelNodes.length; index++ ) {
        var node = levelNodes[index];
        node.column = index;
    }
    
    for( var levelIndex = 1 ; levelIndex < maxLevel ; levelIndex++ ){
        levelNodes = getNodesByLevel(levelIndex);
        
        for( var index = 0 ; index < levelNodes.length; index++ ) {
            var node = levelNodes[index];
            //check how many children
            var childCount = node.outNodes.length;
            var offset = getReminder(childCount, 2);
            var colIndex = 0;
            var runningCol;
            if( childCount > 1 ) {
                runningCol = node.column - offset + 1;
            } else if( childCount > 0 ) {
                node.outNodes[0].targetNode.column = node.column;
            }
            if( offset > 0 ) {
                // shift all nodes after this and above to right
                // by this offset * 2 + 1
                shiftNodesRight( index, levelIndex, offset);
                // for every child of the node
                for( var n = 0 ; n < node.outNodes.length; n++ ) {
                    var childNode = node.outNodes[n].targetNode;
                    if( n === offset ) {
                        colIndex++;
                    }
                    childNode.column = runningCol + colIndex ;
                    colIndex++;
                }
            }
        }
        if( levelIndex >= 2 ) {
          //break;
        }
    }
}

function setFlowNodeLevels() {
    
    // set all levels as -1
    for( var i = 0 ; i < flowNodeArray.length ; i++ ) {
        var node = flowNodeArray[i];
        node.level = -1;
    }
    
    var startNodes = getStartNodes();
    
    for( var i = 0 ; i < startNodes.length; i++ ) {
        var startNode = startNodes[i];
        startNode.level = 0 ;
        setLevelDown( startNode );
    }
    
    configureFlowNodesType();
    
    calculateFlowNodeColumns();
    
    // set the type of last nodes to stop
    // XXX fix this only max level may not be last nodes
    var levelNodes = getNodesByLevel(calculateMaxLevel());
    for( var j = 0 ; j < levelNodes.length; j++ ) {
        var node = levelNodes[j];
        //node.type = "stop";
        node.setType("stop");
    }
    //alert(flowNodeArray);
}

function setFNDisplayPositions() {
    
    var sizeX = 0;
    var sizeY = 0;
    
    for( var i = 0 ; i < flowNodeArray.length ; i++ ) {
        var node = flowNodeArray[i];
        node.x = 50 + node.column * 150;
        node.y = 50 + 100 * node.level;
        if( sizeX < node.x + 200 ){
            sizeX = node.x + 200;
        }
        if( sizeY < node.y + 200 ) {
            sizeY = node.y + 200;
        }
    }
    
    changeCanvasSize(sizeX, sizeY);
}

function prepareDisplay() {
    for( var i = 0 ; i < flowNodeArray.length ; i++ ) {
        var node = flowNodeArray[i];
        node.createDisplay();
    }
    
    for( var i = 0 ; i < nodeRelationArray.length ; i++ ) {
        var nodeRel = nodeRelationArray[i];
        nodeRel.createDisplay();
    }
    
    for( var i = 0 ; i < nodeRelationArray.length ; i++ ) {
        var nodeRel = nodeRelationArray[i];
        nodeRel.addChild(stage);
    }
    
    for( var i = 0 ; i < flowNodeArray.length ; i++ ) {
        var node = flowNodeArray[i];
        node.addChild(stage);
    }
    
    stage.update();
}

function clearFlowNodeArray() {
    flowNodeArray = new Array();
    nodeRelationArray = new Array();
}

function updateChart() {
    var codetext = $("#codearea").val();
    updateChartWithText(codetext);    
    
    setFlowNodeLevels();
    setFNDisplayPositions();
    prepareDisplay();
    
}

function updateChartWithText(codetext) {
    //alert('updating now...');
    stage.removeAllChildren();
    stage.clear();
    clearFlowNodeArray();    
    
    var lines = getValidLines(codetext);
    
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var tokens = getTokenArray(line);
        if( tokens.length > 1 ) {
            updateFlowNodeArray( tokens );
        }
    }   
    
}

function init(){
	
    //Create a stage by getting a reference to the canvas
    stage = new createjs.Stage("demoCanvas");
    //Create a Shape DisplayObject.
    
    
    changeCanvasSize(3000, 900);

    stage.update();

    createjs.Ticker.addListener(window);
    
//    $("#codearea").val("Start->num % 2 ==0\n"  
//                + "num % 2 ==0->Even: yes\n" 
//                + "num % 2 ==0->Odd: no\n" 
//                + "Even->Stop\n" 
//                + "Odd->Stop\n");
        
    $("#codearea").val("Start->Input num\n" 
            + "Input num->num % 2 ==0\n"  
            + "num % 2 ==0->Log as Even: yes\n" 
            + "num % 2 ==0->Log as Odd: no\n" 
            + "Log as Even->Stop\n" 
            + "Log as Odd->Print num\n" 
            + "Print num->Stop\n");
    
    updateChart();
}