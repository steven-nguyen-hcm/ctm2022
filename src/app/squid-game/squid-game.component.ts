import { Component, OnInit } from '@angular/core';
import { Observable, shareReplay, takeUntil } from 'rxjs';
import { fadeAnimation } from '../animation/fade.animation';
import { Player } from '../interface/player.interface';
import { AppService } from '../app.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '../base.component';
import { SquidGameService } from './squid-game.service';

@Component({
  selector: 'app-squid-game',
  templateUrl: './squid-game.component.html',
  styleUrls: ['./squid-game.component.scss'],
  animations: [fadeAnimation],
  providers: [SquidGameService],
})
export class SquidGameComponent extends BaseComponent implements OnInit {
  public players$!: Observable<any>;
  public players!: Player[];
  public selectedPlayers: string[] = [];
  public isDisplayActionBar: boolean = false;
  playersNumbers: number[] = [];

  public addSelectedPlayersForm = new FormGroup({
    playerNumber: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
      Validators.maxLength(2),
    ]),
  });

  constructor(
    private appService: AppService,
    private squidGameService: SquidGameService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initiliaze();
  }

  onSelectHandler(player: Player) {
    this.selectedPlayers.push(player._id);
    this.checkActionBar();
  }

  onDeselectHandler(player: Player) {
    this.selectedPlayers = this.selectedPlayers.filter(
      (id) => id !== player._id
    );
    this.checkActionBar();
  }

  boom() {
    this.appService.boom(this.selectedPlayers);
    this.selectedPlayers = [];
    this.checkActionBar();
  }

  revive() {
    this.appService.revive();
  }

  private checkActionBar() {
    this.isDisplayActionBar = !!this.selectedPlayers.length;
  }

  onSubmit() {
    console.log('here');
    if (this.addSelectedPlayersForm.invalid) {
      return;
    }

    const formControl = this.addSelectedPlayersForm.get('playerNumber')!;
    const playerNumber = +formControl.value!;

    this.squidGameService.addSelectedPlayer$.next(playerNumber);
    formControl.setValue('');
  }

  private initiliaze() {
    this.players$ = this.appService.alivePlayers.pipe(shareReplay());
    this.players$.pipe(shareReplay()).subscribe((players: Player[]) => {
      this.players = players;
    });
  }
}
