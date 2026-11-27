namespace SmartHomeEcomm.Application.Common.Models;

public class ErrorResponse
{
    public int StatusCode { get; set; }
    public string Code { get; set; } = null!;
    public string ErrorMessage { get; set; } = null!;
}
