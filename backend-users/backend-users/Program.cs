using backend_users.Controller;
using backend_users.Middleware;
using BusinessLogicLayer;
using DataAccessLayer;
using FluentValidation.AspNetCore;


var builder = WebApplication.CreateBuilder(args);

//Add DAL and BLL services
builder.Services.AddDataAccessLayer(builder.Configuration);
builder.Services.AddBusinessLogicLayer(builder.Configuration);

builder.Services.AddControllers();

//FluentValidations
builder.Services.AddFluentValidationAutoValidation();


//Cors
builder.Services.AddCors(options => {
    options.AddDefaultPolicy(builder => {
        builder.WithOrigins("https://aicademy-12mi.onrender.com", "http://localhost:5000")
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
    });
});


var app = builder.Build();

app.UseExceptionHandlingMiddleware();
app.UseRouting();

//Cors
app.UseCors();

app.UseStaticFiles();

//Auth
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapUserAPIEndpoints();


app.Run();
