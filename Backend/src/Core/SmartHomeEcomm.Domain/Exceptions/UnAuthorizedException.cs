using SmartHomeEcomm.Domain.Localization;

namespace SmartHomeEcomm.Domain.Exceptions;

public class UnAuthorizedException(string code = ErrorCodes.Unauthorized, params object?[] args) : AppException(code, args)
{
}
