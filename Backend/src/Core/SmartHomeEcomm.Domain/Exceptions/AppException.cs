using SmartHomeEcomm.Domain.Localization;

namespace SmartHomeEcomm.Domain.Exceptions;

public class AppException(string code, params object?[] args)
    : Exception(ErrorMessages.Get(code, "en", args))
{
    public string Code { get; } = code;
    public object?[] Args { get; } = args;
}
