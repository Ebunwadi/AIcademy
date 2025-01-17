
namespace BusinessLogicLayer.DTO;

public record LoginRequest(
    string Email,
    string Password
)
{
    // Parameterless constructor
    public LoginRequest() : this(default!, default!)
    {
    }
}

