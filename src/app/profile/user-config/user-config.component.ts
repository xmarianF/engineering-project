import { Component, ElementRef, OnInit } from '@angular/core';
import { Http, Response, RequestOptions, Headers, Request, RequestMethod} from '@angular/http';
import { UserConfigService } from './user-config.service';
import { AppService } from '../../app.service';
import { UserInfo } from '../user-info/user-info';
import { FlashMessagesService } from 'angular2-flash-messages';
import { IMyOptions} from 'mydatepicker';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';


@Component({
  selector: 'app-user-config',
  templateUrl: './user-config.component.html',
  styleUrls: ['./user-config.component.css'],
  providers: [UserConfigService, AppService]
})


export class UserConfigComponent implements OnInit {

  errorMessage: string;
  status: string;
  userInfo: UserInfo;
  avatarImgName: string;

  currentDate = new Date();

  public URL = this.appService.getUrl('/app/avatarUpload');
  public avatarUploader:FileUploader = new FileUploader({url: this.URL, itemAlias: 'photo'});

  constructor(private http: Http,
              private el: ElementRef,
              private appService: AppService,
              private userConfigService: UserConfigService,
              private flashMessage:FlashMessagesService) { }

  private myDatePickerOptions: IMyOptions = {
        dateFormat: 'dd-mm-yyyy',
        showTodayBtn: false,
        maxYear: this.currentDate.getFullYear()
    };

    model = {
      datepicker: { date: {year: 2000, month: 1, day: 1 }},
      dateBirth: '',
      city: '',
      contactNumber: '',
      password: '',
      confirmPassword: ''
    }

  ngOnInit() {
    this.getUserInfo();
    this.avatarUploader.onAfterAddingFile = (file)=> { file.withCredentials = false; };
    this.avatarUploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {};
  }

  file: File;
  onChange(event: EventTarget) {
    let eventObj: MSInputMethodContext = <MSInputMethodContext> event;
    let target: HTMLInputElement = <HTMLInputElement> eventObj.target;
    let files: FileList = target.files;
    this.file = files[0];
    this.avatarImgName = this.file.name;
  }

  //get user information

  getUserInfo() {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    var userID = currentUser._id;

    this.userConfigService.getUser(userID)
                     .subscribe(
                        userInfo => {
                          this.userInfo = userInfo;
                          this.model.dateBirth = userInfo.dateBirth;
                        },
                        error => this.errorMessage = <any>error);
  }

  //edit user information

  editUserInfo(id: string, city: string, contactNumber: string, avatarImage: string, password: string) {

    var d = this.model.datepicker.date.year;
    var m =this.model.datepicker.date.month;
    var y = this.model.datepicker.date.day;
    var date = '' + y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);

    this.userConfigService.updateUser(id, date, city, contactNumber, this.avatarImgName, password)
                     .subscribe(
                        userInfo  => {
                          this.userInfo;
                          this.getUserInfo();
                          this.flashMessage.show('Dane użytkownika zostały zmienione.', {cssClass: 'alert-success', timeout: 3000});
                        },
                        error =>  {
                          this.errorMessage = <any>error
                        });
  }
}