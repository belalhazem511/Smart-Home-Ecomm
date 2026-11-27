using SmartHomeEcomm.Domain.Entities;

namespace SmartHomeEcomm.Domain.Contracts;

public interface IUnitOfWork
{
    IGenericRepository<TKey, TEntity> GetRepository<TKey, TEntity>() where TEntity : BaseEntity<TKey>;
    Task<int> SaveChangesAsync(CancellationToken ct);
}
