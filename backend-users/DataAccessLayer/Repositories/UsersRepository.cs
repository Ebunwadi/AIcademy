using DataAccessLayer.Context;
using DataAccessLayer.Entities;
using DataAccessLayer.RepositoryContracts;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;


namespace DataAccessLayer.Repositories

{
    public class UsersRepository : IUsersRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public UsersRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<string> Signup(User user)
        {
            try
            {
                _dbContext.Users.Add(user);
                await _dbContext.SaveChangesAsync();
                return "sucess";
            }
            catch (DbUpdateException ex)
            {
                // Log the exception or inspect it
                Console.WriteLine(ex.InnerException?.Message);
                return null;
            }
        }

        public async Task<User?> Login(string email, string password)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            {
                return null; // Invalid credentials
            }
            return user; // Successful login
        }

        public Task<bool> Logout()
        {
            // Logic for logout (e.g., clear token/session) can be added here
            return Task.FromResult(true); // Placeholder
        }

        public async Task<User?> UpdateUserProfile(User user)
        {
            var existingUser = await _dbContext.Users.FirstOrDefaultAsync(u => u.UserID == user.UserID);
            if (existingUser == null)
            {
                return null; // User not found
            }

            // Update fields only if provided
            if (!string.IsNullOrEmpty(user.NickName))
                existingUser.NickName = user.NickName;

            if (!string.IsNullOrEmpty(user.ProfilePicture))
                existingUser.ProfilePicture = user.ProfilePicture;

            await _dbContext.SaveChangesAsync();
            return existingUser;
        }

        public async Task<bool> ResetPassword(string email, string newPassword, string resetCode)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null || user.ResetCode != resetCode)
            {
                return false; // User not found or invalid reset code
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword); // Hash the new password
            user.ResetCode = null; // Clear the reset code
            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> SendResetCode(string email)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                return false; // User not found
            }

            // Generate a reset code
            var resetCode = Guid.NewGuid().ToString().Substring(0, 6); // 6-character code
            user.ResetCode = resetCode;

            // Save the reset code in the database
            await _dbContext.SaveChangesAsync();

            // Simulate sending email
            Console.WriteLine($"Reset code for {email}: {resetCode}");
            return true;
        }

        public async Task<User?> GetUserByCondition(Expression<Func<User, bool>> condition)
        {
            return await _dbContext.Users.FirstOrDefaultAsync(condition);
        }       
    }
}
