(function () {

    var Editor = this.Editor = this.Editor || {};

    var viewData = {
        containerEl: $("#container"),
        tableEl: $("#list-resources"),
        columnPickerEl: $("#columns"),
        columns: Editor.bootstrapData.columns,
        resources: Editor.bootstrapData.resources
    };

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

        getResources: function () {
            return this.map(function (model) {
                return model.toJSON();
            });
        }
    });


    //Localization Resource view (table row)
    Editor.ResourceView = Backbone.View.extend({

        template: _.template($("#resource-table").html()),

        initialize: function () {
            _.bindAll(this, "render");
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
            _.bindAll(this, "render", "changeSort", "sort");

            this.resources = new Editor.ResourceCollection(viewData.resources);
            this.columns = new Editor.ColumnSet(viewData.columns);
            this.columnPicker = new Editor.ColumnPicker({ el: viewData.columnPickerEl, collection: this.columns });
            this.resourceView = new Editor.ResourceView({ el: viewData.tableEl });

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

        render: function () {
            this.columnPicker.render(this.columns.getVisibleColumns());
            this.resourceView.render(this.columns.getEnabledAndVisibleColumns(), this.resources.getResources());
        },
    });

}).call(this);

var editor = new Editor.EditorView();