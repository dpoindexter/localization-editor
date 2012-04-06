(function () {

    var Editor = this.Editor = this.Editor || {};

    var viewData = {
        containerEl: $("#container"),
        tableEl: $("#list-resources"),
        columnPickerEl: $("#columns"),
        columns: Editor.bootstrapData.columns,
        resources: Editor.bootstrapData.resources
    };

    Editor.dispatcher = _.clone(Backbone.Events);

    //Column model
    Editor.Column = Backbone.Model.extend({

        sortCssClass: function () {
            var direction = this.get("SortDirection");
            var suffix = this.get("IsBeingSortedOn") 
                ? " sort" + direction 
                : "";

            return "column-selector" + suffix;
        },

        enabledCssClass: function () {
            var suffix = this.get("Enabled") 
                ? "" 
                : " disabled";

            return "column-selector" + suffix;
        },

        checkedHtmlAttribute: function () {
            return this.get("Enabled")
                ? 'checked="checked"'
                : '';
        },

        toViewModel: function () {
            return _.extend(this.toJSON(), {
                sortCssClass: this.sortCssClass(),
                enabledCssClass: this.enabledCssClass(),
                checkedHtmlAttribute: this.checkedHtmlAttribute()
            });
        }

    });

    //Column model collection
    Editor.ColumnSet = Backbone.Collection.extend({
        model: Editor.Column,

        lastSelected: null,

        toggleEnabled: function (ix, val, silent, suppressLast) {
           this.at(ix).set({"Enabled": val},{silent: silent});
           !suppressLast && (this.lastSelected = ix);
        },

        toggleEnabledRange: function (until, val) {
            var start = Math.min(this.lastSelected, until);
            var end = Math.max(this.lastSelected, until);
            for ( ; start <= end; start++) {
                this.toggleEnabled(start, val, start != end, start != until);
            }
        },

        handleChangeSort: function (ix) {
            var sortColumn = this.at(ix);

            console.log(ix, this.indexOf(this.get(ix)));

            if (sortColumn.get("IsBeingSortedOn")) { //If the column is already being sorted on, flip the sort direction
                var sortDirection = (sortColumn.get("SortDirection") === 0) ? 1 : 0;
                sortColumn.set({ SortDirection: sortDirection });
            } else { //If it's not being sorted on, unmark the previous sort column and mark the current one, setting the sort order to ascending
                var previousSort = this.find(function (col) {
                    return col.get("IsBeingSortedOn");
                });
                previousSort && previousSort.set({ IsBeingSortedOn: false }, { silent: true });
                sortColumn.set({ SortDirection: 0 }, { silent: true });
                sortColumn.set({ IsBeingSortedOn: true });

                Editor.dispatcher.trigger("comparator:change","foo");
            }        
        },

        getVisibleColumns: function () {
            return this.filter(function (model) {
                return model.get("Visible");
            }).map(function (model) {
                return model.toViewModel();
            });
        },

        getEnabledAndVisibleColumns: function () {
            return this.filter(function (model) { 
                return model.get("Enabled") && model.get("Visible"); 
            }).map(function (model) {
                return model.toViewModel();
            });
        }
    });

    //Column picker control view
    Editor.ColumnPicker = Backbone.View.extend({

        template: _.template($("#column-picker").html()),

        initialize: function () {
            _.bindAll(this, "render", "toggle");
        },

        events: {
            "click input:checkbox": "toggle"
        },

        toggle: function (event) {
            var ix = $(event.target).data("ix");
            var val = event.target.checked;

            (event.shiftKey && this.collection.lastSelected)
                ? this.collection.toggleEnabledRange(ix, val)
                : this.collection.toggleEnabled(ix, val);
        },

        render: function (visibleColumns) {
            this.$el.html(this.template({ columns: visibleColumns }));
            return this;
        }
    });

    //Localization Resource model
    Editor.Resource = Backbone.Model.extend({});

    //Localization Resource model collection
    Editor.ResourceCollection = Backbone.Collection.extend({
        model: Editor.Resource,
        url: "/resources",

        initialize: function () {
            this.on("comparator:change", function (msg) {
                console.log("fired");
            });
        },

        setComparator: function (columnModel) {
            var direction = columnModel.get("SortDirection");
            var type = columnModel.get("SortType") || 0;
            var sortFunc = Editor.Util.sorting.getSortingFunction(direction, type);

            this.comparator = function (model) {
                var prm = model.get(columnModel.ColumnName);
                return sortFunc(prm);
            };
        },

        getResources: function () {
            return this.map(function (model) {
                return model.toJSON();
            });
        }
    });

    _.extend(Editor.ResourceCollection, Editor.dispatcher);


    //Localization Resource view (table row)
    Editor.ResourceView = Backbone.View.extend({

        template: _.template($("#resource-table").html()),

        initialize: function () {
            _.bindAll(this, "render", "changeSort");
        },

        events: {
            "click th": "changeSort"
        },

        changeSort: function (event) {
            var ix = $(event.target).data("ix");
            this.options.columns.handleChangeSort(ix);
        },

        render: function (enabledVisibleColumns, resources) {
            this.$el.html(this.template({ columns: enabledVisibleColumns, resources: resources }));
            return this;
        }
    });



    //Top-level editor view -- responsible for sub-views
    Editor.EditorView = Backbone.View.extend({

        initialize: function () {
            this.el = viewData.containerEl;
            _.bindAll(this, "render");

            this.resources = new Editor.ResourceCollection(viewData.resources);
            this.columns = new Editor.ColumnSet(viewData.columns);
            this.columnPicker = new Editor.ColumnPicker({ el: viewData.columnPickerEl, collection: this.columns });
            this.resourceView = new Editor.ResourceView({ el: viewData.tableEl, columns: this.columns, resources: this.resources });

            this.resources.bind("change", this.render);
            this.resources.bind("reset", this.render);
            this.columns.bind("change:Enabled", this.render);
            this.columns.bind("change:IsBeingSortedOn", this.render);
            //this.columns.bind("change:SortDirection", this.sort);

            this.render();
            //this.sort();
        },

        /*
        sort: function () {
            var sortColumn = this.columns.find(function (col) {
                return col.get("IsBeingSortedOn");
            });

            this.resources.comparator = function (req) {
                var column = req.get(sortColumn.get("ColumnName"));
                var direction = sortColumn.get("SortDirection");
                var type = sortColumn.get("SortType") || 0;
                var sortFunc = Editor.Util.sorting.getSortingFunction(direction, type);

                return sortFunc(column);
            };
            this.resources.sort();
        },
        */

        render: function () {
            this.columnPicker.render(this.columns.getVisibleColumns());
            this.resourceView.render(this.columns.getEnabledAndVisibleColumns(), this.resources.getResources());
        },
    });

}).call(this);

var editor = new Editor.EditorView();