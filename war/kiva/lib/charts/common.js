if (typeof (CChart) == 'undefined') CChart = {};

CChart.Color = {
    green: "#4FA254",
    orange: "#E3962B",
    red: "#9E1E1E",
    darkGrey: "#333",
    lightGrey: "#eee"
};

// values for drawing trend arrow (up/down). Values 0, 0.5, 1, 1.5 are values for rotation. "same" trend means the trend hasn't changed and the actual icon to be drawn is "-" and not arrow
CChart.Trend = {
    up: 0.5,
    down: 1.5,
    same: 0
};

// values for drawing status icon
CChart.Status = {
    ok: 1,
    warning: 2,
    error: 3
};

CChart.Icon = function (context) {
    this.context = context;
};

CChart.Icon.prototype.trend = function (x, y, size, trend) {

    if(size < 8)
        size = 8;

    if (trend == CChart.Trend.same) {
        this.trendSame(x - (size / 2), y, size);
        return;
    }

    var arrowWidth = size;
    var arrowHeight = arrowWidth;

    this.context.save();
    this.context.beginPath();

    // setting shadow properties
//    this.context.shadowOffsetX = arrowWidth * 0.3;
//    this.context.shadowOffsetY = arrowWidth * 0.3;
//    this.context.shadowBlur = arrowWidth * 0.3;
//    this.context.shadowColor = "rgba(0, 0, 0, 0.5)";

    // moving coordinate system to the point where we want to draw arrow
    this.context.translate(x, y);
    // rotating the arrow to the correct angle
    this.context.rotate(Math.PI * trend);

    // the arrow is drawn around 0,0
    var pointX = 0 - (arrowWidth / 2);
    var pointY = 0;

    // moving to starting point
    this.context.moveTo(pointX, pointY);

    // drawing the arrow
    this.context.lineTo((pointX = (pointX + arrowWidth * 0.8)), (pointY = (pointY - arrowHeight / 2)));   //  /
    this.context.lineTo(pointX, (pointY = (pointY + arrowHeight / 4)));     // |
    this.context.lineTo((pointX = (pointX + arrowWidth * 0.3)), pointY);    // ->
    this.context.lineTo(pointX, (pointY = (pointY + arrowHeight / 2)));     // |
    this.context.lineTo((pointX = (pointX - arrowWidth * 0.3)), pointY);    // <-
    this.context.lineTo(pointX, (pointY = (pointY + arrowHeight / 4)));     // |
    this.context.lineTo(0 - (arrowWidth / 2), 0);   //  \

    this.context.strokeStyle = CChart.Color.darkGrey;
    this.context.stroke();
    this.context.closePath();
    this.context.restore();
};

CChart.Icon.prototype.trendSame = function (x, y, size) {
    this.context.save();
    this.context.beginPath();

    // setting shadow properties
//    this.context.shadowOffsetX = size * 0.3;
//    this.context.shadowOffsetY = size * 0.3;
//    this.context.shadowBlur = size * 0.3;
//    this.context.shadowColor = "rgba(0, 0, 0, 0.5)";

    this.context.strokeStyle = CChart.Color.darkGrey;
    this.context.strokeRect(x, y, size, size / 4);

    this.context.closePath();
    this.context.restore();
};

CChart.Icon.prototype.status = function (x, y, radius, status) {
    switch (status) {
        case CChart.Status.ok:
            this.statusOk(x, y, radius);
            break;
        case CChart.Status.warning:
            this.statusWarning(x, y, radius);
            break;
        case CChart.Status.error:
            this.statusError(x, y, radius);
            break;
    }
};
CChart.Icon.prototype.statusOk = function (x, y, radius) {
    var icoCenterX = x;
    var icoCenterY = y;
    var icoRadius = radius < 5 ? 5 : radius;

    this.context.save();
    this.context.beginPath();

    // setting gradient
    var radgrad = this.context.createRadialGradient(icoCenterX, icoCenterY, 0, icoCenterX, icoCenterY, icoRadius);
    radgrad.addColorStop(0, "#99cc99");
    radgrad.addColorStop(1, '#336633');

    // setting shadow properties
    this.context.shadowOffsetX = 0;
    this.context.shadowOffsetY = 0;
    this.context.shadowBlur = icoRadius * 0.3;
    this.context.shadowColor = "rgba(0, 0, 0, 0.5)";

    this.context.arc(icoCenterX, icoCenterY, icoRadius, 0, Math.PI * 2, false);
    this.context.fillStyle = radgrad;
    this.context.fill();
    this.context.closePath();
    this.context.restore();

    // 'v' icon
    this.context.save();
    this.context.beginPath();
    this.context.lineWidth = icoRadius * 0.3;
    this.context.strokeStyle = "#fff";
    this.context.moveTo(icoCenterX - (icoRadius / 2), icoCenterY - (icoRadius * 0.05));
    this.context.lineTo(icoCenterX - (icoRadius * 0.1), icoCenterY + (icoRadius / 3));
    this.context.lineTo(icoCenterX + (icoRadius / 2), icoCenterY - (icoRadius / 3));
    this.context.stroke();
    this.context.closePath();
    this.context.restore();
};

