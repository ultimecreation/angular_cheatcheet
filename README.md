# angular_share_data_between_components and Http requests


## custom validators and asyncValidators


- component.ts
 
```
    import { Component } from '@angular/core';
    import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, RequiredValidator, Validators } from '@angular/forms';
    import { of } from 'rxjs';
    
    function containsQuestionMark(control: AbstractControl) {
        if (control.value.includes('?')) return null
        return { doesNotContainQuestionMark: true }
    }
    
    function emailIsUnique(control: AbstractControl) {
        // DO SOME HTTP REQUEST AND DB CALLS TO RETURN AT THE END AN OBSERVABLE
        if (control.value !== 'test@test.com') return of(null)
        return of({ emailExists: true })
    
    }
    @Component({
        selector: 'app-login',
        standalone: true,
        templateUrl: './login.component.html',
        styleUrl: './login.component.css',
        imports: [ReactiveFormsModule]
    })
    export class LoginComponent {
        form = new FormGroup({
            email: new FormControl('', {
                validators: [Validators.required, Validators.email],
                asyncValidators: [emailIsUnique]
            }),
            password: new FormControl('', {
                validators: [
                    Validators.required,
                    Validators.minLength(4),
                    containsQuestionMark
                ]
            })
        })
    
        get emailIsInvalid() {
            return (this.form.controls.email.touched
                && this.form.controls.email.dirty
                && this.form.controls.email.invalid)
        }
        get passwordIsInvalid() {
            return (this.form.controls.password.touched
                && this.form.controls.password.dirty
                && this.form.controls.password.invalid)
        }
        handleLogin() {
            console.log(this.form)
        }
    }


```


## HTTP requests
- component.html

  ```
  <app-places-container title="Your Favorite Places">
    @if (error()) {
      <p class="fallback-text">
        {{ error() }}
      </p>
    } @if (isFetching()) {
      <p class="fallback-text">Fetching places.....</p>
    } @if (places()) {
      <app-places [places]="places()!" />
    } @else if (places()?.length === 0) {
      <p class="fallback-text">Unfortunately, no places could be found.</p>
    }
  </app-places-container>

  ```

- component.ts
 
```

      import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
      
      import { PlacesContainerComponent } from '../places-container/places-container.component';
      import { PlacesComponent } from '../places.component';
      import { Place } from '../place.model';
      import { HttpClient } from '@angular/common/http';
      import { catchError, map, throwError } from 'rxjs';
      
      @Component({
          selector: 'app-user-places',
          standalone: true,
          templateUrl: './user-places.component.html',
          styleUrl: './user-places.component.css',
          imports: [PlacesContainerComponent, PlacesComponent],
      })
      export class UserPlacesComponent implements OnInit {
    
    
        places = signal<Place[] | undefined>(undefined);
        isFetching = signal(false)
        error = signal('')
    
        private httpClient = inject(HttpClient);
        private destroyRef = inject(DestroyRef);
    
    
        ngOnInit(): void {
            this.isFetching.set(true)
            const subscription = this.httpClient.get<{ places: Place[] }>('http://localhost:3000/user-places')
                .pipe(
                    map(resData => resData.places),
                    catchError((err) => {
                        console.log(err)
                        return throwError(() => new Error('Unable to fetch data'))
                    })
                ).subscribe({
                    next: (places) => {
                        this.places.set(places)
                        console.log(places)
                        // console.log(response.body?.places)
                    },
                    complete: () => {
                        this.isFetching.set(false)
                    },
                    error: (err) => {
                        this.error.set(err.message)
                        this.isFetching.set(false)
    
                    }
                })
    
            this.destroyRef.onDestroy(() => {
                subscription.unsubscribe()
            })
        }
    }

```



## From parent to child

```
@Component({
  selector: 'app-parent',
  standalone: true,
  imports: [ChildComponent],
  templateUrl: '
  <div>
      <h1>Parent Component</h1>
      <app-child [dataFromParent]="dataFromParent"> </app-child>
  </div>
  '
})

export class ParentComponent {
  protected dataFromParent: string = "I'm a Data from parent and displayed in child"
}


@Component({
    selector: 'app-child',
    standalone: true,
    imports: [],
    templateUrl: '
<div>
  <h2>Child</h2>
  <p>{{ dataFromParent }}</p>'
})
export class ChildComponent implements OnInit {
    // option 1
    @Input() dataFromParent: string = ''

    // option 2 using lowercase input()
    dataFromParent = input()
```

## From child to Parent
### Event emitter version

