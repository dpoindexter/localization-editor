using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using uShipLocalizationAdminUI.Contracts.Models;
using System.Reflection;

namespace uShipLocalizationAdminUI.Models
{
    public class ColumnJsonViewModel : IColumnJsonViewModel
    {
        public int id { get; set; }
        public string ColumnName { get; set; }
        public bool Enabled { get; set; }
        public bool Visible { get; set; }
        public bool IsBeingSortedOn { get; set; }
        public SortDirections SortDirection { get; set; }
        public SortTypes SortType { get; set; }
    }
}