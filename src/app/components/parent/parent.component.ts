import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { ChildComponent } from "../child/child.component";
import { AuthContextService, User } from '../../services/auth-context.service';
import { ChildSiblingComponent } from "../child-sibling/child-sibling.component";

@Component({
    selector: 'app-parent',
    standalone: true,
    imports: [ChildComponent, ChildSiblingComponent],
    templateUrl: './parent.component.html'
})
export class ParentComponent implements AfterViewInit {
    @ViewChild(ChildComponent) child: any;
    protected dataAccessedByParentThroughViewChild: string | undefined;
    protected dataFromParent: string = "I'm a Data from parent and displayed in child"


    public dataFromChild: string = ''
    public authContext = inject(AuthContextService)

    handleDataFromChild($event: string) {
        this.dataFromChild = $event
    }
    ngAfterViewInit(): void {
        this.dataAccessedByParentThroughViewChild = this.child.childData
    }
    login() {

        this.authContext.setUserIsAuthenticated(true)
        this.authContext.setUsername("Nas")
    }

    logout() {
        this.authContext.setUserIsAuthenticated(false)
        this.authContext.setUsername("")
    }
}
