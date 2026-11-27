using SmartHomeEcomm.Domain.Interfaces;

namespace SmartHomeEcomm.Infrastructure.Services;

public class SystemDateTime : IDateTime
{
    public DateTime UtcNow => DateTime.UtcNow;
}
