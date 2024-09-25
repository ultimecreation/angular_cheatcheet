import { AfterViewInit, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AuthContextService, User } from '../../services/auth-context.service';
import { AuthBehaviorService, BehaviorUser } from '../../services/auth-behavior.service';

@Component({
    selector: 'app-child',
    standalone: true,
    imports: [],
    templateUrl: './child.component.html'
})
export class ChildComponent implements OnInit {
    public authContext = inject(AuthContextService)
    private authBehaviorService = inject(AuthBehaviorService)
    public userBS!: BehaviorUser;

    ngOnInit(): void {
        this.authBehaviorService.userGetter.subscribe(user => this.userBS = user)
    }

    @Input() dataFromParent: string = ''

    @Output() dataFromChildEvent = new EventEmitter<string>()
    private childData = "I'm a Data of child accessed by parent through @ViewChild"

    handleClick() {
        this.dataFromChildEvent.emit("I'm a Data from child and displayed in parent")
    }

}
