import { shareReplay, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import { Course } from '../model/course';

@Injectable({
    providedIn: 'root'
})

export class CoursesService {
    constructor(private http:HttpClient) {

    }

    loadAllCourses(): Observable<Course[]> {
        return this.http.get<Course[]>("/api/courses")
        .pipe(
            map(res => res["payload"]),
            shareReplay()
        );
    }

    saveCourse(course: string, changes: Partial<Course>): Observable<any> {
        return this.http.put(`/api/courses/${courseId}`, changes)
        .pipe(
            shareReplay()
        );
    }
}