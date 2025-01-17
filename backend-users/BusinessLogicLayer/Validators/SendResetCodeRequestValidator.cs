
using BusinessLogicLayer.DTO;
using FluentValidation;

namespace BusinessLogicLayer.Validators
{
    public class SendResetCodeRequestValidator : AbstractValidator<SendResetCodeRequest>
    {
        public SendResetCodeRequestValidator()
        {
            RuleFor(temp => temp.Email)
                .NotEmpty().WithMessage("Email cannot be blank.")
                .EmailAddress().WithMessage("Invalid email format.");
        }
    }
}
