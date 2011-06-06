if (typeof (CChart) == 'undefined') CChart = {};
CChart.Gauge = function (options) {
    this.canvas = null;
    this.animationCanvas = null;
    this.options = options;
    this.CreateCanvas();
    this.CreateAnimationCanvas();

    this.context = this.canvas.getContext ? this.canvas.getContext("2d") : null;
    this.animationContext = this.animationCanvas.getContext ? this.animationCanvas.getContext("2d") : null;

    this.padding = 10;
    this.counterclockwise = false;
    this.gaugeStart = 0.9;
    this.gaugeEnd = 0.1;
    this.squareWidth = 0.01;
    this.stepWidth = 0.01;
    this.animationPosition = this.options.rangeFrom;

    this.colorBg = "#222";
    this.colorBgValues = "#333";
    this.colorGreen = "#4FA254";
    this.colorYellow = "#E3962B";
    this.colorRed = "#9E1E1E";
    this.fontFamily = "Arial";
    this.fontColor = this.options.fontColor ? this.options.fontColor : CChart.Color.darkGrey;
    this.axisFontColor = this.options.axisFontColor ? this.options.axisFontColor : CChart.Color.darkGrey;

    this.centerX = this.canvas.width / 2;
    this.centerY = (this.canvas.height / 2) + this.padding;
    this.radius = this.canvas.width > this.canvas.height ? (this.canvas.height / 2) - (this.padding * 2) : (this.canvas.width / 2) - (this.padding * 2);
    this.lineWidth = this.radius * 0.1;
    // the "2" of "this.gaugeEnd + 2" is the "2" from "PI * 2"
    this.scaleElements = Math.round((((this.gaugeEnd + 2 + this.stepWidth) - this.gaugeStart) / this.stepWidth) / 2);
}

CChart.Gauge.prototype.Draw = function () {
    this.DrawBg();
    this.DrawScale();
    this.DrawTexts();
    if (this.options.titleVisibility == null || this.options.titleVisibility)
        this.DrawValueIcons();

    this.AnimateValueArrow();
    //this.DrawValueArrow();
}

CChart.Gauge.prototype.DrawScale = function () {
    var startAngle = this.gaugeStart;
    var endAngle = startAngle + this.squareWidth;
    var ranges = this.CalculateValues();

    this.context.save();

    this.context.lineWidth = this.lineWidth;

    // set default color
    if (this.options.defaultColor != null)
        this.context.strokeStyle = this.options.defaultColor;
    else
        this.context.strokeStyle = CChart.Color.red;

    // draw default-colored chart
    //while ((startAngle >= 0 && startAngle <= (this.gaugeEnd + this.stepWidth)) || (startAngle >= this.gaugeStart && startAngle >= this.gaugeEnd)) {
    for (var i = 0; i < this.scaleElements; i++) {
        this.context.beginPath();

        // defining colored square
        this.context.arc(this.centerX, this.centerY, this.radius, (startAngle * Math.PI), (endAngle * Math.PI), this.counterclockwise);

        this.context.stroke();
        this.context.closePath();

        startAngle = endAngle + this.stepWidth;
        endAngle = startAngle + this.squareWidth;

        if (startAngle >= 2)
            startAngle = startAngle - 2;

        if (endAngle >= 2)
            endAngle = endAngle - 2;
    }

    this.context.closePath();

    // draw ranges
    startAngle = this.gaugeStart;
    endAngle = startAngle + this.squareWidth;
    //while (count < ranges.length && ((startAngle >= 0 && startAngle <= (this.gaugeEnd + this.stepWidth)) || (startAngle >= this.gaugeStart && startAngle >= this.gaugeEnd))) {
    for (var i = 0; i < ranges.length; i++) {

        startAngle = this.gaugeStart + (ranges[i].fromElements * (this.squareWidth + this.stepWidth));
        endAngle = startAngle + this.squareWidth;

        for (var j = 0; j < ranges[i].rangeElements; j++) {

            this.context.beginPath();

            // defining colored square
            this.context.arc(this.centerX, this.centerY, this.radius, (startAngle * Math.PI), (endAngle * Math.PI), this.counterclockwise);

            this.context.lineWidth = this.lineWidth;
            this.context.strokeStyle = ranges[i].color;

            this.context.stroke();
            this.context.closePath();

            startAngle = endAngle + this.stepWidth;
            endAngle = startAngle + this.squareWidth;

            if (startAngle >= 2)
                startAngle = startAngle - 2;

            if (endAngle >= 2)
                endAngle = endAngle - 2;
        }
    }

    this.context.closePath();
    this.context.restore();
}

