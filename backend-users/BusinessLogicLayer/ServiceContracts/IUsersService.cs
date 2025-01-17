using BusinessLogicLayer.DTO;
using DataAccessLayer.Entities;
using System.Linq.Expressions;

namespace BusinessLogicLayer.ServiceContracts;

/// <summary>
/// Defines the contract for user-related operations in the application.
/// </summary>
public interface IUsersService
{
    /// <summary>
    /// Registers a new user in the system.
    /// </summary>
    /// <param name="signupRequest">The signup details provided by the user.</param>
    /// <returns>A success message or an error message.</returns>
    Task<string> Signup(SignupRequest signupRequest);

    /// <summary>
    /// Authenticates a user based on provided credentials.
    /// </summary>
    /// <param name="loginRequest">The login details including email and password.</param>
    /// <returns>A success message or an error message upon login.</returns>
    Task<string> Login(LoginRequest loginRequest);

    /// <summary>
    /// Logs out a user by clearing their session or token.
    /// </summary>
    /// <returns>A success message upon logout.</returns>
    string Logout();

    /// <summary>
    /// Updates the profile details of an existing user.
    /// </summary>
    /// <param name="updateProfileRequest">The details to be updated, such as nickname or profile picture.</param>
    /// <returns>A success message upon updating the profile.</returns>
    Task<string> UpdateUserProfile(UpdateProfileRequest updateProfileRequest);

    /// <summary>
    /// Sends a password reset code to the user's registered email address.
    /// </summary>
    /// <param name="sendResetCodeRequest">The request containing the user's email.</param>
    /// <returns>A success message or an error message.</returns>
    Task<string> SendResetCode(SendResetCodeRequest sendResetCodeRequest);

    /// <summary>
    /// Resets a user's password based on a valid reset code.
    /// </summary>
    /// <param name="resetPasswordRequest">The request containing the reset code, new password, and email.</param>
    /// <returns>A success message or an error message.</returns>
    Task<string> ResetPassword(ResetPasswordRequest resetPasswordRequest);

    /// <summary>
    /// Retrieves a user based on the provided condition.
    /// </summary>
    /// <param name="condition">The condition to find the user.</param>
    /// <returns>The user matching the condition, or null if not found.</returns>
    Task<UserResponse?> GetUserByCondition(Expression<Func<User, bool>> condition);
}
