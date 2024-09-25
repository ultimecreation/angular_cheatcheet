import { Injectable, model, signal } from '@angular/core';
export type User = { name: string | undefined, isAuthenticated: boolean }
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
