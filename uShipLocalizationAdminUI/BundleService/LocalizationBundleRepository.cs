using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using uShipLocalizationAdminUI.Data.Contracts;

namespace uShipLocalizationAdminUI.BundleService
{
    public class LocalizationBundleRepository : IRepository
    {
        public IEnumerable<TItem> GetItems<TItem>()
        {
            throw new NotImplementedException();
        }

        public IEnumerable<TItem> GetItems<TItem>(Func<string, bool> query)
        {
            throw new NotImplementedException();
        }

        public TItem GetItemById<TItem>(int id)
        {
            throw new NotImplementedException();
        }

        public TItem AddItem<TItem>(TItem item)
        {
            throw new NotImplementedException();
        }

        public TItem UpdateBundle<TItem>(int id, TItem item)
        {
            throw new NotImplementedException();
        }

        public void DeleteItem(int id)
        {
            throw new NotImplementedException();
        }
    }
}