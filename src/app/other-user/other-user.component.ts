import { Component, OnInit } from '@angular/core';
import { Http, Response, RequestOptions, Headers, Request, RequestMethod} from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '../app.service';
import { OtherUserService } from './other-user.service';
import { UserInfo } from '../profile/user-info/user-info';
import { UserGame } from '../profile/user-games/user-games';
import { OnClickEvent, OnRatingChangeEven, OnHoverRatingChangeEvent } from 'angular-star-rating/star-rating-struct';

@Component({
  selector: 'app-other-user',
  templateUrl: './other-user.component.html',
  styleUrls: ['./other-user.component.scss'],
  providers: [OtherUserService, AppService]
})

export class OtherUserComponent implements OnInit {

  errorMessage: string;
  status: string;
  userInfo: UserInfo;
  userGame: UserGame[];
  userID: string;

  constructor( 
    private http: Http,    
    private activeRoute: ActivatedRoute,
    private otherUserService: OtherUserService,
    private appService: AppService
  ) {}


  ngOnInit() {
    let login = this.activeRoute.snapshot.params['login'];
    this.getUserInfo(login);
  }

  getUserInfo(login: string) {
    this.otherUserService.getUserInfo(login)
                     .subscribe(
                        userInfo => {
                          this.userInfo = userInfo;
                          this.getUserID(userInfo);
                        },
                        error => this.errorMessage = <any>error);
  }

  getUserID(userInfo: any){
    this.getUserGames(userInfo._id);
  }

  getUserGames(id: string) {
    this.otherUserService.getUserGames(id)
      .subscribe(
                  userGame => this.userGame = userGame.reverse(),
                  error => this.errorMessage = <any>error);
  }


  onHoverRatingChangeResult:OnHoverRatingChangeEvent;
	
	onHoverRatingChange = ($event:OnHoverRatingChangeEvent) => {
		this.onHoverRatingChangeResult = $event;
	};


}