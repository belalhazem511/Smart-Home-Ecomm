using Microsoft.AspNetCore.Mvc.ApplicationModels;

namespace SmartHomeEcomm.API.Routing;

public class LowercaseRouteConvention : IControllerModelConvention
{
    public void Apply(ControllerModel controller)
    {
        controller.ControllerName = controller.ControllerName.ToLowerInvariant();

        foreach (var action in controller.Actions)
        {
            foreach (var selector in action.Selectors)
            {
                if (selector.AttributeRouteModel?.Template is not null)
                    selector.AttributeRouteModel.Template = selector.AttributeRouteModel.Template.ToLowerInvariant();
            }
        }
    }
}
