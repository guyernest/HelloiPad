if (typeof (CChart) == 'undefined') CChart = {};

$(document).bind("mobileinit", function () {
    //apply overrides here
});
$(document).ready(function () {
    CChart.List.prototype.cacheTemplates();
});

var cchartOptions;
CChart.List = function (options) {
    cchartOptions = options;

    $('#cchart-list-btnall').live('click tap', function () {
        CChart.List.prototype.toggleFilterButtons($(this));
        CChart.List.prototype.Parse();
    });
    $('#cchart-list-btnerror').live('click tap', function () {
        CChart.List.prototype.toggleFilterButtons($(this));
        CChart.List.prototype.Parse(CChart.Status.error); 
    });
    $('#cchart-list-btnwarning').live('click tap', function () {
        CChart.List.prototype.toggleFilterButtons($(this));
        CChart.List.prototype.Parse(CChart.Status.warning); 
    });
}

CChart.List.prototype.cacheTemplates = function () {
    // Compile inline templates as a named templates
    tmplList = $("#tmplList").template();
}

CChart.List.prototype.Parse = function (status) {
    if (status == null)
        status = CChart.Status.ok;

    // clone array
    var rows = eval(JSON.stringify(cchartOptions.rows));
    var items = null;
    if (status != CChart.Status.ok) {
        rows = $.grep(rows, function (row) {
            row.items = $.grep(row.items, function (item) {
                return (item.status == status);
            });

            if (row.items.length > 0)
                return row;
            else
                return null;
        });
    }

    $('#cchart-list-content').html($.tmpl(tmplList, rows));
}

CChart.List.prototype.toggleFilterButtons = function (activeBtn) {
    $('.iconeMenu').children('li').each(function () {
       $(this).removeClass('active');
    });

    activeBtn.addClass('active');
}