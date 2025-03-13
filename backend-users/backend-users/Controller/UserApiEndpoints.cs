using BusinessLogicLayer.DTO;
using BusinessLogicLayer.ServiceContracts;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend_users.Controller;

public static class UserAPIEndpoints
{
    public static IEndpointRouteBuilder MapUserAPIEndpoints(this IEndpointRouteBuilder app)
    {
        // POST /api/auth/signup
        app.MapPost("/api/auth/signup", async (
            IUsersService userService,
            IValidator<SignupRequest> signupValidator,
            [FromBody] SignupRequest signupRequest) =>
        {
            ValidationResult validationResult = await signupValidator.ValidateAsync(signupRequest);
            if (!validationResult.IsValid)
            {
                return Results.ValidationProblem(validationResult.ToDictionary());
            }

            string result = await userService.Signup(signupRequest);
            if (result == "User already exists.")
            {
                return Results.BadRequest(new { Message = result });
            }
            return Results.Ok(new { Message = result });
        });

        // POST /api/users/login
        app.MapPost("/api/auth/login", async (
            IUsersService userService,
            IValidator<LoginRequest> loginValidator,
            [FromBody] LoginRequest loginRequest) =>
        {
            ValidationResult validationResult = await loginValidator.ValidateAsync(loginRequest);
            if (!validationResult.IsValid)
            {
                return Results.ValidationProblem(validationResult.ToDictionary());
            }

            string token = await userService.Login(loginRequest);
            return Results.Ok(new { token });
        });

        // POST /api/users/logout
        app.MapPost("/api/auth/logout", (IUsersService userService) =>
        {
            string result = userService.Logout();
            return Results.Ok(new { Message = result });
        });

        // PUT /api/user/update
        app.MapPut("/api/user/update", async (
            IUsersService userService,
            IValidator<UpdateProfileRequest> updateProfileValidator,
            HttpRequest request) =>
        {
            // Extract the file and form data
            // Handle profile picture upload
            var form = await request.ReadFormAsync();
            var profilePictureFile = form.Files.FirstOrDefault(); // Nullable, may be null if no file is uploaded
            var nickname = form["NickName"].FirstOrDefault();
            var userIdString = form["UserID"].FirstOrDefault();

            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
            {
                return Results.BadRequest(new { Message = "Invalid or missing UserID." });
            }

            // Process Profile Picture (Handle Null)
            string? profilePicturePath = null;
            if (profilePictureFile != null)
            {
                var uploadsDirectory = Path.Combine("wwwroot", "uploads");
                if (!Directory.Exists(uploadsDirectory))
                {
                    Directory.CreateDirectory(uploadsDirectory);
                }

                var uniqueFileName = $"{Guid.NewGuid()}_{profilePictureFile.FileName}";
                var filePath = Path.Combine(uploadsDirectory, uniqueFileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await profilePictureFile.CopyToAsync(stream);
                }
                profilePicturePath = $"/uploads/{uniqueFileName}"; // Path for serving the file
            }

            // Create the request object with proper null handling
            var updateProfileRequest = new UpdateProfileRequest
            {
                UserID = userId,
                NickName = nickname,
                ProfilePicture = profilePicturePath // This may remain null if no file was uploaded
            };

            // Validate the request
            ValidationResult validationResult = await updateProfileValidator.ValidateAsync(updateProfileRequest);
            if (!validationResult.IsValid)
            {
                return Results.ValidationProblem(validationResult.ToDictionary());
            }

            // Call the service
            string result = await userService.UpdateUserProfile(updateProfileRequest);
            return Results.Ok(new { Message = result });

        });


        // POST /api/users/send-reset-code
        app.MapPost("/api/users/send-reset-code", async (
            IUsersService userService,
            IValidator<SendResetCodeRequest> sendResetCodeValidator,
            [FromBody] SendResetCodeRequest sendResetCodeRequest) =>
        {
            ValidationResult validationResult = await sendResetCodeValidator.ValidateAsync(sendResetCodeRequest);
            if (!validationResult.IsValid)
            {
                return Results.ValidationProblem(validationResult.ToDictionary());
            }

            string result = await userService.SendResetCode(sendResetCodeRequest);
            return Results.Ok(new { Message = result });
        });

        // POST /api/users/reset-password
        app.MapPost("/api/users/reset-password", async (
            IUsersService userService,
            IValidator<ResetPasswordRequest> resetPasswordValidator,
            [FromBody] ResetPasswordRequest resetPasswordRequest) =>
        {
            ValidationResult validationResult = await resetPasswordValidator.ValidateAsync(resetPasswordRequest);
            if (!validationResult.IsValid)
            {
                return Results.ValidationProblem(validationResult.ToDictionary());
            }

            string result = await userService.ResetPassword(resetPasswordRequest);
            return Results.Ok(new { Message = result });
        });

        // GET /api/users/{id:guid}
        app.MapGet("/api/users/{id:guid}", async (
            IUsersService userService, Guid id) =>
        {
            var user = await userService.GetUserByCondition(u => u.UserID == id);
            if (user == null)
            {
                return Results.NotFound(new { Message = "User not found." });
            }

            return Results.Ok(user);
        });

        return app;
    }

    // Extension method for converting FluentValidation errors into a dictionary
    private static Dictionary<string, string[]> ToDictionary(this ValidationResult validationResult)
    {
        return validationResult.Errors
            .GroupBy(err => err.PropertyName)
            .ToDictionary(
                grp => grp.Key,
                grp => grp.Select(err => err.ErrorMessage).ToArray());
    }
}
