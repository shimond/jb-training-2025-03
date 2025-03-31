namespace CatalogApi.Contracts;

public interface ISmsService
{
    void Send(string message);
}

public class ShamirSmsService : ISmsService
{
    public void Send(string message)
    {
        Console.WriteLine("SHAMIR");
    }
}

public class SmsForFreeSmsService : ISmsService, IDisposable
{
    private readonly ILogger<SmsForFreeSmsService> logger;

    public SmsForFreeSmsService(ILogger<SmsForFreeSmsService> logger)
    {
        this.logger = logger;
    }

    public void Dispose()
    {
    }

    public void Send(string message)
    {
        Console.WriteLine("SMS4Free");
    }
}
