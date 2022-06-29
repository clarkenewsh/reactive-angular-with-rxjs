import { MessagesService } from './../messages/messages.service';
import { LoadingService } from './../loading/loading.service';
import { CoursesService } from './../services/courses.service';
import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {Course} from "../model/course";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import * as moment from 'moment';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Component({
    selector: 'course-dialog',
    templateUrl: './course-dialog.component.html',
    styleUrls: ['./course-dialog.component.css'],
    providers: [
        LoadingService,
        MessagesService
    ]
})
export class CourseDialogComponent implements AfterViewInit {

    form: FormGroup;

    course:Course;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) course:Course,
        private coursesService: CoursesService,
        private loadingService:LoadingService,
        private MessagesService:MessagesService) {

        this.course = course;

        this.form = fb.group({
            description: [course.description, Validators.required],
            category: [course.category, Validators.required],
            releasedAt: [moment(), Validators.required],
            longDescription: [course.longDescription,Validators.required]
        });

    }

    ngAfterViewInit() {

    }

    save() {
      const changes = this.form.value;
      // Apply the changes made to the course through the courseId, changes
      const saveCourse$ = this.coursesService.saveCourse(this.course.id, changes)
      .pipe(
        catchError(err => {
            const message = "Could not save course";
            console.log(message, err);
            this.MessagesService.showErrors(message);
            return throwError(err);
        })
      )
        // close the course dialog component modal when the course is saved (course dialog is injected in through the constructor so we have access to it). We pass the val into the subscribe to differentiate it from the below close method.
      .subscribe(
        (val) => {
            this.dialogRef.close(val); 
        }
      )

    }

    close() {
        this.dialogRef.close();
    }

}
