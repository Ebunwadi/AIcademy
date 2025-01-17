using BusinessLogicLayer.DTO;
using FluentValidation;

namespace BusinessLogicLayer.Validators
{
    public class SignupRequestValidator : AbstractValidator<SignupRequest>
    {
        public SignupRequestValidator()
        {
            RuleFor(temp => temp.FirstName)
                .NotEmpty().WithMessage("First Name cannot be blank.");

            RuleFor(temp => temp.LastName)
                .NotEmpty().WithMessage("Last Name cannot be blank.");

            RuleFor(temp => temp.Email)
                .NotEmpty().WithMessage("Email cannot be blank.")
                .EmailAddress().WithMessage("Invalid email format.");

            RuleFor(temp => temp.Password)
                .NotEmpty().WithMessage("Password cannot be blank.")
                .MinimumLength(4).WithMessage("Password must be at least 4 characters long.");
        }
    }
}
