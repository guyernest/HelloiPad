if (typeof (CChart) == 'undefined') CChart = {};
CChart.Bar = function (options) {

    this.canvas = null;
    this.animationCanvas = null;
    this.options = options;
    this.CreateCanvas();
    this.CreateAnimationCanvas();

    this.context = this.canvas.getContext ? this.canvas.getContext("2d") : null;
    this.animationContext = this.animationCanvas.getContext ? this.animationCanvas.getContext("2d") : null;

    this.padding = 10;
    this.scaleElements = 60;

    this.colorBg = "#222";
    this.colorBgValues = "#777";
    this.colorGreen = "#4FA254";
    this.colorYellow = "#E3962B";
    this.colorRed = "#9E1E1E";
    this.fontFamily = "Arial";
    this.fontColor = this.options.fontColor ? this.options.fontColor : CChart.Color.darkGrey;
    this.axisFontColor = this.options.axisFontColor ? this.options.axisFontColor : CChart.Color.darkGrey;

    this.barItemHeight = this.canvas.height * 0.2;  //30;
    this.barItemWidth = this.barItemHeight * 0.2; // 4;
    this.barItemSpace = this.barItemWidth * 0.5;   // 1
    this.barValueHeight = this.barItemHeight * 0.7; // 20;

    this.startX = this.padding;
    this.startY = (this.canvas.height - this.barItemHeight) / 2;
    this.endX = (this.barItemWidth + this.barItemSpace) * 60;
    this.centerX = (this.startX + this.endX) / 2;
    this.textPosY = this.startY + (this.barItemHeight * 1.5);

    this.animationPosition = this.options.rangeFrom;
}

CChart.Bar.prototype.Draw = function () {
    this.DrawScale();
    this.DrawTexts();
    if (this.options.titleVisibility == null || this.options.titleVisibility)
        this.DrawValueIcons();
	this.AnimateValue();
}

CChart.Bar.prototype.DrawScale = function () {
    var stepWidth = this.barItemWidth + this.barItemSpace;
    var ranges = this.CalculateValues();

    this.context.save();
    this.context.beginPath();

    // set default color
    if (this.options.defaultColor != null)
        this.context.fillStyle = this.options.defaultColor;
    else
        this.context.fillStyle = CChart.Color.red;

    // draw default-colored chart
    for (var i = 0; i < this.scaleElements; i++)
        this.context.fillRect(this.startX + (i * stepWidth), this.startY, this.barItemWidth, this.barItemHeight);

    // draw ranges
    for (var i = 0; i < ranges.length; i++) {
        this.context.fillStyle = ranges[i].color;
        for (var j = 0; j < ranges[i].rangeElements; j++) {
            var rangeStartX = this.startX + (ranges[i].fromElements * stepWidth);
            this.context.fillRect(rangeStartX + (j * stepWidth), this.startY, this.barItemWidth, this.barItemHeight);
        }
    }
    this.context.closePath();
    this.context.restore();
}

