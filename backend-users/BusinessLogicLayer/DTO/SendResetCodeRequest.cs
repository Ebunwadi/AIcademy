namespace BusinessLogicLayer.DTO
{
    public record SendResetCodeRequest(
        string Email
    )
    {
        // Parameterless constructor
        public SendResetCodeRequest() : this(string.Empty)
        {
        }
    }
}
