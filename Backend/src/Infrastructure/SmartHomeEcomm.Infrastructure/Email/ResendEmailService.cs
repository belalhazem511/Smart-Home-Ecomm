using System.Net.Http.Json;
using SmartHomeEcomm.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace SmartHomeEcomm.Infrastructure.Email;

public class ResendEmailService(HttpClient http, ILogger<ResendEmailService> logger) : IEmailSender
{
    public async Task SendAsync(string to, string subject, string htmlBody, CancellationToken ct)
    {
        var apiKey = Environment.GetEnvironmentVariable("RESEND_API_KEY");
        var from = Environment.GetEnvironmentVariable("EMAIL_FROM");

        if (string.IsNullOrWhiteSpace(apiKey) || apiKey.StartsWith("replace-with"))
        {
            logger.LogWarning("RESEND_API_KEY missing - email to {To} skipped. Subject: {Subject}", to, subject);
            return;
        }

        using var request = new HttpRequestMessage(HttpMethod.Post, "https://api.resend.com/emails");
        request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", apiKey);
        request.Content = JsonContent.Create(new
        {
            from = string.IsNullOrWhiteSpace(from) ? "SmartHomeEcomm <noreply@smarthomeecomm.local>" : from,
            to = new[] { to },
            subject,
            html = htmlBody
        });

        logger.LogInformation("Sending email to {To} with subject {Subject}", to, subject);

        var response = await http.SendAsync(request, ct);
        if (!response.IsSuccessStatusCode)
        {
            var body = await response.Content.ReadAsStringAsync(ct);
            logger.LogError("Resend rejected the email to {To} with status {Status}: {Body}",
                to, (int)response.StatusCode, body);
            return;
        }

        logger.LogInformation("Email to {To} accepted by Resend with status {Status}", to, (int)response.StatusCode);
    }
}
