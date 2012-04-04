using System;

namespace uShipLocalizationAdminUI.Contracts.Models
{
    public interface IColumnJsonViewModel
    {
        bool Enabled { get; set; }
        bool Visible { get; set; }
        bool IsBeingSortedOn { get; set; }
        SortDirections SortDirection { get; set; }
        SortTypes SortType { get; set; }
    }
}
