using System.Net;
using System.Net.Mail;

namespace BusinessLogicLayer.Helpers
{
    public class EmailHelper
    {
        private readonly string _smtpServer;
        private readonly int _smtpPort;
        private readonly string _emailSender;
        private readonly string _emailPassword;

        public EmailHelper(string smtpServer, int smtpPort, string emailSender, string emailPassword)
        {
            _smtpServer = smtpServer;
            _smtpPort = smtpPort;
            _emailSender = emailSender;
            _emailPassword = emailPassword;
        }

        public async Task SendEmailAsync(string to, string subject, string body)
        {
            using var smtpClient = new SmtpClient(_smtpServer, _smtpPort)
            {
                Credentials = new NetworkCredential(_emailSender, _emailPassword),
                EnableSsl = true
            };

            using var mailMessage = new MailMessage
            {
                From = new MailAddress(_emailSender),
                Subject = subject,
                Body = body,
                IsBodyHtml = false // Set to true if you want HTML emails
            };

            mailMessage.To.Add(to);

            await smtpClient.SendMailAsync(mailMessage);
        }
    }
}
