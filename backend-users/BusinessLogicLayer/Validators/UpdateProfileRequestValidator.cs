using BusinessLogicLayer.DTO;
using FluentValidation;

namespace BusinessLogicLayer.Validators
{
    public class UpdateProfileRequestValidator : AbstractValidator<UpdateProfileRequest>
    {
        public UpdateProfileRequestValidator()
        {
            RuleFor(temp => temp.UserID)
                .NotEmpty().WithMessage("User ID is required.");

            RuleFor(temp => temp.NickName)
                .MaximumLength(50).WithMessage("Nickname cannot exceed 50 characters.");

            RuleFor(temp => temp.ProfilePicture)
                .MaximumLength(255).WithMessage("Profile picture path cannot exceed 255 characters.");
        }
    }
}
