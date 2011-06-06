if (typeof (CChart) == 'undefined') CChart = {};

CChart.Line = function (options) {
    this.canvas = null;
    this.options = options;
    this.CreateCanvas();
    this.context = this.canvas.getContext ? this.canvas.getContext("2d") : null;

    this.padding = this.canvas.width <= this.canvas.height ? this.canvas.width * 0.1 : this.canvas.height * 0.1;

    this.colorBg = "#222";
    //    this.colorBgValues = "#333";
    this.colorGreen = "#4FA254";
    this.colorYellow = "#E3962B";
    this.colorRed = "#9E1E1E";
    this.fontFamily = "Arial";
    this.fontColor = this.options.fontColor ? this.options.fontColor : CChart.Color.darkGrey;
    this.axisFontColor = this.options.axisFontColor ? this.options.axisFontColor : CChart.Color.darkGrey;
    this.lineColor = CChart.Color.lightGrey

    this.plotWidth = this.canvas.width - (this.padding * 2);
    this.plotHeight = (this.canvas.height - (this.padding * 2));
    if (this.options.titleVisibility == null || this.options.titleVisibility) // the top texts are visible
        this.plotHeight *= 0.7;

    this.plotStartX = this.padding;

    var axisVals = $.grep(this.options.axisValues, function (val) {
        return ((val.x + "").length > 0);
    });

    var yFactor = this.padding;
    if (axisVals.length > 0)
        yFactor *= 1.5;

    this.plotStartY = this.canvas.height - (this.plotHeight + yFactor);
    this.bulletRadius = this.plotHeight * 0.03;

    this.BindEvents();
}

CChart.Line.prototype.BindEvents = function () {
    var canvas = this.canvas;
    var context = this.context;
    var axisValues = this.options.axisValues;
    var touchRadius = this.bulletRadius * 1.5;

    $(canvas).bind('tap', function (event) {
        var touchX = event.pageX - $(canvas).offset().left;
        var touchY = event.pageY - $(canvas).offset().top;

        var tooltip = $.grep(axisValues, function (val) {
            if (touchX < (val.canvasX - touchRadius) || touchX > (val.canvasX + touchRadius))
                return null;

            if (touchY < (val.canvasY - touchRadius) || touchY > (val.canvasY + touchRadius))
                return null;

            return val;
        });

        if (tooltip.length <= 0)
            return;


        $('#' + tooltip[0].tooltipDivId).show(200).delay(2000).hide(200);
    });
}

CChart.Line.prototype.Draw = function () {
    this.DrawPlot();
    this.DrawScale();
    this.DrawLine();
    this.DrawBullets();
    this.DrawTexts();
    if (this.options.titleVisibility == null || this.options.titleVisibility)
        this.DrawValueIcons();

    this.CreateTooltips();
}

CChart.Line.prototype.DrawPlot = function () {

    // bg gradient
    //    this.context.save();
    //    this.context.beginPath();
    //    var gradient = this.context.createLinearGradient(this.plotStartX, this.plotStartY, this.plotStartX, this.plotHeight);
    //    gradient.addColorStop(0, "#555");
    //    gradient.addColorStop(1, "#222");
    //    this.context.fillStyle = gradient;
    //    this.context.fillRect(this.plotStartX, this.plotStartY, this.plotWidth, this.plotHeight);
    //    this.context.closePath();
    //    this.context.restore();

    // axis lines
    this.context.save();
    this.context.beginPath();
    this.context.lineWidth = this.plotHeight * 0.01;
    this.context.strokeStyle = "#aaa";
    this.context.moveTo(this.plotStartX, this.plotStartY);
    this.context.lineTo(this.plotStartX, this.plotStartY + this.plotHeight);
    this.context.lineTo(this.plotStartX + this.plotWidth, this.plotStartY + this.plotHeight);
    this.context.stroke();
    this.context.closePath();
    this.context.restore();

    // axis labels
    var lineValues = this.options.axisValues;
    var xStepWidth = Math.round(this.plotWidth / (lineValues.length - 1));
    var fontSize = this.plotHeight * 0.06;
    if (fontSize < 10)
        fontSize = 10;

    this.context.save();
    this.context.beginPath();
    this.context.font = fontSize + "px " + this.fontFamily;
    this.context.fillStyle = this.fontColor;

    //    var yStartFactor = this.options.xAxisLabelRotation && this.options.xAxisLabelRotation >= 0 ? 0 : this.padding;
    for (var i = 0; i < lineValues.length; i++) {
        //        this.context.fillText(lineValues[i].x, this.plotStartX + (xStepWidth * i), (this.plotStartY + this.plotHeight) + (this.padding * 0.4));

        this.context.save();

        var xStartFactor = this.options.xAxisLabelRotation == null || this.options.xAxisLabelRotation == 0 ? (this.context.measureText(lineValues[i].x).width / 2) : 0;
        this.context.translate(this.plotStartX + (xStepWidth * i) - xStartFactor, (this.plotStartY + this.plotHeight) + (this.padding * 0.4));
        // rotate labels
        this.context.rotate(this.options.xAxisLabelRotation * Math.PI / 180);

        this.context.fillText(lineValues[i].x, 0, 0);
        this.context.restore();
    }

    this.context.closePath();
    this.context.restore();
}

