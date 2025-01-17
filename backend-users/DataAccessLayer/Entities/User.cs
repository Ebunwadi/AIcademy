using System.ComponentModel.DataAnnotations;

namespace DataAccessLayer.Entities;

public class User
{
    [Key]
    public Guid UserID { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string? ProfilePicture { get; set; }
    public string? NickName { get; set; }

    public string PasswordHash { get; set; }
    public string? ResetCode { get; set; }

}
