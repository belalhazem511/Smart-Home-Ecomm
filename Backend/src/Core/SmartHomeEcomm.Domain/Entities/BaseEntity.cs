namespace SmartHomeEcomm.Domain.Entities;

public class BaseEntity<TKey>
{
    public TKey Id { get; init; } = default!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
