import { Component, OnInit } from '@angular/core';
import { DiversITUser } from '../models/users.model';
import { LoadingService } from '../services/loading.service';
import { UserService } from '../services/user.service';
import { ObserversService } from '../services/observers.service';
import { take } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  constructor(private userService: UserService, private loading: LoadingService, private observer: ObserversService) { }

  mentors: DiversITUser[]
  savecopy: DiversITUser[] = []
  currentUser: DiversITUser
  matchingValues = {}
  showSpinner = true;
  gender = ['Männlich', 'Weiblich', 'Divers'];
  job = ['Schüler', 'Student', 'IT-Systemadministrator', 'IT-Techniker', 'UX-Designer', 'Software Engineer', 'Universitätsprofessor für Informatik', 'Scrum Master', 'DevOps Engineer', 'Product Owner'].sort();;
  primaryEducation = ['Hauptschule', 'Gymnasium'];
  secondaryEducation = ['Gymnasium', 'HAK', 'HTL'];
  universityEducation = ['Bachelorstudium', 'Masterstudium', 'Doktorat'];

  genderControl = new FormControl('');
  primaryControl = new FormControl('');
  secondaryControl = new FormControl('');
  universityControl = new FormControl('');
  jobControl = new FormControl('');
  textSearch = new FormControl('');



  async ngOnInit() {
    this.loading.show();
    this.mentors = await this.userService.getAllMentorsPromise();
    this.mentors.forEach(val => this.savecopy.push(Object.assign({}, val)));
    this.observer.currentUserStatus.pipe(take(1)).subscribe((data:DiversITUser) => {
      this.currentUser = data;
    });
    this.computeMatchings()
    this.sortArray();
    this.loading.hide();
  }


  computeMatchings() {

    //evaluate the matching for each mentor
    for (let i = 0; i<this.mentors.length; i++) {
      let matchingscore = 0;
      let currentMentor: DiversITUser = this.mentors[i];

      //gender matching +3 otherways +0
      if (this.currentUser.gender == currentMentor.gender) matchingscore += 3;

      //primary education: exact match 10 points otherways 5. If no value 0 points
      if (this.currentUser.primaryEducation == currentMentor.primaryEducation) matchingscore += 10;
      else if ((this.currentUser.primaryEducation == "Hauptschule" && currentMentor.primaryEducation == "Gymnasium") || (this.currentUser.primaryEducation == "Gymnasium" && currentMentor.primaryEducation == "Hauptschule")) matchingscore += 5;

      //secondary Education: exact match 20 points. HAK and HTL 10 Points. HAK/HTL - Gymnasium 5 Points. If no value 0 points
      if (this.currentUser.secondaryEducation == currentMentor.secondaryEducation) matchingscore += 20;
      else if ((this.currentUser.secondaryEducation == "HAK" && currentMentor.secondaryEducation == "HTL") || (this.currentUser.secondaryEducation == "HTL" && currentMentor.secondaryEducation == "HAK")) matchingscore += 10
      else if (this.currentUser.secondaryEducation != "Keine Angabe" && currentMentor.secondaryEducation != "Keine Angabe") matchingscore += 5

      //universityEducation: exact match 20 points. Bach - Master 15 points -- still rather close. Otherways 10. If no value 0
      if (this.currentUser.universityEducation == currentMentor.universityEducation) matchingscore += 20;
      else if ((this.currentUser.universityEducation == "Bachelorstudium" && currentMentor.universityEducation == "Masterstudium") || (this.currentUser.universityEducation == "Masterstudium" && currentMentor.universityEducation == "Bachelorstudium")) matchingscore += 15;
      else if (this.currentUser.universityEducation != "Keine Angabe" && currentMentor.universityEducation != "Keine Angabe") matchingscore += 10;

      //job: If match 10 points. Any work 7 Points. No value on one again 0
      if (this.currentUser.job == currentMentor.job) matchingscore += 10;
      else if ((this.currentUser.job != "Student" && this.currentUser.job != "Keine Angabe") && (currentMentor.job != "Student" && currentMentor.job != "Keine Angabe")) matchingscore += 7

      //perfect match: 3+10+20+20+10=63

      let match = matchingscore/63 *100

      this.matchingValues[currentMentor.uid] = match.toFixed(0);
    }
  }

  imageLoaded(){
    this.showSpinner = false;
  }

  onFilterChanged(event: any) {
    this.mentors = []
    this.savecopy.forEach(val => this.mentors.push(Object.assign({}, val)));

    //gender filter
    if (this.genderControl.value.length > 0) {
      this.mentors = this.mentors.filter((mentor) => {return this.genderControl.value.includes(mentor.gender)});
    }

    //primary education filter
    if (this.primaryControl.value.length > 0) {
      this.mentors = this.mentors.filter((mentor) => {return this.primaryControl.value.includes(mentor.primaryEducation)});
    }

    //secondary education filter
    if (this.secondaryControl.value.length > 0) {
      this.mentors = this.mentors.filter((mentor) => {return this.secondaryControl.value.includes(mentor.secondaryEducation)});
    }

    //tertiary education filter
    if (this.universityControl.value.length > 0) {
      this.mentors = this.mentors.filter((mentor) => {return this.universityControl.value.includes(mentor.universityEducation)});
    }

    //job education filter
    if (this.jobControl.value.length > 0) {
      this.mentors = this.mentors.filter((mentor) => {return this.jobControl.value.includes(mentor.job)});
    }

    //text filter
    if (this.textSearch.value != "") {
      this.mentors = this.mentors.filter((mentor) => {return (mentor.firstname.toLowerCase().includes(this.textSearch.value.toLowerCase()) || mentor.lastname.toLowerCase().includes(this.textSearch.value.toLowerCase()))})
    }
    this.sortArray();
  }

  sortArray() {
    this.mentors.sort((mentor1, mentor2) => {
      return this.matchingValues[mentor2.uid] - this.matchingValues[mentor1.uid]
    });
  }

}
