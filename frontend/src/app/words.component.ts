import { Component, inject } from '@angular/core';
import { DataService } from './data.service';
import { GUESS_RESULT, INITIAL_STATE, IResponse, IState, ITry } from 'src/types/types';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-words',
  template: `
    <fieldset>
        Scoreboard = Correct : {{dataService.game_state().win_count}}, Incorrect : {{dataService.game_state().loss_count}}
    </fieldset>

    <fieldset >
      <div>
        <div class="word" *ngFor="let c of answerChar" (click)="removeWord(c)">
            {{c | uppercase}}
        </div>
      </div>
      <button class='clear' (click)="clearAnswer()">
        Clear
      </button>
    </fieldset>
    <fieldset>
      <div class="gameSet">
        <button (click)="clearAndLoad()"> Shuffle </button>
        <button *ngFor="let char of gameChar" (click)="addtoAnswer(char)"> {{char | uppercase}} </button>
        <button (click)="checkWord()"> Check </button>
      </div>
        
    </fieldset>
  `,
  styles: [
    'fieldset {margin-top : 20px; padding: 10px;}',
    '.clear { float: right}',
    '.word{padding:5px; margin-left:10px; float: left; cursor: pointer}',
    '.gameSet button {float:left; padding: 15px; margin-right: 15px;}'
  ]
})
export class WordsComponent {
  dataService = inject(DataService)
  answerChar: string[] = []
  gameChar: string[] = []
  gameResult !: IResponse
  gameTry !: ITry
  sub !: Subscription


  ngOnInit() {
    this.loadGameChar()
  }

  loadGameChar() {
    this.gameChar = this.getRandomLettersArrayOf(this.dataService.game_state().complexity)
  }

  clearAnswer() {
    this.answerChar = []
  }

  clearAndLoad() {
    this.clearAnswer()
    this.loadGameChar()
  }
  private getRandomLettersArrayOf(length: number): string[] {
    let result: string[] = [];
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    while (result.length < length) {
      const letter = characters.charAt(Math.floor(Math.random() * characters.length))
      if (!result.includes(letter)) result.push(letter)
    }
    return result;
  }

  addtoAnswer(char: string) {
    this.answerChar.push(char);
  }

  removeWord(char: string) {
    this.answerChar = this.answerChar.filter(c => c != char)
  }

  checkWord() {
    const answer = this.answerChar.join('')

    this.sub = this.dataService.checkWord(answer).subscribe(resp => {
      this.gameResult = resp as IResponse

      if (this.gameResult.data.valid) {
        this.dataService.game_state.mutate(state => ++state.win_count)
      }
      else {
        this.dataService.game_state.mutate(state => ++state.loss_count)
      }

      this.dataService.game_state.mutate(state => state.logs.push({
        word: answer,
        result: (this.gameResult.data.valid) ? GUESS_RESULT.Correct : GUESS_RESULT.Incorrect,
        timestamp: Date.now()
      }))

      localStorage.setItem('GAME_STATE', JSON.stringify(this.dataService.game_state()))
    })
    this.clearAnswer()
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe()
    }
  }
}