CChart.Bar.prototype.AnimateValue = function () {
    // localizing vars for drawstage
    var animationPosition = this.animationPosition;
    if (!this.options.animation)
        animationPosition = this.options.value;
    var totalScaleElements = this.scaleElements;
    var val = this.options.value;
    var rangeFrom = this.options.rangeFrom;
    var rangeTo = this.options.rangeTo;
    var sy = this.startY;
    var sx = this.startX;
    var biHeight = this.barItemHeight;
    var valueBarHeight = this.barValueHeight;
    var colorBg = this.colorBg;
    var colorBgValue = this.colorBgValues;
    var fontFamily = this.fontFamily;
    var fontSize = biHeight * 0.4;
    if (fontSize < 10)
        fontSize = 10;

    var stepWidth = this.barItemWidth + this.barItemSpace;
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

        // value percentage
        var value = Math.round(((animationPosition - rangeFrom) * 100) / (rangeTo - rangeFrom));
        //scale items
        var itemsValue = Math.round(value * totalScaleElements / 100);
        var valueBarWidth = itemsValue * stepWidth;
        var startYPoint = sy + ((biHeight - valueBarHeight) / 2);

        context.beginPath();

        context.fillStyle = colorBgValue;
        context.strokeStyle = colorBg;
        context.fillRect(sx, startYPoint, valueBarWidth, valueBarHeight);
        context.strokeRect(sx, startYPoint, valueBarWidth, valueBarHeight);
        context.closePath();

        context.beginPath();

        // setting shadow properties
        //        context.shadowOffsetX = biHeight * 0.05;
        //        context.shadowOffsetY = biHeight * 0.05;
        //        context.shadowBlur = biHeight * 0.1;
        //        context.shadowColor = "rgba(0, 0, 0, 0.5)";

        context.fillStyle = "#555";

        var x = sx + valueBarWidth + stepWidth;
        var y = sy - (biHeight * 0.4);
        context.moveTo(x, y);

        // curved handle
        context.quadraticCurveTo(x, y, sx + valueBarWidth - (stepWidth / 2), sy + (biHeight / 2));
        context.quadraticCurveTo(x, y, (x = (sx + valueBarWidth - (stepWidth * 2))), (y = (sy - (biHeight * 0.4))));

        var rectWidth = stepWidth * 5;
        if (rectWidth < 20)
            rectWidth = 20;
        var rectHeight = biHeight * 0.7;
        if (rectHeight < 15)
            rectHeight = 15;
        context.rect(sx + valueBarWidth - (stepWidth * 3), sy - (biHeight * 1.1), rectWidth, rectHeight);

        context.fill();
        context.closePath();

        context.beginPath();
        context.font = "bold " + fontSize + "px " + fontFamily;
        context.fillStyle = CChart.Color.green;

        var rectStartX = ((sx + valueBarWidth) - (stepWidth * 0.5)) - (context.measureText(val).width / 2);
        context.fillText(val, rectStartX, sy - (biHeight * 0.6));
        context.closePath();
    });

    myStage.start();
}

CChart.Bar.prototype.DrawValueBar = function () {
    var stepWidth = this.barItemWidth + this.barItemSpace;
    // value percentage
    var value = Math.round(((this.options.value - this.options.rangeFrom) * 100) / (this.options.rangeTo - this.options.rangeFrom));

    //scale items
    var itemsValue = Math.round(value * this.scaleElements / 100);

    // scale coordinate
    //var coordinateValue = this.startX + ((stepWidth * 60) * (value / 100));

    var valueBarWidth = itemsValue * stepWidth;
    var startY = this.startY + ((this.barItemHeight - this.barValueHeight) / 2);

    this.context.save();
    this.context.beginPath();

    var grad = this.context.createLinearGradient(this.startX, startY, this.startX, this.barValueHeight);
    grad.addColorStop(0, '#555555');
    //grad.addColorStop(0.5, '#777');
    grad.addColorStop(1, '#ffffff');

    this.context.fillStyle = this.colorBgValues;
    this.context.strokeStyle = this.colorBg;
    this.context.fillRect(this.startX, startY, valueBarWidth, this.barValueHeight);
    this.context.strokeRect(this.startX, startY, valueBarWidth, this.barValueHeight);
    this.context.closePath();

    this.context.beginPath();

    // setting shadow properties
    this.context.shadowOffsetX = this.barItemHeight * 0.05;
    this.context.shadowOffsetY = this.barItemHeight * 0.05;
    this.context.shadowBlur = this.barItemHeight * 0.1;
    this.context.shadowColor = "rgba(0, 0, 0, 0.5)";

    this.context.fillStyle = "#555";

    var x = this.startX + valueBarWidth + stepWidth;
    var y = this.startY - (this.barItemHeight * 0.4);
    this.context.moveTo(x, y);

    // curved handle
    this.context.quadraticCurveTo(x, y, this.startX + valueBarWidth - (stepWidth / 2), this.startY + (this.barItemHeight / 2));
    this.context.quadraticCurveTo(x, y, (x = (this.startX + valueBarWidth - (stepWidth * 2))), (y = (this.startY - (this.barItemHeight * 0.4))));

    /*
    // rounded-corner square
    this.context.quadraticCurveTo(x - stepWidth, y, (x = (x - (stepWidth * 0.7))), (y = (y - stepWidth * 1.2)));
    this.context.lineTo(x, (y = (y - (stepWidth * 0.2))));
    this.context.quadraticCurveTo(x, y - (stepWidth * 1.1), (x = (x + (stepWidth * 0.7))), (y = (y - (stepWidth * 1.2))));
    this.context.lineTo((x = (x + (stepWidth * 4))), y);
    this.context.quadraticCurveTo(x + stepWidth, y, (x = (x + (stepWidth * 0.7))), (y = (y + (stepWidth * 1.2))));
    this.context.lineTo(x, (y = (y + (stepWidth * 0.2))));
    this.context.quadraticCurveTo(x, y + (stepWidth * 1.1), (x = (x - (stepWidth * 0.7))), (y = (y + stepWidth * 1.2)));

    this.context.fill();
    this.context.closePath();
    */

    // handle
    //    this.context.moveTo(this.startX + valueBarWidth - (stepWidth / 2), this.startY + (this.barItemHeight / 2));
    //    this.context.lineTo(this.startX + valueBarWidth + stepWidth, this.startY - (this.barItemHeight * 0.4));
    //    this.context.lineTo(this.startX + valueBarWidth - (stepWidth * 2), this.startY - (this.barItemHeight * 0.4));

    this.context.rect(this.startX + valueBarWidth - (stepWidth * 3), this.startY - (this.barItemHeight * 1.1), stepWidth * 5, this.barItemHeight * 0.7);

    //    // setting shadow properties
    //    this.context.shadowOffsetX = this.barItemHeight * 0.05;
    //    this.context.shadowOffsetY = this.barItemHeight * 0.05;
    //    this.context.shadowBlur = this.barItemHeight * 0.1;
    //    this.context.shadowColor = "rgba(0, 0, 0, 0.5)";

    //    this.context.fillStyle = "#555";
    this.context.fill();
    this.context.closePath();

    var fontSize = this.barItemHeight * 0.4;
    if (fontSize < 10)
        fontSize = 10;

    this.context.beginPath();
    this.context.font = "bold " + fontSize + "px " + this.fontFamily;
    this.context.fillStyle = CChart.Color.green;

    var rectStartX = ((this.startX + valueBarWidth) - (stepWidth * 0.5)) - (this.context.measureText(this.options.value).width / 2);
    this.context.fillText(this.options.value, rectStartX, this.startY - (this.barItemHeight * 0.6));
    this.context.closePath();

    this.context.restore();
}

