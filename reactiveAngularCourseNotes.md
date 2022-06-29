Reactive Angular Course Notes:

    Section 1 - Reactive Angular Intro:

        - Almost every online application today generates immense amounts of real-time, interactive data. Applications are expected to make changes across the application in response to events and remain fully functional during the process. The reactive paradigm was made to handle these “events” with real-time updates across the program.

        - Reactive programs are structured around events rather than sequential top-down execution of iterative code. This allows them to respond to a trigger event regardless of when what stage the program is on.

        - Reactive programming is often combined with functional programming and concurrency to create stable, scalable, and event-driven programs.

        - Reactive angular applications can be implemented with plain RxJs - Patterns, Anti-Patterns, Lightweight State Management.

        - Stateless Observables services can be used to implement stateless reactive apps/components without the need for a full state management library such as NgRx.

        - Reactive programming is a programming paradigm dealing with data streams and the propagation of changes. Data streams may be static or dynamic. An example of static data stream is an array or collection of data. It will have an initial quantity and it will not change. An example for dynamic data stream is event emitters. Event emitters emit the data whenever the event happens. Initially, there may be no events but as the time moves on, events happens and it will gets emitted.

        - Reactive programming enables the data stream to be emitted from one source called Observable and the emitted data stream to be caught by other sources called Observer through a process called subscription. This Observable / Observer pattern or simple Observer pattern greatly simplifies complex change detection and necessary updating in the context of the programming.

        - Reactive pattern in Angular  - An Angular application is a reactive system. The user clicks on a button, the application reacts to this event and updates the model. The model gets updated, the application propagates the changes through the component tree. Angular Reacvtive forms are an example of reactive programming pattern in angular core.


    Section 2 - Stateless Observable Services:
        
        - Review a component written in an imperative style: The following home.component.ts is written in a Imperative style to load courses from a REST Api. We have mutable state variables for beginner & advanced courses. We than use the http client, get, to return a observable stream of data which we can observe over time & then subscribe to the observable, extract the courses from the res payload, sort by number and then filter the courses based on the category, beginner or advanced. Although the http client returns an Observable it doesn't mean the the way we interact with that observable is reactive. The below examples shows how this was implemented in an Imperative style.

        Example of imperative approach: 

        **home.component.ts
        export class HomeComponent implements OnInit {

        beginnerCourses: Course[];

        advancedCourses: Course[];


        constructor(private http: HttpClient, private dialog: MatDialog) {

        }

        ngOnInit() {

            this.http.get('/api/courses')
            .subscribe(
                res => {

                const courses: Course[] = res["payload"].sort(sortCoursesBySeqNo);

                this.beginnerCourses = courses.filter(course => course.category == "BEGINNER");

                this.advancedCourses = courses.filter(course => course.category == "ADVANCED");

                });

        }

        **home.component.html
        <div class="courses-panel">

            <h3>All Courses</h3>

            <mat-tab-group>

                <mat-tab label="Beginners">

                <mat-card *ngFor="let course of beginnerCourses" class="course-card mat-elevation-z10">

                    <mat-card-header>

                    <mat-card-title>{{course.description}}</mat-card-title>

                    </mat-card-header>

                    <img mat-card-image [src]="course.iconUrl">

                    <mat-card-content>
                    <p>{{course.longDescription}}</p>
                    </mat-card-content>

                    <mat-card-actions class="course-actions">

                    <button mat-button class="mat-raised-button mat-primary" [routerLink]="['/courses', course.id]">
                        VIEW COURSE
                    </button>

                    <button mat-button class="mat-raised-button mat-accent"
                            (click)="editCourse(course)">
                        EDIT
                    </button>

                    </mat-card-actions>

                </mat-card>

                </mat-tab>

                <mat-tab label="Advanced">

                <mat-card *ngFor="let course of advancedCourses" class="course-card mat-elevation-z10">

                    <mat-card-header>

                    <mat-card-title>{{course.description}}</mat-card-title>

                    </mat-card-header>

                    <img mat-card-image [src]="course.iconUrl">

                    <mat-card-content>
                    <p>{{course.longDescription}}</p>
                    </mat-card-content>

                    <mat-card-actions class="course-actions">

                    <button mat-button class="mat-raised-button mat-primary" [routerLink]="['/courses', course.id]">
                        VIEW COURSE
                    </button>

                    <button mat-button class="mat-raised-button mat-accent"
                            (click)="editCourse(course)">
                        EDIT
                    </button>

                    </mat-card-actions>

                </mat-card>

                </mat-tab>

            </mat-tab-group>
        </div>


        - Understand potential problems of a program written in Imperative style: The above example has several potential issues that do not follow the reactive design pattern.

            - The home.component.ts file contains to much logic & knows to much about were the data is coming from. It knows that the data comes from the backend 'api/courses', it knows how to do the http call, subscribe and process the data its receives. It should not be aware of were the data is coming from 
            - The logic inside the ngOnInit() may also want to be used elsewhere in the app and so having the logic here in the home.component.ts is not re-usable elsewhere.

            - It also has immutable member variables ( beginnerCourses: Course[]; & advancedCourses: Course[];) which is not good practice. Keeping data in these local immutable state variables is potentially problematic as if we make a change to the data in this component the wider application does not know that the data was modified and we wanted to use that data within other components it may not reflect the changes that were applied locally in this component. 

            - Ideally we would want to implement a solution were the component does not know were the data comes from, it simply receives it when a new version of that data is available. Not have immutable local member variables & not have nested code like we see inside the http subscribe logic. 

        Design Pattern - Stateless Observable-based Service

            - Example of Reactive stateless observable based service with component and view (best practice approach):

            **courses.service.ts

            export class CoursesService {
                constructor(private http:HttpClient) {

                }

                loadAllCourses(): Observable<Course[]> {
                    return this.http.get<Course[]>("/api/courses")
                    .pipe(
                        map(res => res["payload"])
                    );
                }
            }

            ** home.component.ts
            export class HomeComponent implements OnInit {

                beginnerCourses$: Observable<Course[]>;

                advancedCourses$: Observable<Course[]>;
                

                constructor(private dialog: MatDialog, private coursesService: CoursesService) {

                }

                ngOnInit() {

                    const courses$ = this.coursesService.loadAllCourses()
                    .pipe(
                        map(courses => courses.sort(sortCoursesBySeqNo))
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
            }

            ** home.component.html
            <div class="courses-panel">

                <h3>All Courses</h3>

                <mat-tab-group>

                    <mat-tab label="Beginners">

                    <mat-card *ngFor="let course of (beginnerCourses$ | async )" class="course-card mat-elevation-z10">

                        <mat-card-header>

                        <mat-card-title>{{course.description}}</mat-card-title>

                        </mat-card-header>

                        <img mat-card-image [src]="course.iconUrl">

                        <mat-card-content>
                        <p>{{course.longDescription}}</p>
                        </mat-card-content>

                        <mat-card-actions class="course-actions">

                        <button mat-button class="mat-raised-button mat-primary" [routerLink]="['/courses', course.id]">
                            VIEW COURSE
                        </button>

                        <button mat-button class="mat-raised-button mat-accent"
                                (click)="editCourse(course)">
                            EDIT
                        </button>

                        </mat-card-actions>

                    </mat-card>

                    </mat-tab>

                    <mat-tab label="Advanced">

                    <mat-card *ngFor="let course of (advancedCourses$ | async)" class="course-card mat-elevation-z10">

                        <mat-card-header>

                        <mat-card-title>{{course.description}}</mat-card-title>

                        </mat-card-header>

                        <img mat-card-image [src]="course.iconUrl">

                        <mat-card-content>
                        <p>{{course.longDescription}}</p>
                        </mat-card-content>

                        <mat-card-actions class="course-actions">

                        <button mat-button class="mat-raised-button mat-primary" [routerLink]="['/courses', course.id]">
                            VIEW COURSE
                        </button>

                        <button mat-button class="mat-raised-button mat-accent"
                                (click)="editCourse(course)">
                            EDIT
                        </button>

                        </mat-card-actions>

                    </mat-card>

                    </mat-tab>

                </mat-tab-group>

            </div>


            - To sum up the above refactor we have created a stateless observable based service using the httpClient, calling the loadAllCourses() of type Observable, that returns an array of courses. We use the http get, use the pipe operator to then map through the res and output the res payload property that contains the array of courses. In the home.component.ts, we then inject the coursesService in the constructor, update the beginner & & advanced member variables to type Observables (beginnerCourses$: Observable<Course[]>; advancedCourses$: Observable<Course[]>;) and in the ngOnInit() we then assign a courses$ variable and assign that the coursesService.loadAllCourses method. We then pipe & map through the payload returned by the service and sort through the courses using the sort(sortCoursesBySeqNo) method. Now the courses are saved in the course$ variables we then assign the beginnerCourses$: Observable<Course[]>; & the advancedCourses$: Observable<Course[]>; variables to the course$  and then pipe & map through the array and filter the courses array based on course category. Now to we just need to subscribe to beginnerCourses$ & the advancedCourses$ within the html template file using the async pipe. The async pipe will also unsubscribe from the observable so we dont need to manually unsubscribe() in the ts file.

            - Avoiding duplicate HTTP requests with the RxJS shareReplay() operator: 
                - The above example makes 2 separate http requests as we are subscribing twice within the component view with the async pipe (this is not ideal).
                - The ideal approach would be to create only 1 http for the first subscription, keep that result in memory and use that result and share it with the second subscriber. We can implement this with the shareReplay() operator and is best practice to use this in most httpClient services. 
                
                Example of the shareReplay():

                export class CoursesService {
                    constructor(private http:HttpClient) {

                    }

                    loadAllCourses(): Observable<Course[]> {
                        return this.http.get<Course[]>("/api/courses")
                        .pipe(
                            map(res => res["payload"]),
                            shareReplay() << shareReplay() ensures that we don't have two separate http calls to the backend
                        );
                    }
                }

            - Angular view Layer Patterns - Smart vs Presentational Components: Presentational components are view templates were its only responsibility is to display to the UI the data we input to the view. It will not contain any other logic. To do this we would want to create a coursesCardList component with an @Input(): Course[] = [] in the ts file. The courseCardList view template where we ngFor let course of courses through the courses array. We would then instantiate the courseCardList component within the home.component as pass in the [courses]=beginnerCourses$ | async to subscribe to the observables that way. By doing this we are implementing a presentational component using courseCardList were its only responsibility is to display the courses data that comes from the @Input and the subscribing using the async pipe and logic to call the coursesService will be implemented in the home.component.ts. The home.component.ts will now be classed as the smart component as it contains the logic for injecting the coursesService, the logic for calling the loadAllCourses() method, map and filter the observable response and also contains the Observable member variables. The home.component.html view will then just instantiate the courseCardList components as subscribe to the courses observable  by passing in <courses-card-list[courses]=beginnerCourses$ | async></<courses-card-list> & <courses-card-list[courses]=advancedCourses$ | async></<courses-card-list>. The editCourse(course: Course) method is removed from the homeComponent.ts and added to the CoursesCardList.ts Component along with the Angular Material Dialog Service in the constructor. Now the sole purpose of the CoursesCardList Component is to display courses and edit courses (This component is now fully re-usable and can be used in other areas of the app). The courses @Input will contain all of the courses which we can then pass in either Beginner or Advanced courses when instantiating the component in the parent Home Component with the async pipe, [courses]=beginnerCourses$ | async></<courses-card-list> & <courses-card-list[courses]=advancedCourses$ | async></<courses-card-list>. The home Component is now the smart component with its main responsibly is to access the service layer, extract dat from that service and pass it to the coursesCardList component. The coursesCardList Component now is just for presentation, it doesn't know how the data comes from the service it only gets it courses data through the @Input courses: Course[]; 

                - Example of Smart vs Presentational components (creating a new component: CoursesCardListComponent)

                ** coursesCardListComponent.ts

                export class CoursesCardListComponent implements OnInit {
                    @Input()
                    courses: Course[];  

                    constructor(private dialog: MatDialog) {

                    }

                    ngOnInit() {

                    }

                      editCourse(course: Course) {

                        const dialogConfig = new MatDialogConfig();

                        dialogConfig.disableClose = true;
                        dialogConfig.autoFocus = true;
                        dialogConfig.width = "400px";

                        dialogConfig.data = course;

                        const dialogRef = this.dialog.open(CourseDialogComponent, dialogConfig);

                    }
                }


                **coursesCardListComponent.html

                <mat-card *ngFor="let course of courses" class="course-card mat-elevation-z10">

                    <mat-card-header>

                        <mat-card-title>{{course.description}}</mat-card-title>

                    </mat-card-header>

                    <img mat-card-image [src]="course.iconUrl">

                    <mat-card-content>
                        <p>{{course.longDescription}}</p>
                    </mat-card-content>

                    <mat-card-actions class="course-actions">

                    <button mat-button class="mat-raised-button mat-primary" [routerLink]="['/courses', course.id]">
                        VIEW COURSE
                    </button>

                    <button mat-button class="mat-raised-button mat-accent"
                            (click)="editCourse(course)">
                        EDIT
                    </button>

                    </mat-card-actions>

                </mat-card>



                ** Home.Component.html
                
                <div class="courses-panel">

                    <h3>All Courses</h3>

                    <mat-tab-group>

                        <mat-tab label="Beginners">

                            <courses-card-list [courses]="beginnerCourses$ | async"></courses-card-list>

                        </mat-tab>

                        <mat-tab label="Advanced">

                            <courses-card-list [courses]="advancedCourses$ | async"></courses-card-list>
                      
                        </mat-tab>

                    </mat-tab-group>

                </div>


                ** Home.Component.ts

                export class HomeComponent implements OnInit {

                beginnerCourses$: Observable<Course[]>;

                advancedCourses$: Observable<Course[]>;
                

                constructor(private coursesService: CoursesService) {

                }

                    ngOnInit() {

                        const courses$ = this.coursesService.loadAllCourses()
                        .pipe(
                            map(courses => courses.sort(sortCoursesBySeqNo))
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

                }

            - Data Modification Example in Reactive Style: We can refactor our code further to implement a Reactive way to edit course details. We can do this by creating a saveCourse() method int he courses.service.ts file which takes the courseId & changes made to the course as parameters, of return type Observable & we then call this.http.put(`/api/courses/${courseId}`, changes) and pass the changes to the courseId that was updated. In the courseDialog.ts component we then implemented the save method that is uses the service to save the updated courses details. We get the changes using the form group using form value, assign the changed form values to 'changes' ( const changes = this.form.value;) & call the courses service saveCourse Method with the course if and changes passed in ( this.coursesService.saveCourse(this.course.id, changes)), we must then subscribe to the observable and close the course dialog component modal. We then want to update the courses-card-list.ts component so that when the course dialog is closed it emits an event that will re-trigger the method to load all of the courses. We have to do this because the courses-card-list.ts component is a presentation component so we need a way to re-trigger the loading of courses when the editCourse method has been called. We can do this by using the afterClosed() observable on the dialogRef modal, filter out the cases that correspond to the only successful saves were a val was emitted. We then trigger the event & emit it using the tap() operator which then calls the coursesChanged event, which we then pass this event as a custom event as so, (@Output private coursesChanged = new EventEmitter();) to the home.component.html (coursesChanged="reloadCourses()")  which then calls a reloadCourses() method which we have created in the home.component.ts file, as shown below. The ngOnInit will be responsible for calling the reloadCourses method. Implementing it this was in of a Reactive style



                - Example of Data Modification Example in Reactive Style (as explained above):
                
                ** courses.service.ts
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


                ** coursesCardListComponent.ts

                export class CoursesCardListComponent implements OnInit {
                    @Input()
                    courses: Course[];

                    @Output private coursesChanged = new EventEmitter();  

                    constructor(private dialog: MatDialog) {

                    }

                    ngOnInit() {

                    }

                      editCourse(course: Course) {

                        const dialogConfig = new MatDialogConfig();

                        dialogConfig.disableClose = true;
                        dialogConfig.autoFocus = true;
                        dialogConfig.width = "400px";

                        dialogConfig.data = course;

                        const dialogRef = this.dialog.open(CourseDialogComponent, dialogConfig);

                        dialogRef.afterClosed()
                        .pipe(
                            filter(val => !!val), << check values that were changed
                            tap() => this.corsesChanged.emit() << emit them values using tap() side effect
                        )
                        .subscribe();

                    }
                }


                ** Home.Component.html
                
                <div class="courses-panel">

                    <h3>All Courses</h3>

                    <mat-tab-group>

                        <mat-tab label="Beginners">

                            <courses-card-list [courses]="beginnerCourses$ | async">
                                coursesChanged="reloadCourses()" << when a course has been changed a custom event is emitted to call the reloadCourses Method
                            </courses-card-list>

                        </mat-tab>

                        <mat-tab label="Advanced">

                            <courses-card-list [courses]="advancedCourses$ | async">
                                coursesChanged="reloadCourses()" << when a course has been changed a custom event is emitted to call the reloadCourses Method
                            </courses-card-list>
                      
                        </mat-tab>

                    </mat-tab-group>

                </div>


                ** Home.Component.ts

                export class HomeComponent implements OnInit {

                    beginnerCourses$: Observable<Course[]>;

                    advancedCourses$: Observable<Course[]>;
                    

                    constructor(private coursesService: CoursesService) {

                    }

                    ngOnInit() {

                        this.reloadCourses(); << call the reloadCourses method when a courses details have been edited. 

                    }

                    reloadCourses() {
                        const courses$ = this.coursesService.loadAllCourses()
                        .pipe(
                            map(courses => courses.sort(sortCoursesBySeqNo))
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

                }

    Section 3 - Reactive Component Interaction:

        - Reactive Component Interaction: Above we are passing course data through @Inputs and emitting Events through @Outputs, but what if we wanted other components in the application that are not of parent/child relation to share data and interact to that data change. For instance what if we want a loading indicator throughout the application with other components that need it. We can do this by implementing it in a reactive way by designing it in a decoupled way were all the components can interact with a loading component. For example the courses-card-list, home component as each of the components have methods were we would want to use the loading component to show the to the user. This can be achieved using a decoupled component using a 'shared service', using an Injectable Service which is placed in the 'providers' of the app.component.ts which can then be injected in to any components constructor that would like to use the loading service. We instantiate the <loading></loading> component in the app.component.html ready to be used when ever it is called. We must first create a loading$ Observable in the loading.service.ts file (i.e - loading$: Observable<boolean>;) and subscribe to it using the *ngIf="loadingService.loading$ | async"> async pipe in the loading.component.html. If the loading$ Observable is true it will then show the loading spinner and if false it will not show. To implement this we can use the Private BehaviorSubject (private loadingSubject = new BehaviorSubject(false);) & (loading$: Observable<boolean> = this.loadingSubject.asObservable();) which will have a starting value of 'false' and use the loadingOn() to call next() on the BehaviorSubject to pass it a new value to turn the loading component on. We can then call the loadingOff() method after we have loaded and sorted the home screen courses using the finalize operator (i.e - finalize(() => this.loadingService.loadingOff())) which basically turn of the loading spinner when the courses on the home screen have successfully loaded. We can use the showLoadedUntilComplete method in the courses service to turn of the loader but the below example uses the rxjs finalize operator to do this. Additionally we can use this Reactive Loading Indicator in other parts of the app that are not direct child component of the root app.component.html such as the courseDialog.component which is not a direct child decent of the app route component, so it does not get access to the loadingService. We can do this by providing the loadingService in the courseDialog component using (providers:[LoadingService]) and then instantiate the <loading></loading> component in the courseDialog.component so it can be used there too. 
        
        - See full implementation example below for Reactive Component Interaction loadingService;

        ** loading.service.ts
        @Injectable()
        export class LoadingService {

            private loadingSubject = new BehaviorSubject(false);
            
            loading$: Observable<boolean> = this.loadingSubject.asObservable();

            showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
                return undefined;
            }

            loadingOn() {
            this.loadingSubject.next(true);
            }

            loadingOff() {
                this.loadingSubject.next(false);
            }
        }

        ** app.component.ts
        import {Component, OnInit} from '@angular/core';
        import { LoadingService } from './loading/loading.service';

        @Component({
        selector: 'app-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.css'],
            providers: [
            LoadingService << LoadingService placed in providers of app.component 
            ]
        })

        export class AppComponent implements  OnInit {

            constructor() {

            }

            ngOnInit() {


            }

            logout() {

            }

        }

        ** app.component.html
        <mat-sidenav-container fullscreen>

            <mat-sidenav #start (click)="start.close()">
                <mat-nav-list>

                <a mat-list-item routerLink="/">
                    <mat-icon>library_books</mat-icon>
                    <span>Courses</span>
                </a>

                <a mat-list-item routerLink="/search-lessons">
                    <mat-icon>search</mat-icon>
                    <span>Search Lessons</span>
                </a>

                <a mat-list-item routerLink="about">
                    <mat-icon>question_answer</mat-icon>
                    <span>About</span>
                </a>
                <a mat-list-item>
                    <mat-icon>person_add</mat-icon>
                    <span>Register</span>
                </a>

                <a mat-list-item routerLink="login">
                    <mat-icon>account_circle</mat-icon>
                    <span>Login</span>
                </a>

                <a mat-list-item (click)="logout()">
                    <mat-icon>exit_to_app</mat-icon>
                    <span>Logout</span>
                </a>

                </mat-nav-list>

            </mat-sidenav>

            <mat-toolbar color="primary">

                <div class="toolbar-tools">

                <button mat-icon-button (click)="start.open('mouse')">
                    <mat-icon>menu</mat-icon>
                </button>

                <div class="filler"></div>

                </div>


            </mat-toolbar>

            <loading></loading> << loading component declared ready to be used when LoadingService calls for it

            <router-outlet></router-outlet>

            </mat-sidenav-container>


        ** home.component.ts
        export class HomeComponent implements OnInit {

            beginnerCourses$: Observable<Course[]>;

            advancedCourses$: Observable<Course[]>;
            loadingService: any;
            

            constructor(private dialog: MatDialog, private coursesService: CoursesService, private loadingService:LoadingService) {

            }

            ngOnInit() {

                this.reloadCourses(); << calls the reloadCourses method when a courses details have been edited. 

            }

            reloadCourses() {

                this.loadingService.loadingOn();

                const courses$ = this.coursesService.loadAllCourses()
                .pipe(
                    map(courses => courses.sort(sortCoursesBySeqNo)),
                    finalize(() => this.loadingService.loadingOff()) << turn of the loading spinner component when the courses have finished loading
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
        }

        
        ** Home.Component.html
        <div class="courses-panel">

            <h3>All Courses</h3>

            <mat-tab-group>

                <mat-tab label="Beginners">

                    <courses-card-list [courses]="beginnerCourses$ | async">
                        coursesChanged="reloadCourses()" << when a course has been changed a custom event is emitted to call the reloadCourses Method
                    </courses-card-list>

                </mat-tab>

                <mat-tab label="Advanced">

                    <courses-card-list [courses]="advancedCourses$ | async">
                        coursesChanged="reloadCourses()" << when a course has been changed a custom event is emitted to call the reloadCourses Method
                    </courses-card-list>
                
                </mat-tab>

            </mat-tab-group>

        </div>


        **loading.component.ts
        export class LoadingComponent implements OnInit {


            constructor(public loadingService:LoadingService) { << public loadingService ready to be used in the template

            }

            ngOnInit() {

            }
        }

        
        **loading.component.html
        <div class="spinner-container" *ngIf="loadingService.loading$ | async"> << subscribe to observable using async pipe
            <mat-spinner></mat-spinner>
        </div>


    - Reactive Component Interaction Continued: Error handling using a shared & decoupled Message Service & component which can be used like the loadingService to show an error message panel at the top of the UI to the user if there is some issue when loading the courses or when editing course details incorrectly. The follow describes how this can be implemented using a shared, decoupled service. First we instantiate the message.component in the app.component.html file (<messages></messages>) ready to be used to display messages. We then set (showMessages = false;) memeber variable in the messages.component.ts file and create a template view to show the error message (<div class="messages-container" *ngIf="showMessages"> & <div class="message" *ngFor="let error of errors"> {{error}} </div>). We then create a messages.service.ts file and provide the app.component providers property the Message Service (providers: [MessagesService]) and also in the home.component.ts constructor method (private messagesService: MessagesService). In the home.component.ts we then create the error handling logic for the home.component using the catchError rxjs operator (i.e - catchError(err => {const message = "Could not load courses"; this.messagesService.showErrors(message); console.log(message, err);return throwError(err);})) which handles the error by catching the error, saving a custom error massage in the message variable, sending the custom message to the messagesService showErrors() method, console logging the custom message and the technical err message returned by the server backend and ending the observable by returning the the throwError(err). In the message service we declare a private BehaviorSubject that will emit error message values. We assign that subject to an errors$ observable that emits the same value created in the private BeahviourSubject, call next() on the subject in the showErrors() method passing it the error emitted. We then subscribe to the errors observable in the messages.component.html file using the async pipe. In the view we say that if  *ngIf="showMessages" is true then show the error message in the template. To set the "showMessages" variable to true we do this in the messages.component.ts, first we create an errors$ Observable and subscribe to it in the template using <ng-container  *ngIf="(errors$ | async) as errors"> instead of the messesagesService observable. We then use the messesageService in the ngOnInit method in the messages.component.ts, like so - ngOnInit() { this.errors$ = this.messagesService.errors$.pipe(tap(() => this.showMessages = true));. We assign the errors$ observable to the messagesService and use the pipe & then tap rxjs operator to set the showMessages member variable to 'true'. In the messages.service.ts file we then filter out the empty errors array that we start with. To do this we use the pipe & filter operator and check the messages array exists and that the messages service array length is greater than 0, as so (errors$: Observable<string[]> = subject.asObservable().pipe(filter(messages => messages && messages.length > 0););}.

        - See full implementation of Reactive Decoupled Messages Service below:

        ** courses.service.ts
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

        ** app.component.ts
        @Component({
        selector: 'app-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.css'],
            providers: [
            LoadingService,
            MessagesService << messages service injected in to the app component
            ]
        })

        export class AppComponent implements  OnInit {

            constructor() {

            }

            ngOnInit() {
            }

            logout() {

                }

        }

        ** app.component.html
        <mat-sidenav-container fullscreen>

            <mat-sidenav #start (click)="start.close()">
                <mat-nav-list>

                <a mat-list-item routerLink="/">
                    <mat-icon>library_books</mat-icon>
                    <span>Courses</span>
                </a>

                <a mat-list-item routerLink="/search-lessons">
                    <mat-icon>search</mat-icon>
                    <span>Search Lessons</span>
                </a>

                <a mat-list-item routerLink="about">
                    <mat-icon>question_answer</mat-icon>
                    <span>About</span>
                </a>
                <a mat-list-item>
                    <mat-icon>person_add</mat-icon>
                    <span>Register</span>
                </a>

                <a mat-list-item routerLink="login">
                    <mat-icon>account_circle</mat-icon>
                    <span>Login</span>
                </a>

                <a mat-list-item (click)="logout()">
                    <mat-icon>exit_to_app</mat-icon>
                    <span>Logout</span>
                </a>

                </mat-nav-list>

            </mat-sidenav>

            <mat-toolbar color="primary">

                <div class="toolbar-tools">

                <button mat-icon-button (click)="start.open('mouse')">
                    <mat-icon>menu</mat-icon>
                </button>

                <div class="filler"></div>

                </div>


            </mat-toolbar>

            <messages></messages> << Messages component injected into the app component ready to be used to show error messages

            <loading></loading>

            <router-outlet></router-outlet>

            </mat-sidenav-container>



        **home.component.ts
        export class HomeComponent implements OnInit {

            beginnerCourses$: Observable<Course[]>;

            advancedCourses$: Observable<Course[]>;

            

            constructor(
                private dialog: MatDialog, 
                private coursesService: CoursesService, 
                private loadingService:LoadingService,
                private messagesService: MessagesService) {

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


        **messages.service.ts
        export class MessagesService {

            private subject = new BehaviorSubject<string[]>([]);
            
            errors$: Observable<string[]> = this.subject.asObservable()
            .pipe(
                filter(messages => messages && messages.length > 0);
            );

            showErrors(...errors: string[]) {
                this.subject.next(errors);
            }
        }

        **message.component.ts
        export class MessagesComponent implements OnInit {

            showMessages = false;

            errors$: Observable<string[]>


            constructor(public messagesService: MessagesService) {
                console.log('created messages component');
            }

            ngOnInit() {
                this.errors$ = this.messagesService.errors$.
                pipe(
                    tap(() => this.showMessages = true)
                );

            }


            onClose() {
                this.showMessages = false;
            }

        }

        **message.component.html
        <ng-container  *ngIf="(errors$ | async) as errors">
            <div class="messages-container" *ngIf="showMessages">
                <div class="message" *ngFor="let error of errors">
                    {{error}}
                </div>
                <mat-icon class="close" click="onClose()">Close</mat-icon>
            </div>
        </ng-container>

    
    - Local Error Handling as we using MaterialDialog component that is outside of the root component tree: As the MaterialDialog component (pop up modal to edit a course) is outside of the application root component & app route child components we must implement the error handling service to the MaterialDialog in a different way. The providers declared in the root app component are not accessible by the  MaterialDialog so we must provide the MaterialDialog component with the messagesServices in the providers array (providers: [LoadingService, MessagesService]) & also provide it int he course-dialog.ts constructor (private messagesService:MessagesService). We must then inject the messages component inside the course-dialog.component.html file at the top so it can be used inside of the course-dialog modal when a error occurs when updating a courses information. 

        - Local Error Handling Service Injection in Reactive approach example below:

        ** courses.service.ts
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

        **course-dialog.component.ts
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
            );

            close() {
                this.dialogRef.close();
            }

        **course-dialog.component.html
        <h2 mat-dialog-title>{{course.description}}</h2>

            <loading></loading>

            <messages></messages>


            <mat-dialog-content [formGroup]="form">

            <mat-form-field>

                <input matInput
                    placeholder="Course Description"
                    formControlName="description">

            </mat-form-field>

            <mat-form-field>

                <mat-select placeholder="Select category"
                            formControlName="category">

                <mat-option value="BEGINNER">
                    Beginner
                </mat-option>
                <mat-option value="INTERMEDIATE">
                    Intermediate
                </mat-option>
                <mat-option value="ADVANCED">
                    Advanced
                </mat-option>

                </mat-select>

            </mat-form-field>

            <mat-form-field>

                <input matInput [matDatepicker]="myDatepicker" #searchInput
                    formControlName="releasedAt">

                <mat-datepicker-toggle matSuffix
                                    [for]="myDatepicker">

                </mat-datepicker-toggle>

                <mat-datepicker #myDatepicker></mat-datepicker>

            </mat-form-field>

            <mat-form-field>

                    <textarea matInput placeholder="Description"
                            formControlName="longDescription">

                    </textarea>

            </mat-form-field>


            </mat-dialog-content>

            <mat-dialog-actions>

            <button class="mat-raised-button"
                    (click)="close()">
                Close
            </button>

            <button class="mat-raised-button mat-primary" #saveButton (click)="save()">
                Save
            </button>

        </mat-dialog-actions>


    - Angular State Management - When is it needed & why: The examples above are not saved in any application state and therefore is calling adopting a reactive stateless solution. All of the data comes from the http requests and is processed in reactive way using observables & rxjs. There is times when we would like to implement state management so every time that the data changes or is updated in the backend we don't need to continually make http request to the backend for them changes to be visible on the user interface. This is called having a lot of 'network overhead' (in most cases this is not an issue to have a stateless solution as is actually best practice and in most cases). For network heavy requests we should consider implementing some state management to improve the user experience (careful consideration of tradeoffs should be considered if doing so). This is when we should consider implementing a 'store service'. It will not be a 'stateless' service like the coursesService, it will be 'stateful' service. This service will keep some state in memory and for this example will save the courses in some state using a store. First we create a courses.store.ts file and provide it as Singleton global store service meaning will be will once instance of this service throughout the entire application. The courses.store.ts will will have a courses$ observable (courses$: Observable<Course[]>;) and will also include some data modification logic within the store. We can then inject the store into our constructor in the home.component.ts ready to be used to display courses.

        - Stateful Courses Store Service example below(** Note this was only implemented in the example below and not in the course files):

        ** home.component.ts
        @Component({
            selector: 'home',
            templateUrl: './home.component.html',
            styleUrls: ['./home.component.css']
            })
            
            export class HomeComponent implements OnInit {

            beginnerCourses$: Observable<Course[]>;

            advancedCourses$: Observable<Course[]>;

            
            constructor(
                private coursesStore: CoursesStore) { << the courses store will now handle the course data, loading & messages service so have been removed from the constr
            }
            

            ngOnInit() {

                this.reloadCourses();
            }

            reloadCourses() {

                this.beginnerCourses$ = this.coursesStore.filterByCategory("BEGINNER");

                this.advancedCourses$ = this.coursesStore.filterByCategory("ADVANCED");
            }      










        












        




            





    











       