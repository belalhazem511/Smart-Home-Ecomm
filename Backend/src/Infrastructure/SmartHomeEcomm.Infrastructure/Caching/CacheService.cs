using System.Text;
using SmartHomeEcomm.Application.Common.Interfaces;
using Microsoft.Extensions.Caching.Distributed;

namespace SmartHomeEcomm.Infrastructure.Caching;

public class CacheService(IDistributedCache distributedCache) : ICacheService
{
    public async Task<string?> GetAsync(string key)
    {
        var result = await distributedCache.GetAsync(key);
        return result is null ? null : Encoding.UTF8.GetString(result);
    }

    public async Task SetAsync(string key, string value, TimeSpan duration)
    {
        var bytes = Encoding.UTF8.GetBytes(value);
        await distributedCache.SetAsync(key, bytes, new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = duration
        });
    }
}
