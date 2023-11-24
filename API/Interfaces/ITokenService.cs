using repos.Datingapp.API.Entities;

namespace API.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(AppUser user);
    }
}