namespace SmartHomeEcomm.Domain.Exceptions;

public class TooManyRequestsException(string code, params object?[] args) : AppException(code, args)
{
}
