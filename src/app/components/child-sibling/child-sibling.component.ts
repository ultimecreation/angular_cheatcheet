import { Component, inject, OnInit } from '@angular/core';
import { AuthBehaviorService, BehaviorUser } from '../../services/auth-behavior.service';

@Component({
    selector: 'app-child-sibling',
    standalone: true,
    imports: [],
    templateUrl: './child-sibling.component.html'
})
export class ChildSiblingComponent implements OnInit {

    private authBehaviorService = inject(AuthBehaviorService)
    public userBS!: BehaviorUser;

    ngOnInit(): void {
        this.authBehaviorService.userGetter.subscribe(user => this.userBS = user)
    }

    login() {
        this.authBehaviorService.login("Naser")
    }

    logout() {
        this.authBehaviorService.logout()
    }

}
