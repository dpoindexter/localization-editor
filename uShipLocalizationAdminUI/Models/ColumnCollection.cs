using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using uShipLocalizationAdminUI.Contracts.Models;
using System.Reflection;
using System.Collections.ObjectModel;

namespace uShipLocalizationAdminUI.Models
{
    public static class ColumnCollection
    {
        public static IEnumerable<IColumnJsonViewModel> GetColumns<T>()
        {
            var columns = new List<IColumnJsonViewModel>();
            var typeProperties = typeof(T).GetProperties().ToArray();
            for (var i = 0; i < typeProperties.Length; i++)
            {
                var attributes = typeProperties[i].GetCustomAttributes(typeof(ColumnModelAttribute), false);
                var columnModelAttribute = (attributes.Length != 0) ? attributes[0] as ColumnModelAttribute : new ColumnModelAttribute();

                columns.Add(new ColumnJsonViewModel
                    {
                        id = i,
                        ColumnName = typeProperties[i].Name,
                        Enabled = columnModelAttribute.Enabled,
                        Visible = columnModelAttribute.Visible,
                        IsBeingSortedOn = columnModelAttribute.IsBeingSortedOn,
                        IsKeyColumn = columnModelAttribute.IsKeyColumn,
                        SortDirection = columnModelAttribute.SortDirection,
                        SortType = columnModelAttribute.SortType
                    });
            }
            return columns;
        }
    }
}