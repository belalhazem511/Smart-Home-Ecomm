namespace SmartHomeEcomm.Domain.Exceptions;

public class NotFoundException(string code, params object?[] args) : AppException(code, args)
{
}