CChart.Gauge.prototype.DrawBg = function () {
    this.context.save();

    // bg gauge squares outer
    this.context.beginPath();

    // setting shadow properties
    this.context.shadowOffsetX = 0; // this.lineWidth;
    this.context.shadowOffsetY = 0; // this.lineWidth;
    this.context.shadowBlur = this.lineWidth;
    this.context.shadowColor = "rgba(0, 0, 0, 0.5)";

    this.context.arc(this.centerX, this.centerY, this.radius, (this.gaugeStart - 0.05) * Math.PI, (this.gaugeEnd + 0.05) * Math.PI, this.counterclockwise);
    this.context.lineWidth = this.radius * 0.2;
    this.context.strokeStyle = this.colorBg;
    this.context.stroke();
    this.context.closePath();
    this.context.restore();

    // bg gauge squares inner
    this.context.beginPath();

    // setting shadow properties
//    this.context.shadowOffsetX = 0; // this.lineWidth;
//    this.context.shadowOffsetY = 0; // this.lineWidth;
//    this.context.shadowBlur = this.lineWidth;
//    this.context.shadowColor = "rgba(0, 0, 0, 0.5)";

    this.context.arc(this.centerX, this.centerY, this.radius, (this.gaugeStart - 0.04) * Math.PI, (this.gaugeEnd + 0.04) * Math.PI, this.counterclockwise);
    this.context.fillStyle = this.colorBg;
    this.context.fill();
    this.context.closePath();

    // bg center circle large
    this.context.save();
    this.context.beginPath();

    // setting shadow properties
    this.context.shadowOffsetX = 0; // this.lineWidth;
    this.context.shadowOffsetY = 0;// this.lineWidth;
    this.context.shadowBlur = this.lineWidth;
    this.context.shadowColor = "rgba(0, 0, 0, 0.5)";

    this.context.arc(this.centerX, this.centerY, this.radius * 0.7, 0, Math.PI * 2, this.counterclockwise);
    this.context.fillStyle = this.colorBg;
    this.context.fill();
    this.context.closePath();
    this.context.restore();

    // bg center circle value
    this.context.save();
    this.context.beginPath();

    // setting shadow properties
    this.context.shadowOffsetX = 0; // this.lineWidth;
    this.context.shadowOffsetY = 0; // this.lineWidth;
    this.context.shadowBlur = this.lineWidth;
    this.context.shadowColor = "rgba(0, 0, 0, 0.5)";

    this.context.arc(this.centerX, this.centerY, this.radius * 0.6, 0, Math.PI * 2, this.counterclockwise);
    this.context.fillStyle = this.colorBgValues;
    this.context.fill();
    this.context.closePath();
    this.context.restore();
}

CChart.Gauge.prototype.DrawTexts = function () {
    // central circle value text
    this.context.font = "bold " + this.radius * 0.25 + "px " + this.fontFamily;
    this.context.fillStyle = this.colorGreen;
    this.context.fillText(this.options.value, this.centerX - (this.context.measureText(this.options.value).width / 2), this.centerY - (this.radius * 0.15));
    this.context.fillText(this.options.valueTitle, this.centerX - (this.context.measureText(this.options.valueTitle).width / 2), this.centerY + (this.radius * 0.15));

    var fontSize = this.radius * 0.15;
    if (fontSize < 10)
        fontSize = 10;

    // lower values texts
    this.context.font = fontSize + "px " + this.fontFamily;
    this.context.fillStyle = this.axisFontColor;
    this.context.fillText(this.options.rangeFrom, this.centerX - this.radius, this.centerY + (this.radius * 0.65));
    this.context.fillText(this.options.rangeTo, this.centerX + this.radius - this.context.measureText(this.options.rangeTo).width, this.centerY + (this.radius * 0.65));

    if (this.options.titleVisibility != null && !this.options.titleVisibility)
        return;

    this.context.fillStyle = this.fontColor;
    this.context.fillText(this.options.chartName, this.centerX - (this.context.measureText(this.options.chartName).width / 2), this.centerY + (this.radius * 0.95));
}

