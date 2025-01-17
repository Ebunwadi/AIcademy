using DataAccessLayer.Entities;
using System.Linq.Expressions;

namespace DataAccessLayer.RepositoryContracts
{
    /// <summary>
    /// Represents a repository for managing 'users' table
    /// </summary>
    public interface IUsersRepository
    {
        /// <summary>
        /// Signs up a new user into the users table asynchronously.
        /// </summary>
        /// <param name="user">The user to be signed up</param>
        /// <returns>Returns the created user object or null if unsuccessful</returns>
        Task<string> Signup(User user);

        /// <summary>
        /// Logs in a user asynchronously by verifying their credentials.
        /// </summary>
        /// <param name="email">The email of the user</param>
        /// <param name="password">The plaintext password of the user</param>
        /// <returns>Returns the authenticated user object or null if unsuccessful</returns>
        Task<User?> Login(string email, string password);

        /// <summary>
        /// Logs out a user by removing their active session.
        /// </summary>
        /// <returns>Returns true if logout is successful</returns>
        Task<bool> Logout();

        /// <summary>
        /// Updates an existing user profile asynchronously.
        /// </summary>
        /// <param name="user">The user object containing updated details</param>
        /// <returns>Returns the updated user object or null if not found</returns>
        Task<User?> UpdateUserProfile(User user);

        /// <summary>
        /// Resets the password for a user asynchronously.
        /// </summary>
        /// <param name="email">The email of the user</param>
        /// <param name="newPassword">The new password to set</param>
        /// <param name="resetCode">The reset code sent to the user</param>
        /// <returns>Returns true if the password reset is successful</returns>
        Task<bool> ResetPassword(string email, string newPassword, string resetCode);

        /// <summary>
        /// Sends a reset code to the user's email address asynchronously.
        /// </summary>
        /// <param name="email">The email of the user</param>
        /// <returns>Returns true if the reset code is sent successfully</returns>
        Task<bool> SendResetCode(string email);

        /// <summary>
        /// Retrieves a user based on a specified condition.
        /// </summary>
        /// <param name="condition">The condition to filter the user (e.g., email, user ID).</param>
        /// <returns>
        /// Returns the first user that matches the given condition,
        /// or null if no user is found.
        /// </returns>
        Task<User?> GetUserByCondition(Expression<Func<User, bool>> condition);
    }
}

