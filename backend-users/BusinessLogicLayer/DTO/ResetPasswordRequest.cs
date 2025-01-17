namespace BusinessLogicLayer.DTO
{
    public record ResetPasswordRequest(
        string Email,
        string NewPassword,
        string ResetCode
    )
    {
        // Parameterless constructor
        public ResetPasswordRequest() : this(default!, default!, default!)
        {
        }
    }
}
