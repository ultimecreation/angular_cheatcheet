import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