CChart.Gauge.prototype.AnimateValueArrow = function () {
    // localizing vars for drawstage
    var animationPosition = this.animationPosition;
    if (!this.options.animation)
        animationPosition = this.options.value;
    var rangeFrom = this.options.rangeFrom;
    var rangeTo = this.options.rangeTo;
    var gStart = this.gaugeStart;
    var centerX = this.centerX;
    var centerY = this.centerY;
    var radius = this.radius;
    var lineWidth = this.lineWidth;
    var stepWidth = this.stepWidth;
    var val = this.options.value;

    var animationDone = false;
    var myStage = new Kinetic.Stage(this.animationCanvas, 50);
    myStage.setUpdateStage(function () {
        if (animationPosition < val && !animationDone) {
            animationPosition += 2;
        } else {
            animationDone = true;
            myStage.stop();
        }
    });
    myStage.setDrawStage(function () {
        var context = myStage.getContext();
        var value = (animationPosition - rangeFrom) / (rangeTo - rangeFrom);

        var angleFactor = Math.PI;

        if (value != 0.5)
            angleFactor *= gStart;

        var arrowStart = value < 0.5 ? (value * Math.PI) + angleFactor : (value * Math.PI) - angleFactor;

        // Draw the triangular arrow head
        context.beginPath();

        // setting shadow properties
        //        context.shadowOffsetX = 0;
        //        context.shadowOffsetY = 0;
        //        context.shadowBlur = lineWidth;
        //        context.shadowColor = "rgba(0, 0, 0, 0.5)";

        context.fillStyle = "#888";
        context.lineWidth = lineWidth;

        // line to the center of radius
        //this.context.moveTo(this.centerx, this.centery);

        // arrow triangle's pointer
        context.arc(centerX, centerY, (radius * 0.9), arrowStart, arrowStart + 0.001, false);

        // arrow triangle
        context.arc(centerX, centerY, (radius * 0.78), arrowStart + 0.109, arrowStart + 0.109999, false);
        context.arc(centerX, centerY, (radius * 0.78), arrowStart - 0.109, arrowStart - 0.109999, true);

        context.fill();
        context.closePath();

        // draw arrow handle
        var handleStart = arrowStart - ((stepWidth * 12) / 2);
        context.beginPath();
        context.arc(centerX, centerY, radius * 0.77, handleStart, handleStart + (stepWidth * 12), false);
        context.lineWidth = lineWidth * 1.2;  // this.lineWidth * 1.3;
        context.strokeStyle = "#888";
        context.stroke();
        context.closePath();
    });
    myStage.start();
}

