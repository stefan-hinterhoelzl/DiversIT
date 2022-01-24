import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { serverTimestamp } from 'firebase/firestore';
import { take } from 'rxjs/operators';
import { DialogComponent } from 'src/app/dialog/dialog.component';
import { Thread } from 'src/app/models/forum.model';
import { ForumService } from 'src/app/services/forum.service';

@Component({
  selector: 'app-thread-overview',
  templateUrl: './thread-overview.component.html',
  styleUrls: ['./thread-overview.component.scss']
})

export class ThreadOverviewComponent implements OnInit, OnChanges {

  @Input () inputFilterText = "";
  @Input () inputFilterTags = [];
  @Input () inputFilterTypeNew = true;
  @Input () inputFilterTypeDiscussedALot = false;
  @Input () inputFilterTypeClickedOften = false;
  @Input () inputCurrentPage = 1;
  @Output() resetPageNumEventEmitter = new EventEmitter<number>();

  allThreads: Thread[] = [];
  currentThreads : Thread[] = [];
  startIndex : number;
  endIndex : number;
  numberOfShownThreads = 5;
  numberOfMaxPage = 1;
  orderField = "";
  resetPageNumCounter = 1;

  constructor(private database: ForumService, private router: Router, private dialog: MatDialog) { }

  /**
   * LifeCycle-Method - component initializied
   * @memberof ThreadOverviewComponent
   */
  ngOnInit(){
    this.startIndex = 0;
    this.endIndex = this.numberOfShownThreads;
    this.getFirstThreads("created");
  }

  /**
   * Determine first n (=numberOfShownThreads) threads ordered by input field orderByField
   * @param {string} orderByField
   * @memberof ThreadOverviewComponent
   */
   private async getFirstThreads(orderByField: string){
    this.orderField = orderByField;
    console.log(this.inputFilterText)
    await this.database.getFirstThreads(this.numberOfShownThreads, this.orderField, this.inputFilterText).then((data) => {
      this.resetPageNumCounter++;
      this.resetPageNumEventEmitter.emit(this.resetPageNumCounter);
      this.numberOfMaxPage = 1;
      this.allThreads = data;
      this.setCurrentThreads();
    });
  }

  /**
   * Determine next n (=numberOfShownThreads) threads
   * @memberof ThreadOverviewComponent
   */
  async getNextThreads() {
    console.log(this.inputFilterText)
    await this.database.getNextThreads(this.numberOfShownThreads, this.orderField, this.inputFilterText).then((data) => {
      this.allThreads = this.allThreads.concat(data);
    })
  }

  /**
   * Determine threads which should be displayed
   * @memberof ThreadOverviewComponent
   */
  private setCurrentThreads(){
    this.currentThreads = [];
    for (let i = this.startIndex; i < this.endIndex; i++) {
      if(this.allThreads[i] != null) this.currentThreads.push(this.allThreads[i]);
    }
  }

  /**
   * Change page number and threads which should be displayed
   * @param {boolean} increase or decrease
   * @memberof ThreadOverviewComponent
   */
  private determineThreadsFromAndToIndex(increase: boolean) {
    if(increase) {
      this.startIndex += this.numberOfShownThreads;
      this.endIndex += this.numberOfShownThreads;
    } else {
      this.startIndex -= this.numberOfShownThreads;
      this.endIndex -= this.numberOfShownThreads;
    }
    this.setCurrentThreads();
  }

  /**
   * Check if input thread matches the set filter criteria
   * @param {Thread} t current thread
   * @return {*} yes or no
   * @memberof ThreadOverviewComponent
   */
  doesThreadMatchFilterCriteria(t: Thread){
    // if(this.inputFilterText.length > 0){
    //   if(t.title.toLowerCase().includes(this.inputFilterText.toLowerCase())) return true;
    // }
    var tagFound = false;
    t.tags.forEach((tag) => {
      if(this.inputFilterTags.indexOf(tag.toString()) > -1) tagFound = true;
    });
    if(tagFound) return true;
    return false;
  }

  /**
   * LifeCycle-Method - changes have been made on the input values
   * @param {SimpleChanges} changes
   * @memberof ThreadOverviewComponent
   */
  ngOnChanges(changes: SimpleChanges){
    if (changes.inputFilterText != null && changes.inputFilterText.currentValue != changes.inputFilterText.previousValue) {
      this.ngOnInit()
    } else {

      if ((changes.inputFilterTypeNew != null) && (changes.inputFilterTypeNew.currentValue === true)) this.getFirstThreads("created");
      if ((changes.inputFilterTypeDiscussedALot != null) && (changes.inputFilterTypeDiscussedALot.currentValue === true)) this.getFirstThreads("numberOfAnswers");
      if ((changes.inputFilterTypeClickedOften != null) && (changes.inputFilterTypeClickedOften.currentValue === true)) this.getFirstThreads("views");
      if (changes.inputCurrentPage != null) {
        if(changes.inputCurrentPage.currentValue > this.numberOfMaxPage) {
          this.getNextThreads().then(() => {
            this.numberOfMaxPage = changes.inputCurrentPage.currentValue;
            this.determineThreadsFromAndToIndex((changes.inputCurrentPage.currentValue > changes.inputCurrentPage.previousValue));
          });
        } else {
          this.determineThreadsFromAndToIndex((changes.inputCurrentPage.currentValue > changes.inputCurrentPage.previousValue));
        }
      }
    }
  }

  /**
   * Open a thread / forum with a input Forum-Id
   * @param {number} forumId
   * @memberof ThreadOverviewComponent
   */
  navigateToForumThread(forumId : number) {
    this.router.navigate(['/forum/' + forumId.toString()]);
  }

  /**
   * Open a Dialog for creating a new forum
   * @memberof ThreadOverviewComponent
   */
  openDialogToCreateForum(){
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "40%",
      data: {
        header: "Neues Forum anlegen",
        placeholderForInputArea: "Forumstitel",
        placeholderForInput: "Forumstext",
        placeholderForSelectName: "Forumstags",
        placeholderForSelectValues: ['HTL', 'HAK', 'BAKIP', 'Girls only', 'Freelance', 'Web', '18-24 Jahre'],
        buttonTextConfirm: "Anlegen",
        buttonTextAbort: "Abbrechen",
      },
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (result != null) {
        this.database.createThread(<Thread>{
          title: result.inputAreaValue,
          text: result.inputValue,
          tags: result.inputSelectValues,
          keywords: this.generateSearchKeyWords(result.inputAreaValue),
          created: serverTimestamp()
        }).then(() => {
          window.location.reload()
        })
      }
    });
  }


  /**
   * Helper Method to Create the Keyword Search for Titles in the Forum Overview
   * @param title
   * @returns
   */
  generateSearchKeyWords(title: string) {
    let array = []
    array.push[" "];
    title = title.toLowerCase();
    let wordsArray = title.split(" ");

    for (let j = 0; j < wordsArray.length; j++) {
      for (let i = 0; i <= wordsArray[j].length; i++) {
        array.push(wordsArray[j].substring(i,title.length))
        array.push(wordsArray[j].substring(0, i))
      }
    }
    array = array.filter((value)=> {return value!=""})
    array.push("")
    return array;

  }

}
