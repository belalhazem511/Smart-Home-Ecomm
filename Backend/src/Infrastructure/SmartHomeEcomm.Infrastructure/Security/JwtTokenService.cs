using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using SmartHomeEcomm.Application.Common.Interfaces;
using SmartHomeEcomm.Domain.Interfaces;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace SmartHomeEcomm.Infrastructure.Security;

public class JwtTokenService(IOptions<JwtOptions> options, IDateTime clock) : ITokenService
{
    private readonly JwtOptions _options = options.Value;

    public string GenerateAccessToken(IEnumerable<Claim> claims)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.Key));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _options.Issuer,
            audience: _options.Audience,
            claims: claims,
            expires: GetExpiry(),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public DateTime GetExpiry() => clock.UtcNow.AddDays(_options.DurationInDays);
}
