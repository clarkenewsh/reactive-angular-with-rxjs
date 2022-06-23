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
                

                constructor(private dialog: MatDialog, coursesService: CoursesService) {

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
                            shareReplay() << shareReplay() ensures that we dont have two separate http calls to the backend
                        );
                    }
                }

            - Angular view Layer Patterns - Smart vs Presentational Components: Presentational components are view templates that its only responsibility is to display to the UI the data we input to the view. It will not contain any other logic. To do this we would want to create a courseCardList component with an @Input(): Course[] = [] in the ts file. The courseCardList view template where we ngFor let course of courses through the courses array. We would then instantiate the courseCardList component within the home.component as pass in the [courses]=beginnerCourses$ | async to subscribe to the observables that way. By doing this we are implementing a presentational component using courseCardList were its only responsibility is to display the courses data that comes from the @Input and the subscribing using the async pipe and logic to call the coursesService will be implemented in the home.component.ts. The home.component.ts will now be classed as the smart component as it contains the logic for injecting the coursesService, the logic for calling the loadAllCourses() method, map and filter the observable response and also contains the Observable member variables. The home.component.html view will then just instantiate the courseCardList components as subscribe to the courses observable  by passing in <courses-card-list[courses]=beginnerCourses$ | async></<courses-card-list> & <courses-card-list[courses]=advancedCourses$ | async></<courses-card-list>  












            

















       