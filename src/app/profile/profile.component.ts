import { Component, OnInit , ElementRef, Input} from '@angular/core';
import { UserInfoComponent } from './user-info/user-info.component';
import { UserGamesComponent } from './user-games/user-games.component';
import { ActivatedRoute } from '@angular/router';

const URL = 'http://localhost:8080/app/uploads';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {

	constructor(private route: ActivatedRoute){}
	
	ngOnInit() {
    
  }
}
