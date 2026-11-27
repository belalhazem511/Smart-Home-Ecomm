using System.Collections.Concurrent;
using SmartHomeEcomm.Domain.Contracts;
using SmartHomeEcomm.Domain.Entities;
using SmartHomeEcomm.Infrastructure.Persistence.Repositories;
using SmartHomeEcomm.Infrastructure.Persistence.Write;

namespace SmartHomeEcomm.Infrastructure.Persistence;

public class UnitOfWork(WriteDbContext context) : IUnitOfWork
{
    private readonly ConcurrentDictionary<Type, object> _repositories = new();

    public IGenericRepository<TKey, TEntity> GetRepository<TKey, TEntity>() where TEntity : BaseEntity<TKey>
    {
        return (GenericRepository<TKey, TEntity>)_repositories.GetOrAdd(typeof(TEntity), new GenericRepository<TKey, TEntity>(context));
    }

    public async Task<int> SaveChangesAsync(CancellationToken ct)
    {
        return await context.SaveChangesAsync(ct);
    }
}
