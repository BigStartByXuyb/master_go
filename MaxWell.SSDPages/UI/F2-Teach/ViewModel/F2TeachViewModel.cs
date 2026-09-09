using MaxWell.UIDesign;
using MaxwellFramework.Core.Interfaces;
using MaxwellFramework.Core.Layout;
using System.Windows;

namespace MaxWell.SSDPages.F2_Teach.ViewModel
{
    public class F2TeachViewModel : IOScreen, IPage
    {
        public PageDesign pageDesign { get; set; }

        public F2TeachViewModel()
        {
            Name = "F2Teach";
        }

        public void PageDesign_Loaded(object sender, RoutedEventArgs e)
        {
            pageDesign = sender as PageDesign;
        }
    }
}
