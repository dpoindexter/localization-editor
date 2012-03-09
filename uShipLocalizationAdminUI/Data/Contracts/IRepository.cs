using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace uShipLocalizationAdminUI.Data.Contracts
{
    public interface IRepository
    {
        IEnumerable<TItem> GetItems<TItem>();
        IEnumerable<TItem> GetItems<TItem>(Func<string, bool> query);
        TItem GetItemById<TItem>(int id);
        TItem AddItem<TItem>(TItem item);
        TItem UpdateBundle<TItem>(int id, TItem item);
        void DeleteItem(int id);
    }
}
