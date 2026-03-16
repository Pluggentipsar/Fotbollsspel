import { type Player } from '@/entities/Player';
import { type Ball } from '@/entities/Ball';
import { createEmptyInputState, type InputState } from '@/input/InputState';

export type AIState = 'idle' | 'chase-ball' | 'dribble' | 'attack' | 'defend' | 'shoot-weapon';

interface AIContext {
  player: Player;
  ball: Ball;
  teammates: Player[];
  opponents: Player[];
  ownGoalX: number;
  opponentGoalX: number;
}

const CHASE_BALL_RANGE = 300;    // px — avstånd för att jaga boll
const DRIBBLE_RANGE = 35;        // px — avstånd för att dribla
const SHOOT_RANGE = 250;         // px — avstånd för att skjuta mot mål
const WEAPON_RANGE = 200;        // px — avstånd för att skjuta vapen mot motståndare
const DEFEND_RETREAT_X = 150;    // px — hur långt framför eget mål man försvarar

export class AISystem {
  private stateMap: Map<Player, AIState> = new Map();

  getState(player: Player): AIState {
    return this.stateMap.get(player) ?? 'idle';
  }

  update(context: AIContext): InputState {
    const { player, ball, opponents, ownGoalX, opponentGoalX } = context;
    const state = createEmptyInputState();

    if (!player.alive) return state;

    const distToBall = Phaser.Math.Distance.Between(player.x, player.y, ball.x, ball.y);
    const closestOpponent = this.findClosest(player, opponents);
    const distToOpponent = closestOpponent
      ? Phaser.Math.Distance.Between(player.x, player.y, closestOpponent.x, closestOpponent.y)
      : Infinity;

    // Bestäm state
    let aiState: AIState = 'idle';

    if (player.hasBall) {
      // Har bollen — dribla mot mål eller skjut
      const distToGoal = Math.abs(player.x - opponentGoalX);
      if (distToGoal < SHOOT_RANGE) {
        aiState = 'attack';
      } else {
        aiState = 'dribble';
      }
    } else if (distToOpponent < WEAPON_RANGE && closestOpponent?.hasBall) {
      // Motståndare nära med boll — skjut med vapen
      aiState = 'shoot-weapon';
    } else if (distToBall < CHASE_BALL_RANGE) {
      // Bollen är nära — jaga den
      aiState = 'chase-ball';
    } else {
      // Default — försvara
      aiState = 'defend';
    }

    this.stateMap.set(player, aiState);

    // Utför state-action
    switch (aiState) {
      case 'chase-ball':
        this.chaseBall(state, player, ball);
        break;
      case 'dribble':
        this.dribbleToGoal(state, player, opponentGoalX);
        break;
      case 'attack':
        this.shootAtGoal(state, player, opponentGoalX);
        break;
      case 'defend':
        this.defend(state, player, ball, ownGoalX);
        break;
      case 'shoot-weapon':
        if (closestOpponent) {
          this.shootWeapon(state, player, closestOpponent);
        }
        break;
    }

    return state;
  }

  private chaseBall(state: InputState, player: Player, ball: Ball): void {
    const angle = Phaser.Math.Angle.Between(player.x, player.y, ball.x, ball.y);
    state.movement.x = Math.cos(angle);
    state.movement.y = Math.sin(angle);
    state.aim.x = ball.x;
    state.aim.y = ball.y;

    // Om nära nog, passa/skjut
    const dist = Phaser.Math.Distance.Between(player.x, player.y, ball.x, ball.y);
    if (dist < DRIBBLE_RANGE) {
      state.pass = true;
    }
  }

  private dribbleToGoal(state: InputState, player: Player, goalX: number): void {
    // Rör sig mot motståndarens mål
    const targetY = 360; // Mitt på plan
    const angle = Phaser.Math.Angle.Between(player.x, player.y, goalX, targetY);
    state.movement.x = Math.cos(angle);
    state.movement.y = Math.sin(angle);
    state.aim.x = goalX;
    state.aim.y = targetY;
  }

  private shootAtGoal(state: InputState, player: Player, goalX: number): void {
    // Sikta mot mål och skjut bollen
    const goalY = 360 + (Math.random() - 0.5) * 100; // Lite variation
    state.aim.x = goalX;
    state.aim.y = goalY;
    state.pass = true; // Pass/skott
    state.movement.x = 0;
    state.movement.y = 0;
  }

  private defend(state: InputState, player: Player, ball: Ball, ownGoalX: number): void {
    // Positionera sig mellan boll och eget mål
    const defendX = ownGoalX + (ownGoalX < 640 ? DEFEND_RETREAT_X : -DEFEND_RETREAT_X);
    const defendY = Phaser.Math.Clamp(ball.y, 200, 520);

    const angle = Phaser.Math.Angle.Between(player.x, player.y, defendX, defendY);
    const dist = Phaser.Math.Distance.Between(player.x, player.y, defendX, defendY);

    if (dist > 10) {
      state.movement.x = Math.cos(angle);
      state.movement.y = Math.sin(angle);
    }

    state.aim.x = ball.x;
    state.aim.y = ball.y;
  }

  private shootWeapon(state: InputState, player: Player, target: Player): void {
    // Sikta mot motståndare och skjut vapen
    state.aim.x = target.x;
    state.aim.y = target.y;
    state.shoot = true;

    // Rör sig lite åt sidan för att undvika moteld
    const perpAngle = Phaser.Math.Angle.Between(player.x, player.y, target.x, target.y) + Math.PI / 2;
    state.movement.x = Math.cos(perpAngle) * 0.5;
    state.movement.y = Math.sin(perpAngle) * 0.5;
  }

  private findClosest(player: Player, others: Player[]): Player | null {
    let closest: Player | null = null;
    let minDist = Infinity;

    for (const other of others) {
      if (!other.alive) continue;
      const dist = Phaser.Math.Distance.Between(player.x, player.y, other.x, other.y);
      if (dist < minDist) {
        minDist = dist;
        closest = other;
      }
    }

    return closest;
  }
}
