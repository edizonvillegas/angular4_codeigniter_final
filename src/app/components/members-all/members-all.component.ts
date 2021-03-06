import { Component, OnInit } from '@angular/core';
import { MembersService } from '../../services/members/members.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { SetStatusPipe } from '../../pipes/status/set-status.pipe';
import { Observable, Subject } from 'rxjs/Rx';

declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-members-all',
  templateUrl: './members-all.component.html',
  styleUrls: ['./members-all.component.css']
})
export class MembersAllComponent implements OnInit {

  name:string;
  
  public keyUp = new Subject<any>();

  constructor(
    private _membersService: MembersService,
    private _router: ActivatedRoute,
    private _setStatus: SetStatusPipe
  ){
    const subscription = this.keyUp
    .map(event => event.target.value)
    .debounceTime(500)
    .distinctUntilChanged()
    .flatMap(search => Observable.of(search).delay(500))
    .subscribe(data => {
      this.search(data)
    });
  }

  members$: Observable<any[]>;
  myGroup;
  searchText;

  ngOnInit() {
    this.myGroup = new FormGroup({
      searchText: new FormControl('')
    })

    let page = this._router.snapshot.params['page'];
    page != 'edit' ? this.members$ = this._membersService.getMembers() : "";
  }

  delete(id) {
    this._membersService.deleteUser(id);
    var countTr = $('tr:not([style])').length - 1;
    $("body li:last-child()").click(function(event){
      if (countTr == 1) {
        $('table').hide("slow", function() {
          $('#deleteMsg').text('No Member');
        });
      }
      $(event.target).parents('tr').fadeOut();
      $('#deleteMsg').text('member with id # '+id+' moved to archived!').show().delay(5000).fadeOut();
    });
  }

  search(str) {
    if(str.length > 0){
      this.members$ = this._membersService.searchMember(str);
    } else {
      this.members$ = this._membersService.getMembers();
    }
  }

}
