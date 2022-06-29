import { CoursesStore } from './../services/courses.store';
import { MessagesService } from './../messages/messages.service';
import { LoadingService } from './../loading/loading.service';
import {Component, OnInit} from '@angular/core';
import {Course, sortCoursesBySeqNo} from '../model/course';
import {interval, noop, Observable, of, throwError, timer} from 'rxjs';
import {catchError, delay, delayWhen, filter, finalize, map, retryWhen, shareReplay, tap} from 'rxjs/operators';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {CourseDialogComponent} from '../course-dialog/course-dialog.component';
import { CoursesService } from '../services/courses.service';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;

  advancedCourses$: Observable<Course[]>;

 

  constructor(
    private dialog: MatDialog, 
    private coursesService: CoursesService, 
    private loadingService:LoadingService,
    private messagesService: MessagesService,
    private coursesStore: CoursesStore) {

  }
  

  ngOnInit() {

    this.reloadCourses();

  }

  reloadCourses() {

    this.loadingService.loadingOn();

    const courses$ = this.coursesService.loadAllCourses()
      .pipe(
        map(courses => courses.sort(sortCoursesBySeqNo)),
        finalize(() => this.loadingService.loadingOff()),
        catchError(err => {
          const message = "Could not load courses";
          this.messagesService.showErrors(message);
          console.log(message, err);
          return throwError(err);
        }),
        
      );

    this.beginnerCourses$ = courses$
      .pipe(
        map(courses => courses.filter(courses => courses.category === "BEGINNER"))
      );

      this.advancedCourses$ = courses$
      .pipe(
        map(courses => courses.filter(courses => courses.category === "ADVANCED"))
      );
  }



  // editCourse Method should be moved to a newly created courses-card-list component 

//   editCourse(course: Course) { 

//     const dialogConfig = new MatDialogConfig();

//     dialogConfig.disableClose = true;
//     dialogConfig.autoFocus = true;
//     dialogConfig.width = "400px";

//     dialogConfig.data = course;

//     const dialogRef = this.dialog.open(CourseDialogComponent, dialogConfig);

//   }



}




