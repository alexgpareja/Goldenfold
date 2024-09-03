using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using HospitalApi; 
using BCrypt.Net;
using Microsoft.EntityFrameworkCore; 
using HospitalApi.Models;
namespace HospitalApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] Login loginRequest)
        {
            if (ModelState.IsValid)
            {
                // Buscar el usuario en la base de datos e incluir el rol
                var usuario = _context.Usuarios
                    .Include(u => u.Rol) // Incluir el rol asociado al usuario
                    .FirstOrDefault(u => u.NombreUsuario == loginRequest.Username);

                // Verificar si el usuario existe y si la contraseña es correcta
                if (usuario == null || !(loginRequest.Password == usuario.Contrasenya))
                {
                    return Unauthorized(new { message = "Credenciales inválidas" });
                }

                // Emitir el token JWT si las credenciales son válidas
                var token = GenerateJwtToken(usuario);

                return Ok(new { Token = token });
            }

            return BadRequest("Request no válida");
        }

        // Método para generar el token JWT
        private string GenerateJwtToken(Usuario usuario)
        {
            // Crear la clave de seguridad simétrica
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            // Definir los claims básicos
            var claims = new List<Claim>
            {
                new Claim("UserId", usuario.IdUsuario.ToString()),
                new Claim(ClaimTypes.NameIdentifier, usuario.NombreUsuario),
                new Claim(ClaimTypes.Email, usuario.NombreUsuario), // Suponiendo que el nombre de usuario es único
                new Claim(JwtRegisteredClaimNames.Sub, usuario.IdUsuario.ToString()),
                new Claim(ClaimTypes.Role, usuario.Rol.NombreRol) // Añadir el rol como claim
            };

            // Crear el token JWT
            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
