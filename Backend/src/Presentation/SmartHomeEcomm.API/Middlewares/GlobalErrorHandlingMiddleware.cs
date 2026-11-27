using FluentValidation;
using SmartHomeEcomm.Application.Common.Models;
using SmartHomeEcomm.Domain.Exceptions;
using SmartHomeEcomm.Domain.Localization;

namespace SmartHomeEcomm.API.Middlewares;

public class GlobalErrorHandlingMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context, ILogger<GlobalErrorHandlingMiddleware> logger)
    {
        var locale = ErrorMessages.ResolveLocale(context.Request.Headers["x-locale"].FirstOrDefault());

        try
        {
            await next.Invoke(context);
            if (context.Response.StatusCode == StatusCodes.Status404NotFound)
            {
                context.Response.ContentType = "application/json";
                var notFound = new ErrorResponse
                {
                    StatusCode = StatusCodes.Status404NotFound,
                    Code = ErrorCodes.RouteNotFound,
                    ErrorMessage = ErrorMessages.Get(ErrorCodes.RouteNotFound, locale)
                };
                await context.Response.WriteAsJsonAsync(notFound);
            }
        }
        catch (Exception ex)
        {
            int status;
            string code;
            object?[] args = [];
            var log = false;

            if (ex is ValidationException validation)
            {
                context.Response.StatusCode = StatusCodes.Status400BadRequest;
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsJsonAsync(new ValidationErrorResponse
                {
                    Code = ErrorCodes.ValidationError,
                    ErrorMessage = ErrorMessages.Get(ErrorCodes.ValidationError, locale),
                    Errors = validation.Errors.GroupBy(f => f.PropertyName).Select(g => new ValidationMessage
                    {
                        Field = g.Key,
                        Errors = g.Select(f => f.ErrorMessage)
                    })
                });
                return;
            }

            if (ex is AppException app)
            {
                status = app switch
                {
                    NotFoundException => StatusCodes.Status404NotFound,
                    BadRequestException => StatusCodes.Status400BadRequest,
                    UnAuthorizedException => StatusCodes.Status401Unauthorized,
                    ForbiddenException => StatusCodes.Status403Forbidden,
                    TooManyRequestsException => StatusCodes.Status429TooManyRequests,
                    _ => StatusCodes.Status500InternalServerError
                };
                code = status == StatusCodes.Status500InternalServerError ? ErrorCodes.ServerError : app.Code;
                args = app.Args;
                log = status == StatusCodes.Status500InternalServerError;
            }
            else
            {
                status = StatusCodes.Status500InternalServerError;
                code = ErrorCodes.ServerError;
                log = true;
            }

            if (log)
                logger.LogError(ex, "Unhandled error {Code} on {Method} {Path}", code, context.Request.Method, context.Request.Path);
            else
                logger.LogWarning("Handled error {Code} on {Method} {Path}: {Reason}",
                    code, context.Request.Method, context.Request.Path, ex.Message);

            context.Response.StatusCode = status;
            context.Response.ContentType = "application/json";

            var response = new ErrorResponse
            {
                StatusCode = status,
                Code = code,
                ErrorMessage = ErrorMessages.Get(code, locale, args)
            };

            await context.Response.WriteAsJsonAsync(response);
        }
    }
}