// draw colored bg
CChart.Line.prototype.DrawScale = function () {
    var ranges = this.CalculateValues();

    this.context.save();
    this.context.beginPath();

    // set default color
    if (this.options.defaultColor != null)
        this.context.fillStyle = this.options.defaultColor;
    else
        this.context.fillStyle = CChart.Color.red;

    // filling the whole plot with default color 
    this.context.fillRect(this.plotStartX, this.plotStartY, this.plotWidth, this.plotHeight);

    // filling ranges
    var axisStartY = this.plotStartY + this.plotHeight;
    for (var i = 0; i < ranges.length; i++) {
        var startY = Math.round(this.plotHeight * (ranges[i].fromPercentile / 100));
        var stopY = Math.round(this.plotHeight * (ranges[i].toPercentile / 100));
        this.context.fillStyle = ranges[i].color;
        this.context.fillRect(this.plotStartX, axisStartY - stopY, this.plotWidth, stopY - startY);
    }

    this.context.closePath();
    this.context.restore();
}

CChart.Line.prototype.DrawLine = function () {
    var axisStartY = this.plotStartY + this.plotHeight;
    var xStepWidth = this.plotWidth / (this.options.axisValues.length - 1);

    this.context.save();
    this.context.strokeStyle = this.lineColor;
    this.context.lineWidth = this.plotHeight * 0.02;
    this.context.lineJoin = 'round';

    // setting shadow properties
    this.context.shadowOffsetX = this.context.lineWidth * 0.7;
    this.context.shadowOffsetY = this.context.lineWidth * 0.7;
    this.context.shadowBlur = this.context.lineWidth * 0.7;
    this.context.shadowColor = "rgba(0, 0, 0, 0.4)";

    this.context.beginPath();

    // moving to the first point
    //X = this.plotStartX + (this.plotWidth * (this.options.axisValues[0].x / 100))
    this.context.moveTo(this.plotStartX, axisStartY - (this.plotHeight * (this.options.axisValues[0].y / 100)));

    // define the rest of points
    for (var i = 1; i < this.options.axisValues.length; i++) {
        var x = this.plotStartX + (this.plotWidth * (this.options.axisValues[i].x / 100))
        this.context.lineTo(this.plotStartX + (xStepWidth * i), axisStartY - (this.plotHeight * (this.options.axisValues[i].y / 100)));
    }

    this.context.stroke();

    // set opacity on the area above the values line
    this.context.fillStyle = "rgba(200, 200, 200, 0.8)";
    this.context.lineTo(this.plotStartX + this.plotWidth, this.plotStartY);
    this.context.lineTo(this.plotStartX, this.plotStartY);
    this.context.fill();

    this.context.closePath();
    this.context.restore();
}

CChart.Line.prototype.DrawBullets = function () {
    var axisStartY = this.plotStartY + this.plotHeight;
    var xStepWidth = this.plotWidth / (this.options.axisValues.length - 1);
    var x, y;

    this.context.save();

    for (var i = 0; i < this.options.axisValues.length; i++) {
        x = this.plotStartX + (xStepWidth * i); //this.plotStartX + (this.plotWidth * (this.options.axisValues[i].x / 100));
        y = axisStartY - (this.plotHeight * (this.options.axisValues[i].y / 100));

        // adding canvas coordinates tooltip value
        this.options.axisValues[i].canvasX = x;
        this.options.axisValues[i].canvasY = y;

        this.context.beginPath();
        this.context.arc(x, y, this.bulletRadius, 0, Math.PI * 2, this.counterclockwise);

        // setting gradient
        var radgrad = this.context.createRadialGradient(x, y, 0, x, y, this.bulletRadius);
        radgrad.addColorStop(0, '#eee');
        radgrad.addColorStop(1, '#777');
        this.context.fillStyle = radgrad;

        // setting shadow properties
        this.context.shadowOffsetX = this.bulletRadius * 0.5;
        this.context.shadowOffsetY = this.bulletRadius * 0.5;
        this.context.shadowBlur = this.bulletRadius * 0.5;
        this.context.shadowColor = "rgba(0, 0, 0, 0.6)";

        this.context.fill();
        this.context.closePath();
    }

    this.context.restore();
}

