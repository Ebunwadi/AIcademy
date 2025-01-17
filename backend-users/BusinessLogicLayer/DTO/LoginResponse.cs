namespace BusinessLogicLayer.DTO
{
    public record LoginResponse(
        string Message,
        string Token
    )
    {
        // Parameterless constructor
        public LoginResponse() : this(default!, default!)
        {
        }
    }
}
