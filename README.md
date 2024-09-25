# angular_share_data_between_components

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
    @Input() dataFromParent: string = ''
```

## From child to Parent

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

