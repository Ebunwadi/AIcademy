using BusinessLogicLayer.DTO;
using BusinessLogicLayer.Helpers;
using BusinessLogicLayer.ServiceContracts;
using DataAccessLayer.Entities;
using DataAccessLayer.RepositoryContracts;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Http;
using System.Linq.Expressions;

namespace BusinessLogicLayer.Services
{
    public class UsersService : IUsersService
    {
        private readonly IUsersRepository _userRepository;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IValidator<SignupRequest> _signupValidator;
        private readonly IValidator<LoginRequest> _loginValidator;
        private readonly IValidator<UpdateProfileRequest> _updateUserValidator;
        private readonly IValidator<ResetPasswordRequest> _resetPasswordValidator;
        private readonly IValidator<SendResetCodeRequest> _sendResetCodeValidator;
        private readonly EmailHelper _emailHelper;
        private readonly string _jwtSecret;

        public UsersService(
            IUsersRepository userRepository, 
            IHttpContextAccessor httpContextAccessor, 
            IValidator<SignupRequest> signupValidator, 
            IValidator<LoginRequest> loginValidator,
            IValidator<UpdateProfileRequest> updateUserValidator,
            IValidator<ResetPasswordRequest> resetPasswordValidator,
            IValidator<SendResetCodeRequest> sendResetCodeValidator,
            EmailHelper emailHelper,
            string jwtSecret
            )
        {
            _userRepository = userRepository;
            _signupValidator = signupValidator;
            _loginValidator = loginValidator;
            _httpContextAccessor = httpContextAccessor;
            _updateUserValidator = updateUserValidator;
            _resetPasswordValidator = resetPasswordValidator;
            _sendResetCodeValidator = sendResetCodeValidator;
            _emailHelper = emailHelper;
            _jwtSecret = jwtSecret;
        }

        public async Task<string> Signup(SignupRequest request)
        {
            // Validate the request
            ValidationResult validationResult = await _signupValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                throw new ArgumentException(string.Join(", ", validationResult.Errors.Select(e => e.ErrorMessage)));
            }
            // Check if the user already exists
            var existingUser = await _userRepository.GetUserByCondition(u => u.Email == request.Email);
            if (existingUser != null) return "User already exists.";

            // Create a new user
            var user = new User
            {
                UserID = Guid.NewGuid(),
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
            };

            // Save the user to the database
            await _userRepository.Signup(user);

            return "User created successfully.";
        }

        public async Task<string> Login(LoginRequest request)
        {
            // Validate the request
            ValidationResult validationResult = await _loginValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                throw new ArgumentException(string.Join(", ", validationResult.Errors.Select(e => e.ErrorMessage)));
            }
            // Find the user by email
            var user = await _userRepository.GetUserByCondition(u => u.Email == request.Email);
            if (user == null) return "User not found.";

            // Compare the passwords
            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                return "Invalid credentials.";

            // Generate a JWT token
            var token = GenerateJwtToken(user.UserID);

            // Set the token in an HTTP-only cookie
            //SetTokenCookie(token);

            return token;
        }

        public string Logout()
        {
            ClearTokenCookie();
            return "Logged out successfully.";
        }

        private string GenerateJwtToken(Guid id)
        {
            if (string.IsNullOrEmpty(_jwtSecret))
            {
                throw new InvalidOperationException("JWT_SECRET not configured.");
            }

            var tokenHandler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
            var key = System.Text.Encoding.UTF8.GetBytes(_jwtSecret);

            var tokenDescriptor = new Microsoft.IdentityModel.Tokens.SecurityTokenDescriptor
            {
                Subject = new System.Security.Claims.ClaimsIdentity(new[]
                {
                new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.NameIdentifier, id.ToString())
            }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new Microsoft.IdentityModel.Tokens.SigningCredentials(
                    new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(key),
                    Microsoft.IdentityModel.Tokens.SecurityAlgorithms.HmacSha256Signature
                )
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private void SetTokenCookie(string token)
        {
            var context = _httpContextAccessor.HttpContext;
            if (context == null) throw new InvalidOperationException("HTTP context is not available.");

            context.Response.Cookies.Append("token", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddHours(1),
                Domain = ".onrender.com",  // Allow the cookie to be sent across subdomains of onrender.com
                Path = "/"
            });
        }

        private void ClearTokenCookie()
        {
            var context = _httpContextAccessor.HttpContext;
            if (context == null) throw new InvalidOperationException("HTTP context is not available.");

            context.Response.Cookies.Delete("token");
        }

        public async Task<string> UpdateUserProfile(UpdateProfileRequest request)
        {
            ValidationResult validationResult = await _updateUserValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                throw new ArgumentException(string.Join(", ", validationResult.Errors.Select(e => e.ErrorMessage)));
            }

            var user = await _userRepository.GetUserByCondition(u => u.UserID == request.UserID);
            if (user == null) return "User not found.";

            if (!string.IsNullOrEmpty(request.NickName)) user.NickName = request.NickName;
            if (!string.IsNullOrEmpty(request.ProfilePicture)) user.ProfilePicture = request.ProfilePicture;

            await _userRepository.UpdateUserProfile(user);
            return "Profile updated successfully.";
        }

        public async Task<string> SendResetCode(SendResetCodeRequest request)
        {
            ValidationResult validationResult = await _sendResetCodeValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                throw new ArgumentException(string.Join(", ", validationResult.Errors.Select(e => e.ErrorMessage)));
            }

            var user = await _userRepository.GetUserByCondition(u => u.Email == request.Email);
            if (user == null) return "User not found.";

            var resetCode = Guid.NewGuid().ToString().Substring(0, 6);
            user.ResetCode = resetCode;

            await _userRepository.UpdateUserProfile(user);

            var subject = "Your Password Reset Code";
            var text = $"Hello,\n\nYour password reset code is: {resetCode}\n\nIf you did not request a password reset, please ignore this email.";

            await _emailHelper.SendEmailAsync(request.Email, subject, text);

            return "Reset code sent to email.";
        }

        public async Task<string> ResetPassword(ResetPasswordRequest request)
        {
            ValidationResult validationResult = await _resetPasswordValidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                throw new ArgumentException(string.Join(", ", validationResult.Errors.Select(e => e.ErrorMessage)));
            }

            var user = await _userRepository.GetUserByCondition(u => u.Email == request.Email);
            if (user == null) return "User not found.";

            if (user.ResetCode != request.ResetCode) return "Invalid reset code.";

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            user.ResetCode = null;

            await _userRepository.UpdateUserProfile(user);
            return "Password reset successfully.";
        }

        public async Task<UserResponse?> GetUserByCondition(Expression<Func<User, bool>> condition)
        {
            var user = await _userRepository.GetUserByCondition(condition);
            if (user == null) return null;

            return new UserResponse
            {
                UserID = user.UserID,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Nickname = user.NickName,
                ProfilePicture = user.ProfilePicture,
            };
        }
    }
}
