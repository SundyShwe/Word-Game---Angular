import { Component, inject } from '@angular/core';
import { GUESS_RESULT, IState, INITIAL_STATE, ITry } from 'src/types/types';
import { DataService } from './data.service';

@Component({
  selector: 'app-history',
  template: `
    <table>
        <thead><td>Words</td><td>Results</td><td>Date</td></thead>
        <tr *ngFor="let try of dataService.game_state().logs" [ngClass]="isCorrect(try.result) ? 'green-bg' : 'red-bg' ">
          <td>{{try.word}}</td>
          <td>{{try.result}}</td>
          <td>{{try.timestamp | date}}</td>
        </tr>
    </table>
    <button (click)="clearHistory()">Clear History</button>
  `,
  styles: [
    'table thead {padding:5px; font-weight: bold;}',
    'table td {padding:10px;}',
    '.green-bg {background-color:green}',
    '.red-bg {background-color:red}',
  ]
})
export class HistoryComponent {
  dataService = inject(DataService)

  isCorrect(result: GUESS_RESULT) {
    return (result == GUESS_RESULT.Correct) ? true : false
  }

  clearHistory() {
    this.dataService.game_state.set({
      complexity: 5,
      win_count: 0,
      loss_count: 0,
      logs: [] as ITry[],
    })
    console.log(this.dataService.game_state())
    localStorage.clear()
  }


}
