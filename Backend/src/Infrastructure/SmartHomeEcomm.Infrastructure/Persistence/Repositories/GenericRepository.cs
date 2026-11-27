using SmartHomeEcomm.Domain.Contracts;
using SmartHomeEcomm.Domain.Entities;
using SmartHomeEcomm.Infrastructure.Persistence.Write;
using Microsoft.EntityFrameworkCore;

namespace SmartHomeEcomm.Infrastructure.Persistence.Repositories;

public class GenericRepository<TKey, TEntity>(WriteDbContext context) : IGenericRepository<TKey, TEntity> where TEntity : BaseEntity<TKey>
{
    private IQueryable<TEntity> InputQuery { get; set; } = context.Set<TEntity>();

    public async Task<IEnumerable<TEntity>> GetAllAsync(ISpecifications<TKey, TEntity> spec, CancellationToken ct, bool changeTracker = false)
    {
        return changeTracker
            ? await SpecificationsEvaluator.GetQuery(InputQuery, spec).ToListAsync(ct)
            : await SpecificationsEvaluator.GetQuery(InputQuery, spec).AsNoTracking().ToListAsync(ct);
    }

    public async Task<TEntity?> GetAsync(ISpecifications<TKey, TEntity> spec, CancellationToken ct)
    {
        return await SpecificationsEvaluator.GetQuery(InputQuery, spec).FirstOrDefaultAsync(ct);
    }

    public async Task AddAsync(TEntity entity)
    {
        await context.AddAsync(entity);
    }

    public async Task<int> GetCountAsync(ISpecifications<TKey, TEntity> spec)
    {
        return await SpecificationsEvaluator.GetQuery(InputQuery, spec).CountAsync();
    }

    public void Delete(TKey key)
    {
        var entity = context.Set<TEntity>().Find(key);
        if (entity is not null)
            context.Set<TEntity>().Remove(entity);
    }

    public async Task<bool> Exists(ISpecifications<TKey, TEntity> spec)
    {
        return await SpecificationsEvaluator.GetQuery(InputQuery, spec).AnyAsync();
    }
}
