using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using uShipLocalizationAdminUI.Contracts.Models;

namespace uShipLocalizationAdminUI.Models
{
    public class DefaultViewModel
    {
        public DefaultViewModel() { }
        public DefaultViewModel(IEnumerable<IColumnJsonViewModel> cols, IEnumerable<IResourceJsonViewModel> recs)
        {
            columns = cols;
            resources = recs;
        }

        public IEnumerable<IColumnJsonViewModel> columns { get; set; }
        public IEnumerable<IResourceJsonViewModel> resources { get; set; }
    }
}