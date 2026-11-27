using System.Linq.Expressions;

namespace SmartHomeEcomm.Domain.Contracts;

public interface IBackgroundJobs
{
    string Enqueue<T>(Expression<Action<T>> methodCall);
}
