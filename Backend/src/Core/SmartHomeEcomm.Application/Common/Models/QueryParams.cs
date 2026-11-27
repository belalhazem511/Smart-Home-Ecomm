namespace SmartHomeEcomm.Application.Common.Models;

public class QueryParams
{
    public string? Sort { get; set; }
    public string? Search { get; set; }
    public int? PageIndex { get; set; } = 1;
    public int? PageSize { get; set; } = 10;
}