CChart.Icon.prototype.statusWarning = function (x, y, radius) {
    this.context.save();
    this.context.beginPath();

    var icoCenterX = x;
    var icoCenterY = y;
    var icoSize = radius;

    this.context.save();
    this.context.beginPath();

    // setting gradient
    var radgrad = this.context.createRadialGradient(icoCenterX, icoCenterY, 0, icoCenterX, icoCenterY, icoSize);
    radgrad.addColorStop(0, "#ffcc66");
    radgrad.addColorStop(1, '#cc9933');

    // setting shadow properties
    this.context.shadowOffsetX = 0;
    this.context.shadowOffsetY = 0;
    this.context.shadowBlur = icoSize * 0.3;
    this.context.shadowColor = "rgba(0, 0, 0, 0.5)";

    this.context.fillStyle = radgrad;

    this.context.moveTo(icoCenterX, icoCenterY - (icoSize * 0.8));
    this.context.lineTo(icoCenterX + icoSize, icoCenterY + icoSize);
    this.context.lineTo(icoCenterX - icoSize, icoCenterY + icoSize);
    this.context.fill();

    // '!' icon
    this.context.save();
    this.context.beginPath();
    this.context.lineWidth = icoSize * 0.25;
    this.context.strokeStyle = "#fff";
    this.context.moveTo(icoCenterX, icoCenterY - (icoSize * 0.25));
    this.context.lineTo(icoCenterX, icoCenterY + (icoSize * 0.55));
    this.context.moveTo(icoCenterX, icoCenterY + (icoSize * 0.65));
    this.context.lineTo(icoCenterX, icoCenterY + (icoSize * 0.85));
    this.context.stroke();
    this.context.closePath();
    this.context.restore();

    this.context.closePath();
    this.context.restore();
};

CChart.Icon.prototype.statusError = function (x, y, radius) {
    var icoCenterX = x;
    var icoCenterY = y;
    var icoRadius = radius;

    this.context.save();
    this.context.beginPath();

    // setting gradient
    var radgrad = this.context.createRadialGradient(icoCenterX, icoCenterY, 0, icoCenterX, icoCenterY, icoRadius);
    radgrad.addColorStop(0, "#cc6767");
    radgrad.addColorStop(1, '#660000');

    // setting shadow properties
    this.context.shadowOffsetX = 0;
    this.context.shadowOffsetY = 0;
    this.context.shadowBlur = icoRadius * 0.3;
    this.context.shadowColor = "rgba(0, 0, 0, 0.5)";

    this.context.arc(icoCenterX, icoCenterY, icoRadius, 0, Math.PI * 2, false);
    this.context.fillStyle = radgrad;
    this.context.fill();
    this.context.closePath();
    this.context.restore();

    // 'x' icon
    var xFactor = icoRadius * 0.4;
    var yFactor = icoRadius * 0.4;
    this.context.save();
    this.context.beginPath();
    this.context.lineWidth = icoRadius * 0.3;
    this.context.strokeStyle = "#fff";
    this.context.moveTo(icoCenterX - xFactor, icoCenterY - yFactor);
    this.context.lineTo(icoCenterX + xFactor, icoCenterY + yFactor);
    this.context.moveTo(icoCenterX + xFactor, icoCenterY - yFactor);
    this.context.lineTo(icoCenterX - xFactor, icoCenterY + yFactor);
    this.context.stroke();
    this.context.closePath();
    this.context.restore();

    this.context.closePath();
    this.context.restore();
};