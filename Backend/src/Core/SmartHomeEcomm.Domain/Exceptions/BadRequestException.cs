namespace SmartHomeEcomm.Domain.Exceptions;

public class BadRequestException(string code, params object?[] args) : AppException(code, args)
{
}