CChart.Gauge.prototype.DrawValueArrow = function () {

    this.context.save();

    var value = (this.options.value - this.options.rangeFrom) / (this.options.rangeTo - this.options.rangeFrom);

    var angleFactor = Math.PI;

    if (value != 0.5)
        angleFactor *= this.gaugeStart;

    var arrowStart = value < 0.5 ? (value * Math.PI) + angleFactor : (value * Math.PI) - angleFactor;

    // Draw the triangular arrow head
    this.context.beginPath();

    // setting shadow properties
    this.context.shadowOffsetX = 0;
    this.context.shadowOffsetY = 0;
    this.context.shadowBlur = this.lineWidth;
    this.context.shadowColor = "rgba(0, 0, 0, 0.5)";

    this.context.fillStyle = "#888";
    this.context.lineWidth = this.lineWidth;

    // line to the center of radius
    //this.context.moveTo(this.centerx, this.centery);

    // arrow triangle's pointer
    this.context.arc(this.centerX, this.centerY, (this.radius * 0.9), arrowStart, arrowStart + 0.001, false);

    // arrow triangle
    this.context.arc(this.centerX, this.centerY, (this.radius * 0.78), arrowStart + 0.109, arrowStart + 0.109999, false);
    this.context.arc(this.centerX, this.centerY, (this.radius * 0.78), arrowStart - 0.109, arrowStart - 0.109999, true);

    /*
    // arrow triangle's pointer
    this.context.arc(this.centerX, this.centerY, (this.radius * 0.9), arrowStart, arrowStart + 0.001, false);

    // arrow triangle
    this.context.arc(this.centerX, this.centerY, (this.radius * 0.68), arrowStart + 0.087, arrowStart + 0.087999, false);
    this.context.arc(this.centerX, this.centerY, (this.radius * 0.68), arrowStart - 0.087, arrowStart - 0.087999, true);
    */

    this.context.fill();
    this.context.closePath();
    this.context.restore();

    this.context.save();
    // draw arrow handle
    var handleStart = arrowStart - ((this.stepWidth * 12) / 2);
    this.context.beginPath();
    this.context.arc(this.centerX, this.centerY, this.radius * 0.77, handleStart, handleStart + (this.stepWidth * 12), this.counterclockwise);
    //this.context.arc(this.centerX, this.centerY, this.radius * 0.67, handleStart, handleStart + (this.stepWidth * 10), this.counterclockwise);
    this.context.lineWidth = this.lineWidth * 1.2;  // this.lineWidth * 1.3;
    this.context.strokeStyle = "#888";
    this.context.stroke();
    this.context.closePath();

    this.context.restore();
}

CChart.Gauge.prototype.DrawValueIcons = function () {

    var icoCenterX = this.centerX + (this.context.measureText(this.options.chartName).width * 0.7);
    var icoCenterY = this.centerY + (this.radius * 0.9);
    var icoRadius = this.lineWidth * 0.7;

    var icon = new CChart.Icon(this.context);
    icon.status(icoCenterX, icoCenterY, icoRadius, this.options.status);

    icoCenterX = this.centerX - (this.context.measureText(this.options.chartName).width * 0.7);
    icon.trend(icoCenterX, icoCenterY, this.lineWidth, this.options.trend);
}

CChart.Gauge.prototype.CalculateValues = function () {
    var total = this.options.rangeTo - this.options.rangeFrom;

    // percentage of areas
    var ranges = new Array();
    for (var i = 0; i < this.options.ranges.length; i++) {
        var rangePercentile = Math.round(((this.options.ranges[i].to - this.options.ranges[i].from) * 100) / total);
        var fromPercentile = Math.round(((this.options.ranges[i].from - this.options.rangeFrom) * 100) / total);
        var toPercentile = Math.round(((this.options.ranges[i].to - this.options.rangeFrom) * 100) / total);
        ranges.push({
            // original range values
            fromValue: this.options.ranges[i].from,
            toValue: this.options.ranges[i].to,
            // calculated range percentiles
            rangePercentile: rangePercentile,
            fromPercentile: fromPercentile,
            toPercentile: toPercentile,
            // calculated range elements to be drawn on chart's scale
            rangeElements: Math.round(rangePercentile * this.scaleElements / 100),
            fromElements: Math.round(fromPercentile * this.scaleElements / 100),
            toElements: Math.round(toPercentile * this.scaleElements / 100),
            color: this.options.ranges[i].color
        });
    }

    return ranges;
}

CChart.Gauge.prototype.CreateCanvas = function () {
    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute("width", this.options.width);
    this.canvas.setAttribute("height", this.options.height);
    if (this.options.container != null)
        this.options.container.appendChild(this.canvas);
    else
        document.body.appendChild(this.canvas);
}

CChart.Gauge.prototype.CreateAnimationCanvas = function () {
    this.animationCanvas = document.createElement('canvas');
    this.animationCanvas.setAttribute("width", this.canvas.clientWidth);
    this.animationCanvas.setAttribute("height", this.canvas.clientHeight);
    this.animationCanvas.setAttribute("style", "background:transparent;position:absolute;top:" + this.canvas.offsetTop + "px;left:" + this.canvas.offsetLeft + "px");
    if (this.options.container != null)
        this.options.container.appendChild(this.animationCanvas);
    else
        document.body.appendChild(this.animationCanvas);
}