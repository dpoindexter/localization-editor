using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data.Entity;
using uShipLocalizationAdminUI.Models.Contracts;
using uShipLocalizationAdminUI.Models;

namespace uShipLocalizationAdminUI.Data.Contracts
{
    public interface ILocalizationContext
    {
        DbSet<LocalizationResource> Resources { get; set;  }
        DbSet<LocalizationBundle> Bundles { get; set;  }
    }
}