CChart.Line.prototype.DrawTexts = function () {
    // lower values texts
    var fontSize = this.plotHeight * 0.06;
    if (fontSize < 10)
        fontSize = 10;

    this.context.font = fontSize + "px " + this.fontFamily;
    this.context.fillStyle = this.axisFontColor;
    this.context.fillText(this.options.rangeFrom, this.plotStartX - (this.context.measureText(this.options.rangeFrom).width + this.padding * 0.1), (this.plotStartY + this.plotHeight) + (this.padding * 0.1));
    this.context.fillText(this.options.rangeTo, this.plotStartX - (this.context.measureText(this.options.rangeTo).width + this.padding * 0.1), this.plotStartY + (this.padding * 0.3));
    //this.context.fillText("1/1/2011", (this.plotStartX + this.plotWidth) - this.context.measureText("1/1/2011").width, (this.plotStartY + this.plotHeight) + (this.padding * 0.4));

    if (this.options.titleVisibility != null && !this.options.titleVisibility)
        return;

    // upper texts
    var txtX = this.plotStartX + (this.plotWidth * 0.02);
    var txtY = this.plotStartY - (this.plotHeight * 0.15);
    this.context.fillStyle = this.fontColor;
    this.context.fillText(this.options.title + "  |  ", txtX, txtY);
    this.context.fillText(this.options.chartName, txtX, txtY + fontSize * 1.2);

    this.context.fillStyle = this.colorGreen;
    this.context.fillText(35, txtX + this.context.measureText(this.options.title + "  |  ").width, txtY);
}

CChart.Line.prototype.DrawValueIcons = function () {
    var icoXPosFactor = (this.context.measureText(this.options.title + "  |  " + this.options.value).width);

    var icoCenterX = this.plotStartX + (this.plotWidth * 0.02) + icoXPosFactor + this.plotHeight * 0.06;
    var icoCenterY = this.plotStartY - (this.plotHeight * 0.18);

    var arrowSize = this.plotHeight * 0.06;
    var icon = new CChart.Icon(this.context);
    icon.trend(icoCenterX, icoCenterY, arrowSize, this.options.trend);

    var icoRadius = this.plotHeight * 0.04;
    icoCenterX += arrowSize * 2;
    icoCenterY = this.plotStartY - (this.plotHeight * 0.175);
    
    icon.status(icoCenterX, icoCenterY, icoRadius, this.options.status);
}

CChart.Line.prototype.CalculateValues = function () {
    var total = this.options.rangeTo - this.options.rangeFrom;

    // percentage of areas
    var ranges = new Array();
    for (var i = 0; i < this.options.ranges.length; i++) {
        ranges.push({
            fromValue: this.options.ranges[i].from,
            toValue: this.options.ranges[i].to,
            rangePercentile: Math.round(((this.options.ranges[i].to - this.options.ranges[i].from) * 100) / total),
            fromPercentile: Math.round(((this.options.ranges[i].from - this.options.rangeFrom)* 100) / total),
            toPercentile: Math.round(((this.options.ranges[i].to - this.options.rangeFrom) * 100) / total),
            color: this.options.ranges[i].color
        });
    }

    return ranges;
}

CChart.Line.prototype.CreateCanvas = function () {
    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute("width", this.options.width);
    this.canvas.setAttribute("height", this.options.height);
    if (this.options.container != null)
        this.options.container.appendChild(this.canvas);
    else
        document.body.appendChild(this.canvas);
}

CChart.Line.prototype.CreateTooltips = function () {
    var fontSize = this.plotHeight * 0.07;
    if (fontSize < 10)
        fontSize = 10;

    // measuring text length
    this.context.save();
    this.context.font = fontSize + "px " + this.fontFamily;

    var items = this.options.axisValues;
    for (var i = 0; i < items.length; i++) {
        var itemId = "cchart-tooltip-" + Math.floor(Math.random() * 10000) + "-" + Math.round(items[i].canvasX) + "-" + Math.round(items[i].canvasY);
        var cssMap = {
            'position': 'absolute',
            'top': (items[i].canvasY + $(this.canvas).offset().top - (fontSize * 2.3)) + 'px',
            'left': (items[i].canvasX + $(this.canvas).offset().left - (this.context.measureText(items[i].tooltip).width * 0.5)) + 'px',
            'background-color': CChart.Color.lightGrey,
            'padding': '3px',
            'font-family': this.fontFamily,
            'font-size': fontSize + 'px',
            'font-weight': 'bold',
            'color': this.fontColor,
            'text-align': 'center',
            'border': '1px solid ' + this.fontColor,
            '-moz-border-radius': '5px',
            '-webkit-border-radius': '5px',
            'border-radius': '5px',
            'display': 'none'
        }

        $("<div/>")
            .css(cssMap)
            .attr("id", itemId)
            .appendTo((this.options.container ? this.options.container : document.body))
            .text(items[i].tooltip)
            .bind("tap", function () {
                $(this).hide();
            });

        items[i].tooltipDivId = itemId;
    }
    this.context.restore();
}