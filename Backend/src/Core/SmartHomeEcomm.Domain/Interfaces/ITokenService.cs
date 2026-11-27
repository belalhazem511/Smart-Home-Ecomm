using System.Security.Claims;

namespace SmartHomeEcomm.Domain.Interfaces;

public interface ITokenService
{
    string GenerateAccessToken(IEnumerable<Claim> claims);
    DateTime GetExpiry();
}
