using Microsoft.AspNetCore.Http;

namespace SmartHomeEcomm.Application.Common.Models;

public class ValidationErrorResponse : ErrorResponse
{
    public IEnumerable<ValidationMessage> Errors { get; set; } = null!;

    public ValidationErrorResponse()
    {
        StatusCode = StatusCodes.Status400BadRequest;
        ErrorMessage = "Validation Error";
    }
}

public class ValidationMessage
{
    public string Field { get; set; } = null!;
    public IEnumerable<string> Errors { get; set; } = null!;
}
