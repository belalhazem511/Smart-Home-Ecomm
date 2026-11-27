using System.Linq.Expressions;
using SmartHomeEcomm.Domain.Entities;

namespace SmartHomeEcomm.Domain.Contracts;

public interface ISpecifications<TKey, TEntity> where TEntity : BaseEntity<TKey>
{
    Expression<Func<TEntity, bool>>? Criteria { get; set; }

    List<Func<IQueryable<TEntity>, IQueryable<TEntity>>> IncludeAction { get; set; }

    Expression<Func<TEntity, object>>? OrderByAsc { get; set; }
    Expression<Func<TEntity, object>>? OrderByDesc { get; set; }

    int Take { get; set; }
    int Skip { get; set; }
    bool IsPaginated { get; set; }

    void AddInclude(Func<IQueryable<TEntity>, IQueryable<TEntity>> action);
}
