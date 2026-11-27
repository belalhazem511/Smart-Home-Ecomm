using System.Linq.Expressions;
using Hangfire;
using SmartHomeEcomm.Domain.Contracts;
namespace SmartHomeEcomm.Infrastructure.BackgroundJobs;

public class HangfireBackgroundJobService : IBackgroundJobs
{
    public string Enqueue<T>(Expression<Action<T>> methodcall)
    {
        return BackgroundJob.Enqueue(methodcall);
    }
}