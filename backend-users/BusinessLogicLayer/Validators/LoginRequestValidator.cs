using FluentValidation;
using BusinessLogicLayer.DTO;

namespace BusinessLogicLayer.Validators
{
    public class LoginRequestValidator : AbstractValidator<LoginRequest>
    {
        public LoginRequestValidator()
        {
            RuleFor(temp => temp.Email)
                .NotEmpty().WithMessage("Email cannot be blank.")
                .EmailAddress().WithMessage("Invalid email format.");

            RuleFor(temp => temp.Password)
                .NotEmpty().WithMessage("Password cannot be blank.");
        }
    }
}
