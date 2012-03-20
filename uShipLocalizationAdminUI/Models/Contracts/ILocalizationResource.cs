using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using uShipLocalizationAdminUI.Data.Contracts;

namespace uShipLocalizationAdminUI.Models.Contracts
{
    public interface ILocalizationResource : IIndexed<string>
    {
        string ResourceKey { get; set; }
        string enUS { get; set; }
        string enGB { get; set; }
        string frFR { get; set; }
        string deDE { get; set; }
        string nlNL { get; set; }
        string esES { get; set; }
        ICollection<LocalizationBundle> Bundles { get; set; }
    }
}
