import { Component, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent {
  @Input() member! : Member

  constructor(private memberService: MembersService,private toastr:ToastrService) {}

  ngOnInit() : void {

  }

  addLike(member: Member) {
    this.memberService.addLike(this.member.username).subscribe(()=>{
      this.toastr.success('You have liked ' + this.member.knownAs)
    })
  }
}