import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { fadeAnimation } from '../animation/fade.animation';
import { Player } from '../interface/player.interface';
import { AppService } from '../app.service';

@Component({
  selector: 'app-squid-game',
  templateUrl: './squid-game.component.html',
  styleUrls: ['./squid-game.component.scss'],
  animations: [fadeAnimation],
})
export class SquidGameComponent implements OnInit {
  public players!: Observable<any>;
  public selectedPlayers: string[] = [];
  public isDisplayActionBar: boolean = false;

  constructor(private appService: AppService) {}

  ngOnInit(): void {
    this.players = this.appService.alivePlayers;
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
  }

  revive() {
    this.appService.revive();
  }

  private checkActionBar() {
    this.isDisplayActionBar = !!this.selectedPlayers.length;
  }
}
