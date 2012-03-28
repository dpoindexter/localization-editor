var Editor = {};

var ViewData = {
    tableEl: $("#list-resources"),
    columns: bootstrap.columns,
    resources: bootstrap.resources
};



var Util = {
    sortingFunctions: [[    
        //String Ascending
        function (str) {
            return (str || "").toLowerCase();
        },
        //Number Ascending
        function (num) {
            return num;
        },
        //Date Ascending
        function (date) {
            return new Date(date).valueOf();
        }
    ],[
        //String Descending
        function (str) {
            //Empty strings should be sorted last
            if (!str || str === "")
                return String.fromCharCode(0xffff);

            return String.fromCharCode.apply(String,
                _.map(str.toLowerCase().split(""), function (c) {
                    return 0xffff - c.charCodeAt();
                })
            );
        },
        //Number Descending
        function (num) {
            return -num;
        },
        //Date Descending
        function (date) {
            return -new Date(date).valueOf();
        }
    ]],

    jsonToDate: function (dateString) {
        return new Date(parseInt(dateString.substr(6)))
    }
}

//Columns
Editor.Column = Backbone.Model.extend();

Editor.ColumnGroup = Backbone.Collection.extend({
    model: Editor.Column,

    getEnabledAndVisibleColumnNames: function () {
        var enabled = this.filter(function (model) { return model.get("Enabled") && model.get("Visible"); });
        return _.map(enabled, function (col) { return col.get("ColumnName") });
    }
});

Editor.HeaderRow = Backbone.View.extend({
    tagName: "tr",
    template: _.template($("#listing-header").html()),

    initialize: function () {
        _.bindAll(this, "render");
    },

    render: function () {
        var self = this;
        this.collection.each(function (col) {
            if (col.get("Enabled") && col.get("Visible"))
                $(self.template(col.toJSON())).appendTo(self.el);
        });
        return this;
    }

});

Editor.ColumnPicker = Backbone.View.extend({
    template: _.template($("#column-picker").html()),

    initialize: function () {
        _.bindAll(this, "render", "toggle");
    },

    events: {
        "click input:checkbox": "toggle"
    },

    toggle: function (event) {
        var id = $(event.target).data("el");
        var col = this.collection.get(id);

        if (!event.shiftKey || !lastSelected) {
            lastSelected = col;
            col.set({ "Enabled": event.target.checked });
        } else {
            var self = this;
            var start = Math.min(lastSelected.id, col.id);
            var end = Math.max(lastSelected.id, col.id) + 1;
            _(_.range(start, end)).each(function (id) {
                var c = self.collection.get(id);
                c.set({ "Enabled": event.target.checked }, { silent: true });
            });
            this.collection.trigger("change:Enabled");
            lastSelected = col;
        }
    },

    render: function () {
        var self = this;
        this.collection.each(function (col, i) {
            if (col.get("Visible"))
                $(self.template(col.toJSON())).appendTo(self.el);
        });
        return this;
    }
});

//Resource
Editor.Resource = Backbone.Model.extend({});

Editor.ResourceCollection = Backbone.Collection.extend({
    model: Editor.Resource,
    url: "/resources"
});

Editor.ResourceRow = Backbone.View.extend({
    tagName: "tr",
    template: _.template($("#resource-row").html()),

    initialize: function () {
        _.bindAll(this, "render");
    },

    render: function (cols) {
        $(this.template({ cols: cols, cells: this.model.toJSON() })).appendTo(this.el);
        return this;
    }
});

//Editor
Editor.EditorView = Backbone.View.extend({
    el: ViewData.tableEl,
    thead: ViewData.tableEl.children("thead"),
    tbody: ViewData.tableEl.children("tbody"),
    cpicker: $("#columns"),

    initialize: function () {
        _.bindAll(this, "render", "changeSort", "sort");

        this.resources = new Editor.ResourceCollection(ViewData.resources);
        this.columns = new Editor.ColumnGroup(ViewData.columns);

        this.resources.bind("change", this.render);
        this.resources.bind("reset", this.render);
        this.columns.bind("change:Enabled", this.render);
        this.columns.bind("change:IsBeingSortedOn", this.sort);
        this.columns.bind("change:SortDirection", this.sort);

        this.sort();
    },

    events: {
        "click th": "changeSort"
    },

    changeSort: function (event) {
        var sortColumn = this.columns.get($(event.target).data("id"));
        var isBeingSortedOn = sortColumn.get("IsBeingSortedOn");

        if (isBeingSortedOn) { //If the column is already being sorted on, flip the sort direction
            var sortDirection = (sortColumn.get("SortDirection") === 0) ? 1 : 0;
            sortColumn.set({ SortDirection: sortDirection });
        } else { //If it's not being sorted on, unmark the previous sort column and mark the current one, setting the sort order to ascending
            var previousSort = this.columns.find(function (col) {
                return col.get("IsBeingSortedOn");
            });
            previousSort && previousSort.set({ IsBeingSortedOn: false }, { silent: true });
            sortColumn.set({ SortDirection: 0 }, { silent: true })
            sortColumn.set({ IsBeingSortedOn: true });
        }
    },

    sort: function () {
        console.log("here");
        var sortColumn = this.columns.find(function (col) {
            return !_.isNull(col.get("SortDirection"));
        });

        this.resources.comparator = function (req) {
            return Util.sortingFunctions[sortColumn.get("SortDirection")][sortColumn.get("SortType") || 0](req.get(sortColumn.get("ColumnName")));
        };
        this.resources.sort();
    },

    render: function () {
        this.appendColumnPickers(this.columns);
        this.appendColumnHeaders(this.columns);
        this.appendResources(this.resources, this.columns.getEnabledAndVisibleColumnNames());
    },

    appendColumnPickers: function (cols) {
        var picker = new Editor.ColumnPicker({ collection: cols });
        this.cpicker.empty();
        this.cpicker.append(picker.render().el);
    },

    appendColumnHeaders: function (cols) {
        var row = new Editor.HeaderRow({ collection: cols });
        this.thead.empty();
        this.thead.append(row.render().el);
    },

    appendResources: function (resources, cols) {
        var self = this;
        this.tbody.empty();
        resources.each(function (r) {
            var row = new Editor.ResourceRow({ model: r });
            self.tbody.append(row.render(cols).el);
        });
    }
});

var editor = new Editor.EditorView();