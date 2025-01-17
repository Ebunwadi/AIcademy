namespace BusinessLogicLayer.DTO;

public record SignupRequest(
    string FirstName,
    string LastName,
    string Email,
    string Password
)
{
    // Parameterless constructor
    public SignupRequest() : this(default!, default!, default!, default!)
    {
    }
}

