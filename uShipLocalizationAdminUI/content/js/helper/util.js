(function () {

    var Editor = this.Editor = this.Editor || {};

    Editor.Util = {

        sorting: {
            sortDirection: {
                0: "asc",
                1: "desc",
            },

            sortType: {
                0: "str",
                1: "num",
                2: "date",
            },

            getSortingFunction: function (direction, type) {
                var key = this.sortType[type] + '-' + this.sortDirection[direction];
                return this[key];
            },

            //String Ascending
            "str-asc": function (str) {
                return (str || "").toLowerCase();
            },

            //Number Ascending
            "num-asc": function (num) {
                return num;
            },

            //Date Ascending
            "date-asc": function (date) {
                return new Date(date).valueOf();
            },

            //String Descending
            "str-desc": function (str) {
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
            "num-desc": function (num) {
                return -num;
            },

            //Date Descending
            "date-desc": function (date) {
                return -new Date(date).valueOf();
            }
        }

    }

})(this);