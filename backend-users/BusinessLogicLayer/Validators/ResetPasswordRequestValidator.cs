using FluentValidation;
using BusinessLogicLayer.DTO;

namespace BusinessLogicLayer.Validators
{
    public class ResetPasswordRequestValidator : AbstractValidator<ResetPasswordRequest>
    {
        public ResetPasswordRequestValidator()
        {
            RuleFor(temp => temp.Email)
                .NotEmpty().WithMessage("Email cannot be blank.")
                .EmailAddress().WithMessage("Invalid email format.");

            RuleFor(temp => temp.NewPassword)
                .NotEmpty().WithMessage("New Password cannot be blank.")
                .MinimumLength(4).WithMessage("New Password must be at least 4S characters long.");

            RuleFor(temp => temp.ResetCode)
                .NotEmpty().WithMessage("Reset Code cannot be blank.")
                .Length(6).WithMessage("Reset Code must be 6 characters long.");
        }
    }
}
