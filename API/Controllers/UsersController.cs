using API.Controllers;
using API.DTOs;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using repos.Datingapp.API.Data;
using repos.Datingapp.API.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace repos.Datingapp.API.Controllers
{
    //[Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;

        public UsersController(IUserRepository userRepository, IMapper mapper, IPhotoService photoService)
        {
            _mapper = mapper;
            _photoService = photoService;
            _userRepository = userRepository;
        }


        [HttpGet]

        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers([FromQuery]UserParams userParams)
        {

            var user = await _userRepository.GetUserByUsernameAsync(User.GetUserName());
            userParams.CurentUsername = user.UserName;
            if(string.IsNullOrEmpty(userParams.Gender))
            {
                userParams.Gender = user.Gender == "male" ? "female" : "male";

            }

            var users = await _userRepository.GetMembersAsync(userParams);
            Response.AddPaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);
            return Ok(users);
        }
        // api/user/3
        [HttpGet("{username}",Name = "GetUser")]
        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {
            return await _userRepository.GetMemberAsync(username);
        }


        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {
            var username = User.GetUserName();
            var user = await _userRepository.GetUserByUsernameAsync(username);
            _mapper.Map(memberUpdateDto, user);
            _userRepository.update(user);
            if (await _userRepository.SaveAllAsync())
                return NoContent();
            return BadRequest("failed to update user");

        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            var users = await _userRepository.GetUserByUsernameAsync(User.GetUserName());
            var result = await _photoService.AddPhotoAsync(file);
            if (result.Error != null) return BadRequest(result.Error.Message);
            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };
            if(users.Photos.Count == 0)
            {
                photo.IsMain = true;
            }
            users.Photos.Add(photo);
            if(await _userRepository.SaveAllAsync())
            {
                return CreatedAtRoute("GetUser",new {username = users.UserName }, _mapper.Map<PhotoDto>(photo));
            }
            return BadRequest("Problem adding photo");
        }
        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUserName());
            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);
            if(photo.IsMain) return BadRequest("this is already your main photo");
            var currentMain = user.Photos.FirstOrDefault(x => x.IsMain);
            if (currentMain != null) currentMain.IsMain = false;
            photo.IsMain = true;
            if (await _userRepository.SaveAllAsync()) return NoContent();
            return BadRequest("failed to set main photo");
        }

        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUserName());
            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);
            if (photo == null) return NotFound();
            if (photo.IsMain) return BadRequest("You cannot delete your main photo");
            if(photo.PublicId != null)
            {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Error != null) return BadRequest(result.Error.Message);

            }
            user.Photos.Remove(photo);
            if (await _userRepository.SaveAllAsync()) return Ok();

            return BadRequest("failed to delete the photo");
        }
    }
}