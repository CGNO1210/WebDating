using repos.Datingapp.API.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class Messages
    {
        public int Id { get; set; }
        public int SenderId { get; set; }
        public string SenderUserName { get; set; }
        public AppUser Sender { get; set; }
        public int RecipientId { get; set; }
        public string RecipientIdUserName { get; set; }
        public AppUser Recipient { get; set; }
        public string Content { get; set; }
        public DateTime? DateRead { get; set; }
        public DateTime MessageSent { get; set; } = DateTime.Now;
        public bool SenderDeleted { get; set; }
        public bool RecipientDeleted { get; set; }
    }
}
