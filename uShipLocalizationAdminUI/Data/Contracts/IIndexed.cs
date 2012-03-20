using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace uShipLocalizationAdminUI.Data.Contracts
{
    public interface IIndexed<TIndex>
    {
        TIndex Id { get; set; }
    }
}
