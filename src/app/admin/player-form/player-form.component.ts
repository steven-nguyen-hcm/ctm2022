import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppHelper } from 'src/app/app.helper';
import { PlayerStatusItem } from 'src/app/interface/player-status-item.interface';
import { Player } from 'src/app/interface/player.interface';

@Component({
  selector: 'app-player-form',
  templateUrl: './player-form.component.html',
  styleUrls: ['./player-form.component.scss'],
})
export class PlayerFormComponent implements OnInit {
  @Input()
  player!: Player;

  @Output()
  onSave: EventEmitter<Player> = new EventEmitter<Player>();

  public playerForm!: FormGroup;

  public playerStatuses!: PlayerStatusItem[];

  constructor(private helper: AppHelper) {}

  ngOnInit(): void {
    this.playerStatuses = this.helper.getListPlayerStatuses();
    this.initForm();
  }

  save() {
    const hasStar = this.playerForm.get('star')!.value;

    const newValue = {
      ...this.player,
      ...this.playerForm.value,
      star: hasStar ? 1 : 0
    };
    this.onSave.emit(newValue);
  }

  private initForm() {
    this.playerForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      star: new FormControl(!!this.player.star),
      status: new FormControl(this.player.status, [Validators.required])
    });
  }
}