CChart.Bar.prototype.DrawTexts = function () {
    var fontSize = this.barItemHeight * 0.5;
    if (fontSize < 10)
        fontSize = 10;

    var txtY = this.textPosY
    if (txtY < 40)
        txtY = 40;

    this.context.beginPath();
    // lower values texts
    this.context.font = fontSize + "px " + this.fontFamily;
    this.context.fillStyle = this.axisFontColor;
    this.context.fillText(this.options.rangeFrom, this.startX, txtY);
    this.context.fillText(this.options.rangeTo, this.startX + (this.endX - this.context.measureText(this.options.rangeTo).width), txtY);
    this.context.closePath();

    if (this.options.titleVisibility != null && !this.options.titleVisibility)
        return;

    this.context.beginPath();
    this.context.fillStyle = this.fontColor;
    this.context.fillText(this.options.chartName, this.centerX - (this.context.measureText(this.options.chartName).width / 2), this.textPosY * 1.2);
    this.context.closePath();
}

CChart.Bar.prototype.DrawValueIcons = function () {
    var icoXPosFactor = (this.context.measureText(this.options.chartName).width * 0.7);

    var icoCenterX = this.centerX + icoXPosFactor;
    var icoCenterY = this.textPosY * 1.15;
    var icoRadius = this.barItemHeight * 0.3;

    var icon = new CChart.Icon(this.context);
    icon.status(icoCenterX, icoCenterY, icoRadius, this.options.status);

    icoCenterX = this.centerX - (icoXPosFactor * 0.9);
    icon.trend(icoCenterX, icoCenterY * 0.98, this.barItemHeight * 0.4, this.options.trend);
}

CChart.Bar.prototype.CalculateValues = function () {
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

CChart.Bar.prototype.CreateCanvas = function () {
    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute("width", this.options.width);
    this.canvas.setAttribute("height", this.options.height);
    if (this.options.container != null)
        this.options.container.appendChild(this.canvas);
    else
        document.body.appendChild(this.canvas);
}

CChart.Bar.prototype.CreateAnimationCanvas = function () {
    this.animationCanvas = document.createElement('canvas');
    this.animationCanvas.setAttribute("width", this.canvas.clientWidth);
    this.animationCanvas.setAttribute("height", this.canvas.clientHeight);
    this.animationCanvas.setAttribute("style", "background:transparent;position:absolute;top:" + this.canvas.offsetTop + "px;left:" + this.canvas.offsetLeft + "px");
    if (this.options.container != null)
        this.options.container.appendChild(this.animationCanvas);
    else
        document.body.appendChild(this.animationCanvas);
}