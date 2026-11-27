using System.Linq.Expressions;
using SmartHomeEcomm.Domain.Contracts;
using SmartHomeEcomm.Domain.Entities;

namespace SmartHomeEcomm.Application.Specifications;

public class Specifications<TKey, TEntity> : ISpecifications<TKey, TEntity> where TEntity : BaseEntity<TKey>
{
    public Specifications(Expression<Func<TEntity, bool>>? expression)
    {
        Criteria = expression;
    }

    public List<Func<IQueryable<TEntity>, IQueryable<TEntity>>> IncludeAction { get; set; } = new();
    public Expression<Func<TEntity, bool>>? Criteria { get; set; }
    public Expression<Func<TEntity, object>>? OrderByAsc { get; set; }
    public Expression<Func<TEntity, object>>? OrderByDesc { get; set; }
    public int Take { get; set; }
    public int Skip { get; set; }
    public bool IsPaginated { get; set; }

    public void ApplyPagination(int? pageIndex, int? pageSize)
    {
        if (pageIndex.HasValue && pageSize.HasValue)
        {
            Skip = (pageIndex.Value - 1) * pageSize.Value;
            Take = pageSize.Value;
            IsPaginated = true;
        }
    }

    public void AddOrderByAsc(Expression<Func<TEntity, object>> orderByAsc)
    {
        OrderByAsc = orderByAsc;
    }

    public void AddOrderByDesc(Expression<Func<TEntity, object>> orderByDesc)
    {
        OrderByDesc = orderByDesc;
    }

    public void AddInclude(Func<IQueryable<TEntity>, IQueryable<TEntity>> action)
    {
        IncludeAction.Add(action);
    }
}
