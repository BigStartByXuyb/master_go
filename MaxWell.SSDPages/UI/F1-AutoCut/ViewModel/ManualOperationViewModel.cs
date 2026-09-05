using MaxWell.UIDesign;
using MaxwellFramework.Core.Interfaces;
using MaxwellFramework.Core.Layout;
using System.Windows;

namespace MaxWell.SSDPages.F1_AutoCut.ViewModel
{
    public class ManualOperationViewModel : IOScreen, IPage
    {
        public PageDesign pageDesign { get; set; }

        public ManualOperationViewModel()
        {
            Name = "ManualOperation";
        }

        public void PageDesign_Loaded(object sender, RoutedEventArgs e)
        {
            pageDesign = sender as PageDesign;
        }
    }
}

