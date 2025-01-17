namespace BusinessLogicLayer.DTO
{
    public record UpdateProfileRequest(
      Guid UserID,
      string? NickName,
      string? ProfilePicture
  )
    {
        // Parameterless constructor
        public UpdateProfileRequest() : this(default, default, default)
        {
        }
    }
}