```
@Component({
    selector: 'app-child',
    standalone: true,
    imports: [],
    templateUrl: '
  <div >
    <h2>Child</h2>
    <button (click)="handleClick()">Send data to parent</button>
  </div>
'
})
export class ChildComponent implements OnInit {

    @Output() dataFromChildEvent = new EventEmitter<string>()

    handleClick() {
        this.dataFromChildEvent.emit("I'm a Data from child and displayed in parent")
    }
}



@Component({
    selector: 'app-parent',
    standalone: true,
    imports: [ChildComponent],
    templateUrl: '
  <div>
      <h1>Parent Component</h1>
      <p>{{ dataFromChild }}</p>

      <app-child (dataFromChildEvent)="handleDataFromChild($event)"> </app-child>
  </div>
'
})
export class ParentComponent implements AfterViewInit {

    public dataFromChild: string = ''

    handleDataFromChild($event: string) {
        this.dataFromChild = $event
    }
}
```


### @ViewChild version

```
@Component({
    selector: 'app-child',
    standalone: true,
    imports: [],
    templateUrl: './child.component.html'
})
export class ChildComponent implements OnInit {
    private childData = "I'm a Data of child accessed by parent through @ViewChild"
}




@Component({
    selector: 'app-parent',
    standalone: true,
    imports: [],
    templateUrl: '
    <div style="background-color: burlywood">
      <h1>Parent Component</h1>
    
      <h2>Data accessed trough child view</h2>
      <p>{{ dataAccessedByParentThroughViewChild }}</p>
    </div>

'
})
export class ParentComponent implements AfterViewInit {
    protected dataAccessedByParentThroughViewChild: string | undefined;

    @ViewChild(ChildComponent) child: any;

    ngAfterViewInit(): void {
        this.dataAccessedByParentThroughViewChild = this.child.childData
    }
}

```



## From a Service to any component 
### Behavior Subject version

```
export type BehaviorUser = {
    username: string,
    isLogged: boolean
}

@Injectable({
    providedIn: 'root'
})

export class AuthBehaviorService {
    private userSetter = new BehaviorSubject<BehaviorUser>({ username: '', isLogged: false })
    public userGetter = this.userSetter.asObservable()

    login(incomingUsername: string) {
        this.userSetter.next({ username: incomingUsername, isLogged: true })
    }

    logout() {
        this.userSetter.next({ username: '', isLogged: false })
    }
}


@Component({
    selector: 'app-child-sibling',
    standalone: true,
    imports: [],
    templateUrl: '
    <div style="background-color: cadetblue">
        <h2>Child sibling</h2>
        <button (click)="login()">Bs Login</button>
        <button (click)="logout()">Bs Logout</button>

         <div>
            <h3>Data from Behavior Subject</h3>
        
            <p>User : {{ userBS.username }}</p>
            <p>
              {{ userBS.isLogged ? "Logged In" : "Logged Out" }}
            </p>
        </div>
    </div>
'
})
export class ChildSiblingComponent implements OnInit {

    private authBehaviorService = inject(AuthBehaviorService)
    public userBS!: BehaviorUser;

    ngOnInit(): void {
        this.authBehaviorService.userGetter.subscribe(user => this.userBS = user)
    }

    login() {
        this.authBehaviorService.login("My Username")
    }

    logout() {
        this.authBehaviorService.logout()
    }

}
```

### Signal version

```
export type User = {
 name: string | undefined,
isAuthenticated: boolean
}

@Injectable({
    providedIn: 'root'
})

export class AuthContextService {
    private name = signal('')
    private isAuthenticated = signal(false)

    setUsername(incomingName: string) {
        this.name.set(incomingName)
    }
    getUsername() {
        return this.name()
    }

    setUserIsAuthenticated(incomingBoolean: boolean) {
        return this.isAuthenticated.set(incomingBoolean)
    }
    getUserIsAuthenticated() {
        return this.isAuthenticated()
    }
}



@Component({
    selector: 'app-parent',
    standalone: true,
    imports: [],
    templateUrl: '
  <div>
    <h1>Parent Component</h1>
  
    <button (click)="login()">log user in</button>
    <button (click)="logout()">log user out</button>

   <div>
      <h3>Data from Signal</h3>
      <p>User : {{ authContext.getUsername() }}</p>
      <p>
        {{ authContext.getUserIsAuthenticated() ? "Logged In" : "Logged Out" }}
      </p>
    </div>
  </div>
'
})
export class ParentComponent implements AfterViewInit {
   
    public authContext = inject(AuthContextService)

    login() {
        this.authContext.setUserIsAuthenticated(true)
        this.authContext.setUsername("Nas")
    }

    logout() {
        this.authContext.setUserIsAuthenticated(false)
        this.authContext.setUsername("")
    }
}

```


