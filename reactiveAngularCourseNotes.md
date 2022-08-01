Reactive Angular Course Notes:

    Section 1 - Reactive Angular Intro:

        - Observables provide support for passing messages between parts of your application. They are used frequently in Angular and are a technique for event handling, asynchronous programming, and handling multiple values.The observer pattern is a software design pattern in which an object, called the subject, maintains a list of its dependents, called observers, and notifies them automatically of state changes. This pattern is similar (but not identical) to the publish/subscribe design pattern.Observables are declarative —that is, you define a function for publishing values, but it is not executed until a consumer subscribes to it. The subscribed consumer then receives notifications until the function completes, or until they unsubscribe. An observable can deliver multiple values of any type —literals, messages, or events, depending on the context. The API for receiving values is the same whether the values are delivered synchronously or asynchronously. Because setup and teardown logic are both handled by the observable, your application code only needs to worry about subscribing to consume values, and when done, unsubscribing. Whether the stream was keystrokes, an HTTP response, or an interval timer, the interface for listening to values and stopping listening is the same. Because of these advantages, observables are used extensively within Angular, and for application development as well.

        - Reactive programming is an asynchronous programming paradigm concerned with data streams and the propagation of change (Wikipedia). RxJS (Reactive Extensions for JavaScript) is a library for reactive programming using observables that makes it easier to compose asynchronous or callback-based code. See (RxJS Docs).

        - Almost every online application today generates immense amounts of real-time, interactive data. Applications are expected to make changes across the application in response to events and remain fully functional during the process. The reactive paradigm was made to handle these “events” with real-time updates across the program.

        - Reactive programs are structured around events rather than sequential top-down execution of iterative code. This allows them to respond to a trigger event regardless of when what stage the program is on.

        - Reactive programming is often combined with functional programming and concurrency to create stable, scalable, and event-driven programs.

        - Reactive angular applications can be implemented with plain RxJs - Patterns, Anti-Patterns, Lightweight State Management.

        - Stateless Observables services can be used to implement stateless reactive apps/components without the need for a full state management library such as NgRx.

        - Reactive programming is a programming paradigm dealing with data streams and the propagation of changes. Data streams may be static or dynamic. An example of static data stream is an array or collection of data. It will have an initial quantity and it will not change. An example for dynamic data stream is event emitters. Event emitters emit the data whenever the event happens. Initially, there may be no events but as the time moves on, events happens and it will gets emitted.

        - Reactive programming enables the data stream to be emitted from one source called Observable and the emitted data stream to be caught by other sources called Observer through a process called subscription. This Observable / Observer pattern or simple Observer pattern greatly simplifies complex change detection and necessary updating in the context of the programming.

        - Reactive pattern in Angular  - An Angular application is a reactive system. The user clicks on a button, the application reacts to this event and updates the model. The model gets updated, the application propagates the changes through the component tree. Angular Reactive forms are an example of reactive programming pattern in angular core.

        - Additional Learning Resources:
            - RxJs Docs - https://rxjs.dev/guide/overview
            - Angular Docs - https://angular.io/guide/observables
            - RxJs Book - https://softchris.github.io/books/rxjs/why-rxjs/
            - Angular Uni Blog RxJs- https://blog.angular-university.io/tag/rxjs/
            - ng-conf Youtube - https://www.youtube.com/c/ngconfonline/search?query=rxjs
            - Angular Uni Youtube - https://www.youtube.com/channel/UC3cEGKhg3OERn-ihVsJcb7A/search?query= 
            - Decoded Frontend YouTube - https://www.youtube.com/c/DecodedFrontend/search?query=rxjs


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

            - Angular view Layer Patterns - Smart vs Presentational Components: Presentational components are view templates were its only responsibility is to display to the UI the data we input to the view. It will not contain any other logic. To do this we would want to create a coursesCardList component with an @Input(): Course[] = [] in the ts file. The courseCardList view template where we ngFor let course of courses through the courses array. We would then instantiate the courseCardList component within the home.component as pass in the [courses]=beginnerCourses$ | async to subscribe to the observables that way. By doing this we are implementing a presentational component using courseCardList were its only responsibility is to display the courses data that comes from the @Input and the subscribing using the async pipe and logic to call the coursesService will be implemented in the home.component.ts. The home.component.ts will now be classed as the smart component as it contains the logic for injecting the coursesService, the logic for calling the loadAllCourses() method, map and filter the observable response and also contains the Observable member variables. The home.component.html view will then just instantiate the courseCardList components as subscribe to the courses observable  by passing in <courses-card-list[courses]=beginnerCourses$ | async></<courses-card-list> & <courses-card-list[courses]=advancedCourses$ | async></<courses-card-list>. The editCourse(course: Course) method is removed from the homeComponent.ts and added to the CoursesCardList.ts Component along with the Angular Material Dialog Service in the constructor. Now the sole purpose of the CoursesCardList Component is to display courses and edit courses (This component is now fully re-usable and can be used in other areas of the app). The courses @Input will contain all of the courses which we can then pass in either Beginner or Advanced courses when instantiating the component in the parent Home Component with the async pipe, [courses]=beginnerCourses$ | async></<courses-card-list> & <courses-card-list[courses]=advancedCourses$ | async></<courses-card-list>. The home Component is now the smart component with its main responsibly is to access the service layer, extract dat from that service and pass it to the coursesCardList component. The coursesCardList Component now is just for presentation, it doesn't know how the data comes from the service it only gets it courses data through the @Input courses: Course[];  Just to note Smart vs presentation is just a high level recipe of a way to split business logic and views and it not recommended in all cases. Smart vs presentation components and how to we use observables data services using this approach has its downfalls - sometimes better mix and match import services to component deeper in the component tree and not have all functionally in parent . Import services in children, grandchild used with async pipe. This can also help with bubbling up events and the verbose nature of this when creating child, grandchildren components when trying to follow the smart vs presentational concept (see article for information on this - https://blog.angular-university.io/angular-component-design-how-to-avoid-custom-event-bubbling-and-extraneous-properties-in-the-local-component-tree/)

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

            - Data Modification Example in Reactive Style: We can refactor our code further to implement a Reactive way to edit course details. We can do this by creating a saveCourse() method int he courses.service.ts file which takes the courseId & changes made to the course as parameters, of return type Observable & we then call this.http.put(`/api/courses/${courseId}`, changes) and pass the changes to the courseId that was updated. In the courseDialog.ts component we then implemented the save method that is uses the service to save the updated courses details. We get the changes using the form group using form value, assign the changed form values to 'changes' ( const changes = this.form.value;) & call the courses service saveCourse Method with the course if and changes passed in ( this.coursesService.saveCourse(this.course.id, changes)), we must then subscribe to the observable and close the course dialog component modal. We then want to update the courses-card-list.ts component so that when the course dialog is closed it emits an event that will re-trigger the method to load all of the courses. We have to do this because the courses-card-list.ts component is a presentational component (only deals with displaying the courses vs the home.component that is the smart component as this deals with observable data modification and calling upon a CourseService & subscribing to the observable data streams) so we need a way to re-trigger the loading of courses when the editCourse method has been called. We can do this by using the afterClosed() observable on the dialogRef modal, filter out the cases that correspond to the only successful saves were a val was emitted. We then trigger the event & emit it using the tap() operator which then calls the coursesChanged event, which we then pass this event as a custom event as so, (@Output private coursesChanged = new EventEmitter();) to the home.component.html (coursesChanged="reloadCourses()")  which then calls a reloadCourses() method which we have created in the home.component.ts file, as shown below. The ngOnInit will be responsible for calling the reloadCourses method. Implementing it this was in of a Reactive style



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

        - Reactive Component Interaction: Above we are passing course data through @Inputs and emitting Events through @Outputs, but what if we wanted other components in the application that are not of parent/child relation to share data and interact to that data change. For instance what if we want a loading indicator throughout the application with other components that need it. We can do this by implementing it in a reactive way by designing it in a decoupled way were all the components can interact with a loading component. For example the courses-card-list, home component as each of the components have methods were we would want to use the loading component to show the to the user. This can be achieved using a decoupled component using a 'shared service', using an @Injectable Service (not a global singleton service were we use providedIn:'root' as several parts of the application may need multiple instances of the shared service to use the loading indicator i-e inside a modal component and not the entire ui) which is placed in the 'providers' of the app.component.ts which can then be injected in to any components constructor that would like to use the loading service. We instantiate the <loading></loading> component in the app.component.html ready to be used when ever it is called. We must first create a loading$ Observable in the loading.service.ts file with type boolean, to show or hide the loading spinner (i.e - loading$: Observable<boolean>;) and subscribe to it using the service & *ngIf="loadingService.loading$ | async"> async pipe in the loading.component.html. If the loading$ Observable is true it will then show the loading spinner and if false it will not show. To implement this we can use the Private BehaviorSubject (private loadingSubject = new BehaviorSubject(false);) & (loading$: Observable<boolean> = this.loadingSubject.asObservable();) which will have a starting value of 'false' and use the loadingOn() to call next() on the BehaviorSubject to pass it a new value to turn the loading component on. We can then call the loadingOff() method after we have loaded and sorted the home screen courses using the finalize operator (i.e - finalize(() => this.loadingService.loadingOff())) which basically turn of the loading spinner when the courses on the home screen have successfully loaded. Another solution we be to use We can use the showLoadedUntilComplete method (as shown in the course videos) in the courses service to turn of the loader but the below example uses the rxjs finalize operator to do this. In summary we can use this Reactive Loading Indicator in other parts of the app that are not direct child component of the root app.component.html such as the courseDialog.component which is not a direct child decent of the app route component, so it does not get access to the loadingService. We can do this by providing the loadingService in the courseDialog component using (providers:[LoadingService]) and then instantiate the <loading></loading> component in the courseDialog.component so it can be used there too. 
        
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
                    finalize(() => this.loadingService.loadingOff()) << turn of the loading spinner component with finalize when the stream completes & when the courses have                                                finished loading.
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


    - Reactive Component Interaction Continued, Error Handling & Messages Service: Error handling using a shared & decoupled Message Service & component which can be used like the loadingService to show an error message panel at the top of the UI to the user if there is some issue when loading the courses or when editing course details incorrectly. The follow describes how this can be implemented using a shared, decoupled service. First we instantiate the message.component in the app.component.html file (<messages></messages>) ready to be used to display messages. We then set (showMessages = false;) member variable in the messages.component.ts file and create a template view to show the error message (<div class="messages-container" *ngIf="showMessages"> & <div class="message" *ngFor="let error of errors"> {{error}} </div>). We then create a messages.service.ts file and provide the app.component providers property the Message Service (providers: [MessagesService]) and also in the home.component.ts constructor method (private messagesService: MessagesService). In the home.component.ts we then create the error handling logic for the home.component using the catchError rxjs operator (i.e - catchError(err => {const message = "Could not load courses"; this.messagesService.showErrors(message); console.log(message, err);return throwError(err);})) which handles the error by catching the error, saving a custom error massage in the message variable, sending the custom message to the messagesService showErrors() method, console logging the custom message and the technical err message returned by the server backend and ending the observable by returning the the throwError(err). In the message service we declare a private BehaviorSubject that will emit error message values. We assign that subject to an errors$ observable that emits the same value created in the private BehaviorSubject, call next() on the subject in the showErrors() method passing it the error emitted. We then subscribe to the errors observable in the messages.component.html file using the async pipe. In the view we say that if  *ngIf="showMessages" is true then show the error message in the template. To set the "showMessages" variable to true we do this in the messages.component.ts, first we create an errors$ Observable and subscribe to it in the template using <ng-container  *ngIf="(errors$ | async) as errors"> instead of the messagesService observable. We then use the messagesService in the ngOnInit method in the messages.component.ts, like so - ngOnInit() { this.errors$ = this.messagesService.errors$.pipe(tap(() => this.showMessages = true));. We assign the errors$ observable to the messagesService and use the pipe & then tap rxjs operator to set the showMessages member variable to 'true'. In the messages.service.ts file we then filter out the empty errors array that we start with. To do this we use the pipe & filter operator and check the messages array exists and that the messages service array length is greater than 0, as so (errors$: Observable<string[]> = subject.asObservable().pipe(filter(messages => messages && messages.length > 0););}.

        - See full implementation of Reactive Decoupled Error Handling & Messages Service below:

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
                    catchError(err => {                                << RxJs error handling operator - catchError() used with throwError  method to end the observable chain
                    const message = "Could not load courses";
                    this.messagesService.showErrors(message);
                    console.log(message, err);                          << log user error 'message' and use 'err' to console log technical err message for dev debugging
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
                filter(messages => messages && messages.length > 0); << make sure messages array exists and check it is not empty
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
                this.errors$ = this.messagesService.errors$. << set the errors emitted by the subject in the service and consume the result in  errors$: Observable<string[]>
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



    - Angular State Management & Implementation of a Store Service with Data Modification functionality: When is it needed & why: 
        - The examples above are not saved in any application state and therefore is called adopting a reactive stateless solution. All of the data comes from the http requests and is processed in reactive way using observables & rxjs. There is times when we would like to implement state management so every time that the data changes or is updated in the backend we don't need to continually make http request to the backend for them changes to be visible on the user interface. This is called having a lot of 'network overhead' (in most cases this is not an issue to have a stateless solution as is actually best practice and in most cases). For network heavy requests we should consider implementing some state management to improve the user experience (careful consideration of tradeoffs should be considered if doing so). This is when we should consider implementing a 'store service'. It will not be a 'stateless' service like the coursesService, it will be 'stateful' service. This service will keep some state in memory and for this example will save the courses in some state using a store. Only when we have long backend delays should state management be implemented. In most cases a stateless application provides a good solution. The below implementation will enable us to keep a reference to the data we retrieved from the backend. We will store this backend data in a shared service called the 'courses.store.ts'. A store is a known approach in angular that gives provide us with a stateful solution to hold our backend data. First we create a courses.store.ts file and provide it as Singleton global store service meaning will be will once instance of this service throughout the entire application. The courses.store.ts will will have a courses$ observable (courses$: Observable<Course[]>;) that will store the stateful course data that any part of the application can then subscribe to and use. There will be some data modification methods within the store such as loadAllCourses(), saveCourse() & filterByCategory(). We can then inject the store into our constructor in the home.component.ts ready to be used to display courses stored in the shared store service. The courses.store will first have a filterByCategory() method that will return the courses$ observable data, pipe and map through the data and filter the courses based on the category parameter passed into the method. The store will also have a public courses$ observable with a private BehaviorSubject which will hold a empty array of courses (the consumers of the service will not have access to the subject directly but will have access to the public courses$ observable. i.e - private subject = new BehaviorSubject<Course[]>([]); & courses$: Observable<Course[]> = this.subject.asObservable();). We then add the HttpClient, loadingService & messagesService to the constructor, ready to be used in the store and include a loadAllCourses() method in the constructor to load all courses as soon as the application first initializes. We then create the loadAllCourses() method and use Http to 'GET' all the courses (same implementation as the 'stateless' example above but instead this is in the store.service). We then store the loaded courses using the 'tap(courses => this.subject.next(courses))' ready to be consumed and subscribed to by other parts of the application that require the courses data. We must remember to move the LoadingService & MessagesService from the app.component.ts providers to the app.module.ts providers so that the entire application can access these services. The store is now ready to be used by the home.component.ts &  home.component.html and if we press move away from the home screen and press back the courses will not be retrieved from the backend, but the store service and the loading indicator will not show as the courses are readily available in state from the courses.store. If we now edited one of the courses titles the changes would not be reflected on that course in the home.component without reloading the page. this could cause confusion, so the next part is to add state management for data modification operations, such as saveCourses(). This is done using 'Optimistic Data Modification', meaning that we will modify the data of the course in memory directly and emit the changes in the courses$ observable immediately so we don't need to wait until the data gets saved on the backend before showing the changed in the home screen, this provides a more user friendly solution when using a store service. This is done in the saveCourse() method below. The courseDialog.component.ts will have to inject the course.store in the constructor so when we save a course that was edited in the courseDialog form, it calls the saveCourse() method in the store sending the params of course id & changes to the saveCourse() method (i.e - coursesStore.saveCourse(this.course.id, changes)) which then triggers  the optimistic save strategy in the store using the saveCourse() method which updates course data locally and then http 'put' and update the courses$ observable ready to be subscribed to (see arrows next to the saveCourse() method explaining how each line works). The home.component.ts file now use the store to retrieve courses, provide errors messages and show loading indicators so we have removed all of these from the constructor. 

        - Implementation of a Stateful Store Service: 'Stateful' Courses Store Service example below:

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
                private coursesStore: CoursesStore) { << the courses store will now handle the course data, loading & messages service so all have been removed 
            }
            

            ngOnInit() {
                this.reloadCourses();
            }

            reloadCourses() {

                this.beginnerCourses$ = this.coursesStore.filterByCategory("BEGINNER"); << call the filterByCategory method in the store and pass it "BEGINNER" params

                this.advancedCourses$ = this.coursesStore.filterByCategory("ADVANCED"); << call the filterByCategory method in the store and pass it "ADVANCED" params
            }
        }

        ** home.component.html
        <div class="courses-panel">

                <h3>All Courses</h3>

                <mat-tab-group>

                    <mat-tab label="Beginners">

                        <courses-card-list [courses]="beginnerCourses$ | async">

                        </courses-card-list>

                    </mat-tab>

                <mat-tab label="Advanced">

                    <courses-card-list [courses]="advancedCourses$ | async">

                    </courses-card-list>


                </mat-tab>

            </mat-tab-group>

        </div>


        ** courses.store.ts
        @Injectable({
            providedIn: 'root'
        })

        export class CoursesStore {

            private subject = new BehaviorSubject<Course[]>([]);

            courses$ : Observable<Course[]> = this.subject.asObservable();

            constructor(
                private http:HttpClient,
                private loading: LoadingService,
                private messages: MessagesService) {

                this.loadAllCourses();

            }

            private loadAllCourses() {

                const loadCourses$ = this.http.get<Course[]>('/api/courses')
                    .pipe(
                        map(response => response["payload"]),
                        catchError(err => {
                            const message = "Could not load courses";
                            this.messages.showErrors(message);
                            console.log(message, err);
                            return throwError(err);
                        }),
                        tap(courses => this.subject.next(courses)) <<  store the loaded courses, ready to be consumed and subscribed to by other parts of the application
                    );

                this.loading.showLoaderUntilCompleted(loadCourses$)
                    .subscribe();

            }

            
            *optimistic save strategy - update course data locally and then http 'put' and update the courses$ observable ready to be subscribed to.
            
            saveCourse(courseId:string, changes: Partial<Course>): Observable<any> {      << Partial means that only some of the values in the course object are updated

                const courses = this.subject.getValue();    << gets the list of courses last emitted by the subject - getValue() does this

                const index = courses.findIndex(course => course.id == courseId);      << find the index of the course we are modifying

                const newCourse: Course = {      << copy course & add changes 
                ...courses[index],
                ...changes
                };

                const newCourses: Course[] = courses.slice(0);     << create a newCourses array and assign the previous courses array to the new array.  

                newCourses[index] = newCourse;      << access the index in the array of the course we changed and add the newCourse data

                this.subject.next(newCourses);       << emit the newCourse array to the subject and call next 

                return this.http.put(`/api/courses/${courseId}`, changes)      << send changes to the backend using http 'put' to save the course that was updated.
                    .pipe(
                        catchError(err => {
                            const message = "Could not save course";
                            console.log(message, err);
                            this.messages.showErrors(message);
                            return throwError(err);
                        }),
                        shareReplay()         << ensure we don't trigger multiple http put calls using shareReplay()
                    );
            }


            filterByCategory(category: string): Observable<Course[]> {
            return this.courses$
                .pipe(
                    map(courses =>
                        courses.filter(course => course.category == category) << filter courses that equal the category passed into the method as params & sort by Seq No
                            .sort(sortCoursesBySeqNo)
                    )
                )
            }

        }

        ** courseDialog.component.ts
        @Component({
            selector: 'course-dialog',
            templateUrl: './course-dialog.component.html',
            styleUrls: ['./course-dialog.component.css'],
            providers: [
                LoadingService,
                MessagesService
            ]
        })

        export class CourseDialogComponent {

            form: FormGroup;

            course:Course;

            constructor(
                private fb: FormBuilder,
                private dialogRef: MatDialogRef<CourseDialogComponent>,
                @Inject(MAT_DIALOG_DATA) course:Course,
                private coursesStore: CoursesStore, << course store imported which is needed when we edit a course so the store receives the edited course 
                private messagesService: MessagesService) {

                this.course = course;

                this.form = fb.group({
                    description: [course.description, Validators.required],
                    category: [course.category, Validators.required],
                    releasedAt: [moment(), Validators.required],
                    longDescription: [course.longDescription,Validators.required]
                });

            }

            save() {

                const changes = this.form.value;

                this.coursesStore.saveCourse(this.course.id, changes)
                    .subscribe();

                this.dialogRef.close(changes);

                }

                close() {
                    this.dialogRef.close();
                }

            }


     - Section 4 - Authentication State Management:

        - We now want to implement a centralized state management store for user authentication purposes that can be accessed anywhere in the application which will store details about a users profile, login/logout and therefore update the ui accordingly. We first create a auth.store.ts and place it in our service folder. We make this an global singleton store using @Injectable providedIn 'root' so that the entire application can use this store. We then create a user.ts model with Interface User {id: string; email:string; pictureUrl:string}, this will provide us with the data model for a user. We then create 3 observables in the auth.store.ts - user$ : Observable<User>, isLoggedIn$ : Observable<boolean>; isLoggedOut$ : Observable<boolean>; and a login() method that will have params of email, password to validate the login credentials and the method will return type of Observable<User> profile. We want isLoggedIn$ & isLoggedOut$ will both be of boolean values, which we can change using a private BehaviorSubject as so (private subject = new BehaviorSubject<User>(null); & user$ : Observable<User> = this.subject.asObservable();) which can then emit news values of a user profile. We have an initial value of null in the subject to represent that no user is currently logged in. In the constructor we then set the isLoggedIn$ observable is derived from the user$ observable, we map through the user profile and use double negation using !! to set the value to true if the user is logged in a false if the user is not currently logged in. isLoggedOut$ is the set by using isLoggedIn$, if the value of isLoggedIn$ is true we negate the value using !loggedIn & toggle the value to false/true and vice versa. The login method then return a http 'POST' request passing in the user email & password to validate login credentials. We then emit the value of user profile with the pipe & tap operator which is a (tap is a side affect) and pass in the user profile to the observable using the .next() with the user profile contained. We then save the user profile in browser local storage to ensure persistent loggedIn state (const AUTH_DATA = "auth_data"; & localStorage.setItem(AUTH_DATA, JSON.stringify(user));), until logout button is pressed, were we then remove the AUTH_DATA from the browsers local storage. We then use the shareReplay operators to ensure multiple login post calls can not be made to the backend (if the user presses the button twice in quick succession). The logout method method using the subject to call .next() and set the value to null which clears the user profile form the private subject. The auth store can then be used and consumed by our application to adapt the UI according to the user authentication status. The first part of the application that needs access to the auth store is the login component so we place this in the constructor. In the login.component.ts we have a form builder with the email and password fields with validators applied. We then have a login() method that gets the values of the entire form using const val = this.form.value. In the login() method we then call the auth store login method passing it the val.email, val.password values from the login form fields. We then get back from the login method in the auth store an observable so we must subscribe in to this observable in the login.component.ts logon() method. We then want to navigate to the courses page if the login was successful so we use angular router and use an arrow function inside the subscribe to call 'this.router.navigateByUrl("/courses")', this will take us automatically to the courses page. If the login authentication fails we use,  err => alert("Login failed") to alert the user the login failed. We not want to implement the logout logic in the side panel so when a user clicks this it runs the logout method in the auth store. We first add a logout() method in the app.component.ts so we inject the auth.store in the constructor as 'public'. We use public because we want to use the auth store in the app.component.html to conditionally render the login button if the isLoggedOut$ observable in the auth store is true and isLoggedIn$ observable in the auth store is set to true. We use the *ngIf in the view template with the async pipe to do this conditional rendering of the login/logout buttons in the side panel ( <a mat-list-item routerLink="login" *ngIf="auth.isLoggedOut$ | async"> & *ngIf="auth.isLoggedOut$ | async"). 

           
        - Implementation of Authentication State Management below:

        ** auth.store.ts

        const AUTH_DATA = "auth_data";   << a place to store the users auth data to use with local storage for persistent login
        
        @Injectable({
            providedIn: 'root'
        })
        export class AuthStore {

            private subject = new BehaviorSubject<User>(null);

            user$ : Observable<User> = this.subject.asObservable();

            isLoggedIn$ : Observable<boolean>;
            isLoggedOut$ : Observable<boolean>;

            constructor(private http: HttpClient) {

                this.isLoggedIn$ = this.user$.pipe(map(user => !!user));  << double negation using !! to set the value to true if user is logged in a false if not logged in

                this.isLoggedOut$ = this.isLoggedIn$.pipe(map(loggedIn => !loggedIn)); << if the value of isLoggedIn$ is true we negate the value using !loggedIn & toggle the  value to false/true.

                 const user = localStorage.getItem(AUTH_DATA);  <<  get the auth data on application app startup to check if the user was logged in when last using the app

                if (user) {
                    this.subject.next(JSON.parse(user));    << if user is true pass the user data to local storage ready to be set in the below login() method.
                }

            }


            login(email:string, password:string): Observable<User> {
                return this.http.post<User>("/api/login", {email, password})
                    .pipe(
                        tap(user => {
                            this.subject.next(user);  << emit the value of user profile and pass in the user profile to the observable 
                            localStorage.setItem(AUTH_DATA, JSON.stringify(user));   << save the user profile in browser local storage for persistent login
                        }),
                        shareReplay()
                    );
            }


            logout() {
                this.subject.next(null);
                localStorage.removeItem(AUTH_DATA);  << remove local storage auth data to stop persistent logged in state when logout button is clicked
            }


        }

        ** login.component.ts
        @Component({
            selector: 'login',
            templateUrl: './login.component.html',
            styleUrls: ['./login.component.scss']
            })
            export class LoginComponent implements OnInit {

            form: FormGroup;

            constructor(
            private fb: FormBuilder,
            private router: Router,
            private auth: AuthStore) {

            this.form = fb.group({                                                 << form group with form builder & input validation (best approach for forms)
                email: ['test@angular-university.io', [Validators.required]],
                password: ['test', [Validators.required]]
            });

            }

            ngOnInit() {

            }

            login() {

            const val = this.form.value;   << save all form values and assign to 'val'

            this.auth.login(val.email, val.password)   << send val of username & password from form fields to auth store login method
                .subscribe(
                    () => {
                        this.router.navigateByUrl("/courses")    << take us automatically to the courses page if login auth is successful
                    },
                    err => {
                        alert("Login failed!");    << to alert the user the login failed.  
                    }
                );

            }

        }
        

        ** login.component.html
        
        <mat-card class="login-page">
        <mat-card-title>Login</mat-card-title>
        <mat-card-content>
            <form [formGroup]="form" class="login-form">

            <mat-form-field>

                <input matInput type="email"
                    placeholder="Email"
                    formControlName="email">

            </mat-form-field>

            <mat-form-field>

                <input matInput type="password"
                    placeholder="Password"
                    formControlName="password">

            </mat-form-field>

            <button mat-raised-button color="primary"
                    (click)="login()"
                    [disabled]="!form.valid">Login</button>   << disable login button if required fields are not complete

            </form>
        </mat-card-content>
        </mat-card>


        ** app.component.ts

        @Component({
            selector: 'app-root',
            templateUrl: './app.component.html',
            styleUrls: ['./app.component.css']
            })
            export class AppComponent implements  OnInit {

                constructor(public auth: AuthStore) {

                }

                ngOnInit() {


                }

            logout() {
                    this.auth.logout();

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

                <a mat-list-item routerLink="login" *ngIf="auth.isLoggedOut$ | async">   << conditionally render the login button using auth store .isLoggedOut$ observable
                    <mat-icon>account_circle</mat-icon>
                    <span>Login</span>
                </a>

                <a mat-list-item (click)="logout()" *ngIf="auth.isLoggedIn$ | async">    << conditionally render the logout button using auth store .isLoggedOut$ observable
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

            <messages></messages>

            <loading></loading>

            <router-outlet></router-outlet>



    - Section 5 - Master Detail UI Pattern:

        - Master Detail UI Pattern enables us to implement 'local state management'. One use case for this would be a type-ahead search feature, were we would type a search query in the search form filed, and use the search query on the backend to produce a list of results that matched the search query and we are then able to click a search result item and we taken to a view of that particular item. For example, search courses in the search field, retrieve courses that match that search from the backend and show a list of courses that matched our search result and then click a course to be taken to a separate view for that individual course. When we produce the search results ideally we want to save these results in some form of state using local state management so we are not producing html search results from the backend every time we perform a new search and so that we can use the saved results to then click and be taken to that course. We will implemented this local state management using the 'Master Detail UI Pattern' in the search-lessons.component & lessons.component. The master table will be implemented in the search-lessons.component.ts file in a member variable - searchResults$: Observable<Lessons[]>. the searchResults$ observable will store the array of lessons generated fom the search (this approach of saving state in member variables is a neat way to save state as apposed to using a third party state management library like, NgRx). We implement this by first applying a template variable (<input matInput placeholder="Type your search" #searchInput autocomplete="off">) to the search input field and we pass this search value in to the onSearch() method by using a click handler on the search button this value in the (click)=onSearch(searchInput.value). In the onSearch() method we pass the search string as a parameter. We inject the coursesService in the constructor which will then call the searchLessons(search) method with the search param in the coursesService to search the backend with http 'get' request to search for courses. In the courses.service.ts searchLessons() method we filter by search result from the get request using params & then pipe & map through results and extract the payload from the results object so we have search results. We then subscribe to the searchLessons$ observable display the search results in the search-lessons.html by using the search searchResults$ observable which now contains a list of results retrieved from the backend we then use async pipe with *ngIf to display the results (<ng-container *ngIf="(searchResults$ | async) as lessons">) & <tr class="lesson-row" *ngFor="let lesson of lessons" to loop through the lessons so they can be displayed (by using as lessons in the async pipe we use this variable of lessons in the ngFor loop to show the lessons). The next part to implement is the ability to click a search result and be taken to that lesson with a detailed view of that lesson. We create a activeLesson$ member variable as an observable in the search-lessons.component.ts. We then create a openLesson(lesson: string) method passing in the lesson as a param and assign that param to the activeLesson$ observable in this method. In the template search-lessons.component.html in ng-container we check if activeLesson is not true (<ng-container  *ngIf="!activeLesson; else detail">) to show the details ng-template with the active lessons details (<ng-template #detail> ) template variable applied to ng-template to display activeLesson detail section by using the lesson component ( <lesson [lesson]="activeLesson"></lesson>) and we pass in activeLesson  with input binding to show the lesson details inside of the re-usable lesson.component.html & lesson.component.ts. We include a click handler in to #detail ng-template so we can return back to the search list ((click)="onBackToSearch()">). This click handler calls the onBackToSearch() method which set activeLesson$ variable to null when we click the button which takes us back to our search results list. The list is stored in local member variable so the loading indicator does not show and is the purpose of the master detail UI pattern using local state management within the component unlike using a store we there state is stored in a store used by the entire application. The final stage is to create the lesson.component.html & ts file to show the individual lesson detail view (as shown below). 


        - Implementation of the Master Detail UI Pattern for courses search feature:

        ** search-lessons.component.ts

        @Component({
            selector: 'course',
            templateUrl: './search-lessons.component.html',
            styleUrls: ['./search-lessons.component.css'],
                changeDetection: ChangeDetectionStrategy.OnPush
            })

            export class SearchLessonsComponent implements OnInit {

            searchResults$ : Observable<Lesson[]>;

            activeLesson:Lesson;

            constructor(private coursesService: CoursesService) {


            }

            ngOnInit() {

            }

                onSearch(search:string) {
                    this.searchResults$  = this.coursesService.searchLessons(search);  << pass search query to method, search courses in the coursesService and save to         s                                                                     searchResults$
                }

                openLesson(lesson:Lesson) {
                this.activeLesson = lesson;   << assign the clicked lesson from the search list to the activeLesson member variable
                }

                onBackToSearch() {
                this.activeLesson = null;     << set active lesson to null when we click the back to search button on the lesson detail view
                }

        }

        **search-lessons.component.html

        <div class="course">

            <h2>Search All Lessons</h2>

            <mat-form-field class="search-bar">

                <input matInput placeholder="Type your search" #searchInput autocomplete="off">    << searchInput template variable to save search result

            </mat-form-field>

            <button class="search" mat-raised-button color="primary"
                    (click)="onSearch(searchInput.value)" >                << pass search result to onSearch method with searchInput.value as params                       
                <mat-icon>search</mat-icon>
                Search
            </button>

                <ng-container  *ngIf="!activeLesson; else detail">          << if activeLesson is not true show the details ng-template with the active lessons details

                    <ng-container *ngIf="(searchResults$ | async) as lessons">  << display the search results using the search searchResults$ and async pipe with *ngIf

                        <table class="lessons-table mat-elevation-z7">

                            <thead>
                            <th>#</th>
                            <th>Description</th>
                            <th>Duration</th>
                            </thead>

                            <tr class="lesson-row" *ngFor="let lesson of lessons"
                                (click)="openLesson(lesson)">
                                <td class="seqno-cell">{{lesson.seqNo}}</td>
                                <td class="description-cell">{{lesson.description}}</td>
                                <td class="duration-cell">{{lesson.duration}}</td>
                            </tr>

                        </table>

                    </ng-container>

                </ng-container>

                <ng-template #detail>        << #detail template variable applied to ng-template to display activeLesson detail section 

                    <button mat-raised-button class="back-btn" (click)="onBackToSearch()">
                        <mat-icon>arrow_back_ios</mat-icon>
                        Back to Search
                    </button>

                    <lesson [lesson]="activeLesson"></lesson> <<  lesson component with the active lesson passed in with input binding

                </ng-template>

        </div>


        ** courses.service.ts
        @Injectable({
            providedIn:'root'
        })

        export class CoursesService {

            constructor(private http:HttpClient) {

            }

            loadCourseById(courseId:number) {
            return this.http.get<Course>(`/api/courses/${courseId}`)
                    .pipe(
                    shareReplay()
                    );
            }

            loadAllCourseLessons(courseId:number): Observable<Lesson[]> {
                return this.http.get<Lesson[]>('/api/lessons', {
                    params: {
                        pageSize: "10000",
                        courseId: courseId.toString()
                    }
                })
                    .pipe(
                        map(res => res["payload"]),
                        shareReplay()
                    );
            }

            loadAllCourses(): Observable<Course[]> {
                return this.http.get<Course[]>("/api/courses")
                    .pipe(
                        map(res => res["payload"]),
                        shareReplay()
                    );
            }


            saveCourse(courseId:string, changes: Partial<Course>):Observable<any> {
                return this.http.put(`/api/courses/${courseId}`, changes)
                    .pipe(
                        shareReplay()
                    );
            }


            searchLessons(search:string): Observable<Lesson[]> {    << use search params from search input to search course that matches search query
                return this.http.get<Lesson[]>('/api/lessons', {
                    params: {
                        filter: search,                             << filter by search result passed in with get request params solution
                        pageSize: "100"
                    }
                })
                    .pipe(
                        map(res => res["payload"]),                 << pipe & map through results and extract the payload from the results object so we have search results 
                        shareReplay()
                    );
            }


        }

        ** lesson.component.ts
        @Component({
            selector: 'lesson',
            templateUrl: './lesson.component.html',
            styleUrls: ['./lesson.component.css']
            })
            export class LessonComponent implements OnInit {

            @Input()
            lesson:Lesson;  

            constructor() { }

            ngOnInit() {

            }

        }


        ** lesson.component.html
        <div class="lesson-detail">

            <h3>{{lesson.description}}</h3>

            <h5>Duration: {{lesson.duration}}</h5>

            <iframe width="400" height="220"  frameborder="0" allowfullscreen
                [src]="('https://www.youtube.com/embed/' + lesson?.videoId) | safeUrl">

            </iframe>

        </div>

    
    - Section 6 - The Single Data Observable Pattern

        - 











        












        




            





    











       