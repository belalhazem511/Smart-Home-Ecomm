using MediatR;

namespace SmartHomeEcomm.Domain.Events;

public interface IDomainEvent : INotification
{
    DateTime OccurredOn { get; }
}
