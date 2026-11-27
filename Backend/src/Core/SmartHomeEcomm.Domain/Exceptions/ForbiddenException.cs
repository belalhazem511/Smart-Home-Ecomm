namespace SmartHomeEcomm.Domain.Exceptions;

public class ForbiddenException(string code, params object?[] args) : AppException(code, args)
{
}
