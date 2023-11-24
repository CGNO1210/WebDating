import { Component, OnInit } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.css']
})
export class MembersListComponent implements OnInit {
  members: Member[] = []
  pagination!:Pagination;
  userParams!:  UserParams;
  user!: User
  genderList = [{value: 'male',display:'Males'},{value: 'female',display: 'Females'}]

  constructor(private memberService: MembersService) {
    this.userParams = this.memberService.getUserParams();
   }

  ngOnInit() : void {
    this.loadMember()
  }
  loadMember() {
    this.memberService.setUserParams(this.userParams)
    this.memberService.getMembers(this.userParams).subscribe(response =>{
      this.members = response.result;
      this.pagination = response.pagination;
    })
  }

  resetFilters() {
    this.userParams = this.memberService.resetUserParams()
    this.loadMember()
  }

  pageChanged(event : any){
    this.userParams.pageNumber = event.page
    this.memberService.setUserParams(this.userParams)
    this.loadMember()
  }
}
