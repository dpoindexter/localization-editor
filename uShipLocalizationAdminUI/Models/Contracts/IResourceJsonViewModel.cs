using System;
using System.Collections.Generic;

namespace uShipLocalizationAdminUI.Contracts.Models
{
    public interface IResourceJsonViewModel
    {
        [ColumnModel(Visible = false)]
        string id { get; set; }
        [ColumnModel(IsBeingSortedOn = true, IsKeyColumn = true)]
        string ResourceKey { get; set; }
        string de_DE { get; set; }
        string en_GB { get; set; }
        string en_US { get; set; }
        string es_ES { get; set; }
        string fr_FR { get; set; }
        string nl_NL { get; set; }
        [ColumnModel(Visible = false)]
        IEnumerable<string> Bundles { get; set; }
    }
}
