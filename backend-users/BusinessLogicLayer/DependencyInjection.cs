using BusinessLogicLayer.Helpers;
using BusinessLogicLayer.ServiceContracts;
using BusinessLogicLayer.Services;
using BusinessLogicLayer.Validators;
using FluentValidation;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace BusinessLogicLayer
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddBusinessLogicLayer(this IServiceCollection services, IConfiguration configuration)
        {
            // Register validators
            services.AddValidatorsFromAssemblyContaining<SignupRequestValidator>();

            // Register IUserService and IHttpContextAccessor
            services.AddScoped<IUsersService, UsersService>();
            services.AddHttpContextAccessor();

            // Register EmailHelper
            var emailSettings = configuration.GetSection("EmailSettings");
            var smtpServer = emailSettings["SmtpServer"] ?? throw new ArgumentNullException("SmtpServer is not configured.");
            var smtpPort = int.TryParse(emailSettings["SmtpPort"], out var port) ? port : throw new ArgumentException("SmtpPort is not a valid number.");
            var emailSender = emailSettings["EmailSender"] ?? throw new ArgumentNullException("EmailSender is not configured.");
            var emailPassword = emailSettings["EmailPassword"] ?? throw new ArgumentNullException("EmailPassword is not configured.");

            services.AddSingleton<EmailHelper>(provider =>
            {
                return new EmailHelper(
                    smtpServer,
                    smtpPort,
                    emailSender,
                    emailPassword
                );
            });

            var jwtSettings = configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"] ?? throw new ArgumentNullException("JWT_SECRET is not configured.");
            services.AddSingleton<string>(secretKey);

            return services;
        }
    }
}
