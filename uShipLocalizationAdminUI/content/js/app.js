(function () {

    var Editor = this.Editor = this.Editor || {};

    var viewData = {
        containerEl: $('#container'),
        tableEl: $('#list-resources'),
        columnPickerEl: $('#column-picker'),
        findResourcesEl: $('#menu'),
        magnifierEl: $('#magnifier'),
        columns: Editor.bootstrapData.columns,
        resources: Editor.bootstrapData.resources
    };

    Editor.dispatcher = _.clone(Backbone.Events);

    //Column model
    Editor.Column = Backbone.Model.extend({

        sortCssClass: function () {
            var direction = this.get('SortDirection');
            var suffix = this.get('IsBeingSortedOn')
                ? ' sort' + direction
                : '';

            return 'column-header' + suffix;
        },

        enabledCssClass: function () {
            var suffix = this.get('Enabled')
                ? ''
                : ' disabled';

            return 'column-selector' + suffix;
        },

        keyCssClass: function () {
            return this.get('IsKeyColumn')
                ? 'key-column'
                : 'limit';
        },

        checkedHtmlAttribute: function () {
            return this.get('Enabled')
                ? 'checked="checked"'
                : '';
        },

        toViewModel: function () {
            return _.extend(this.toJSON(), {
                sortCssClass: this.sortCssClass(),
                enabledCssClass: this.enabledCssClass(),
                keyCssClass: this.keyCssClass(),
                checkedHtmlAttribute: this.checkedHtmlAttribute()
            });
        }

    });

    //Column model collection
    Editor.ColumnSet = Backbone.Collection.extend({
        model: Editor.Column,

        lastSelected: null,

        toggleEnabled: function (ix, val, silent, suppressLast) {
            var val = (typeof val !== 'undefined') ? val: !this.at(ix).get("Enabled");
            this.at(ix).set({ 'Enabled': val }, { silent: silent });
            !suppressLast && (this.lastSelected = ix);
        },

        toggleEnabledRange: function (until) {
            var val = !this.at(until).get("Enabled");
            var start = Math.min(this.lastSelected, until);
            var end = Math.max(this.lastSelected, until);
            for (; start <= end; start++) {
                this.toggleEnabled(start, val, start !== end, start !== until);
            }
        },

        setSortColumn: function (ix) {
            var columnModel = this.at(ix);

            if (!columnModel) return;

            if (columnModel.IsBeingSortedOn) {
                sortDirection = columnModel.get('SortDirection');
                columnModel.set({ 'SortDirection': (sortDirection) ? 0 : 1 });
            } else {
                console.log(this);
                this.where({ IsBeingSortedOn: true })[0].set({ 'IsBeingSortedOn': false });
                columnModel.set({ 'SortDirection': 0, 'IsBeingSortedOn': true });
            }

            return columnModel;
        },

        getVisibleColumns: function () {
            return this.filter(function (model) {
                return model.get('Visible');
            }).map(function (model) {
                return model.toViewModel();
            });
        },

        getEnabledAndVisibleColumns: function () {
            return this.filter(function (model) {
                return model.get('Enabled') && model.get('Visible');
            }).map(function (model) {
                return model.toViewModel();
            });
        }
    });

    //Column picker control view
    Editor.ColumnPicker = Backbone.View.extend({

        template: _.template($('#column-picker-template').html()),

        initialize: function () {
            _.bindAll(this, 'render', 'toggle');
            this.container = this.$el.find('#columns');
            this.$el.hide();
        },

        events: {
            'click label': 'toggle'
        },

        toggle: function (event) {
            var ix = $(event.target).data('ix');

            (event.shiftKey && this.collection.lastSelected)
                ? this.collection.toggleEnabledRange(ix)
                : this.collection.toggleEnabled(ix);
        },

        render: function (visibleColumns) {
            this.container.html(this.template({ columns: visibleColumns }));
            return this;
        }
    });

    //Localization Resource model
    Editor.Resource = Backbone.Model.extend();

    //Localization Resource model collection
    Editor.ResourceCollection = Backbone.Collection.extend({
        model: Editor.Resource,
        url: '/resources',

        setComparator: function (columnModel) {
            if (!columnModel) return;

            var direction = columnModel.get('SortDirection') || 0;
            var type = columnModel.get('SortType') || 0;
            var sortFunc = Editor.Util.sorting.getSortingFunction(direction, type);

            this.comparator = function (model) {
                var prm = model.get(columnModel.ColumnName);
                return sortFunc(prm);
            };

            console.log(this.comparator);

            this.sort();
        },

        getMagnifierData: function (id, column) {
            var model = this.get(id);
            return {
                key: model.get("ResourceKey"),
                lang: column,
                html: model.get(column)
            };
        },

        getResources: function () {
            return this.map(function (model) {
                return model.toJSON();
            });
        }
    });

    //Localization Resource view (table row)
    Editor.ResourceView = Backbone.View.extend({

        template: _.template($('#resource-table').html()),

        magnifierIsOn: null,

        initialize: function () {
            _.bindAll(this, 'render', 'handleChangeSort');
        },

        events: {
            'click th': 'handleChangeSort',
            'click td': 'magnify'
        },

        handleChangeSort: function (event) {
            var ix = $(event.target).data('ix');
            Editor.dispatcher.trigger('change:sort', ix);
        },

        magnify: function (event) {
            var target = $(event.target);
            var magnifierData = this.collection.getMagnifierData(target.data('id'), target.data('column'));
            if (!target.parents('#magnifier').length)
                Editor.dispatcher.trigger('click:magnify', {target: target, data: magnifierData});
        },

        render: function (enabledVisibleColumns, resources) {
            this.$el.html(this.template({ columns: enabledVisibleColumns, resources: resources }));
            return this;
        }
    });

    Editor.Magnifier = Backbone.View.extend({

        currentEl: null,
        textField: null,

        initialize: function () {

            Editor.dispatcher.on('click:magnify', function (target) {
                this.toggleMagnifier(target);
            }, this)

            this.textField = this.$el.find('textarea');

        },

        toggleMagnifier: function (params) {
            if (this.el === params.target[0] || this.currentEl === params.target[0]) {
                this.$el.hide();
                this.currentEl = null;
            } else {
                this.textField.val(params.data.html);
                this.$el.appendTo(params.target)
                    .show()
                    .position({
                        of: params.target,
                        my: 'center top',
                        at: 'center top',
                        offset: '0 -20',
                        collision: 'flip'
                    });
                this.currentEl = params.target[0];
            }
        }

    });

    Editor.FindResourcesView = Backbone.View.extend({

        initialize: function () {
            _.bindAll(this, 'toggleColumnPicker');

            this.columnPicker = this.options.controls.columnPicker;
        },

        events: {
            'click #toggle-column-picker': 'toggleColumnPicker'
        },

        toggleColumnPicker: function (event) {
            this.columnPicker.$el.toggle();
        }

    });

    //Top-level editor view -- responsible for sub-views
    Editor.EditorView = Backbone.View.extend({

        initialize: function () {
            this.el = viewData.containerEl;
            _.bindAll(this, 'render');

            this.resources = new Editor.ResourceCollection(viewData.resources);
            this.columns = new Editor.ColumnSet(viewData.columns);

            this.columnPicker = new Editor.ColumnPicker({ el: viewData.columnPickerEl, collection: this.columns });
            this.resourceView = new Editor.ResourceView({ el: viewData.tableEl, collection: this.resources, columns: this.columns });
            this.finderView = new Editor.FindResourcesView({ el: viewData.findResourcesEl, controls: { columnPicker: this.columnPicker } });
            this.magnifier = new Editor.Magnifier({ el: viewData.magnifierEl });

            this.resources.bind('change', this.render);
            this.resources.bind('reset', this.render);
            this.columns.bind('change:Enabled', this.render);

            Editor.dispatcher.on('change:sort', function (ix) {
                var columnModel = this.columns.setSortColumn(ix);
                this.resources.setComparator(columnModel);
                this.render();
            }, this);

            this.render();
        },

        render: function () {
            this.columnPicker.render(this.columns.getVisibleColumns());
            this.resourceView.render(this.columns.getEnabledAndVisibleColumns(), this.resources.getResources());
        }
    });

}).call(this);

var editor = new Editor.EditorView();