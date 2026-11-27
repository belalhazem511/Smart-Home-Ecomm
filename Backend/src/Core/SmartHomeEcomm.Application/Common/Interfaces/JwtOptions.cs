namespace SmartHomeEcomm.Application.Common.Interfaces;

public class JwtOptions
{
    public string Key { get; set; } = null!;
    public string Issuer { get; set; } = "SmartHomeEcomm";
    public string Audience { get; set; } = "SmartHomeEcomm";
    public double DurationInDays { get; set; } = 7;
}
