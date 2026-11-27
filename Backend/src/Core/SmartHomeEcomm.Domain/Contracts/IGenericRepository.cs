using SmartHomeEcomm.Domain.Entities;

namespace SmartHomeEcomm.Domain.Contracts;

public interface IGenericRepository<TKey, TEntity> where TEntity : BaseEntity<TKey>
{
    Task<IEnumerable<TEntity>> GetAllAsync(ISpecifications<TKey, TEntity> spec, CancellationToken ct, bool changeTracker = false);
    Task<TEntity?> GetAsync(ISpecifications<TKey, TEntity> spec, CancellationToken ct);
    Task AddAsync(TEntity entity);
    Task<int> GetCountAsync(ISpecifications<TKey, TEntity> spec);
    Task<bool> Exists(ISpecifications<TKey, TEntity> spec);
    void Delete(TKey key);
}
