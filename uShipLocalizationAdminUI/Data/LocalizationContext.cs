using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using uShipLocalizationAdminUI.Models;
using System.Data.Entity;
using uShipLocalizationAdminUI.Data.Contracts;
using uShipLocalizationAdminUI.Models.Contracts;
using System.Data.Entity.ModelConfiguration.Conventions;

namespace uShipLocalizationAdminUI.Data
{
    public class LocalizationContext : DbContext, ILocalizationContext
    {
        public DbSet<LocalizationResource> Resources { get; set; }
        public DbSet<LocalizationBundle> Bundles { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<LocalizationResource>().Property(r => r.Id).HasColumnName("ResourceID");
            modelBuilder.Entity<LocalizationResource>().Property(r => r.enUS).HasColumnName("en-US");
            modelBuilder.Entity<LocalizationResource>().Property(r => r.enGB).HasColumnName("en-GB");
            modelBuilder.Entity<LocalizationResource>().Property(r => r.frFR).HasColumnName("fr-FR");
            modelBuilder.Entity<LocalizationResource>().Property(r => r.deDE).HasColumnName("de-DE");
            modelBuilder.Entity<LocalizationResource>().Property(r => r.nlNL).HasColumnName("nl-NL");
            modelBuilder.Entity<LocalizationResource>().Property(r => r.esES).HasColumnName("es-ES");

            modelBuilder.Entity<LocalizationBundle>().Property(b => b.Id).HasColumnName("BundleID");

            modelBuilder.Entity<LocalizationBundle>()
                .HasMany(e => e.Resources)
                .WithMany(e => e.Bundles)
                .Map(m =>
                {
                    m.ToTable("LocalizationResourceBundle");
                    m.MapLeftKey("BundleID");
                    m.MapRightKey("ResourceID");
                });
        }
    }
}