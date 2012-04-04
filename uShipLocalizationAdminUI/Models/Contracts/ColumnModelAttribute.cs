using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using uShipLocalizationAdminUI.Contracts.Models;

namespace uShipLocalizationAdminUI.Contracts.Models
{
    [AttributeUsage(AttributeTargets.All)]
    public class ColumnModelAttribute : System.Attribute, IColumnJsonViewModel
    {
        public bool Visible { get; set; }
        public bool Enabled { get; set; }
        public bool IsBeingSortedOn { get; set; }
        public SortDirections SortDirection{ get; set; }
        public SortTypes SortType { get; set; }

        public ColumnModelAttribute()
        {
            Visible = true;
            Enabled = true;
            IsBeingSortedOn = false;
            SortDirection = SortDirections.Ascending;
            SortType = SortTypes.String;
        }
    }
}