using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using uShipLocalizationAdminUI.Data.Contracts;

namespace uShipLocalizationAdminUI.Models.Contracts 
{
    public interface ILocalizationBundle : IIndexed<string>
    {
        string Name { get; set; }
        bool Enabled { get; set; }
        ICollection<LocalizationResource> Resources { get; set; }
    }
}
