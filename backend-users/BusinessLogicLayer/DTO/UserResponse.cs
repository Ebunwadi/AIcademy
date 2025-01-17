using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogicLayer.DTO
{
    public record UserResponse(
        Guid UserID,
        string? FirstName,
        string? LastName,
        string? Email,
        string? Nickname,
        string? ProfilePicture
    )
    {
        // Parameterless constructor
        public UserResponse() : this(default!, default!, default, default, default, default)
        {
        }
    }
}
