using SmartHomeEcomm.Domain.Contracts;
using SmartHomeEcomm.Domain.Entities;

namespace SmartHomeEcomm.Infrastructure.Persistence;

public static class SpecificationsEvaluator
{
    public static IQueryable<TEntity> GetQuery<TKey, TEntity>(IQueryable<TEntity> inputQuery, ISpecifications<TKey, TEntity> spec) where TEntity : BaseEntity<TKey>
    {
        var query = inputQuery;

        if (spec.Criteria is not null)
            query = query.Where(spec.Criteria);

        if (spec.OrderByAsc is not null)
            query = query.OrderBy(spec.OrderByAsc);
        else if (spec.OrderByDesc is not null)
            query = query.OrderByDescending(spec.OrderByDesc);

        if (spec.IsPaginated)
            query = query.Skip(spec.Skip).Take(spec.Take);

        foreach (var action in spec.IncludeAction)
            query = action(query);

        return query;
    }
}
