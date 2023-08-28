/* eslint-disable no-use-before-define */
/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { state, transition } from "./SFMS";

/** Definición de los permisos individuales de cada estado */
interface CanAction1 {
  action1(): void;
}
interface CanAction2 {
  action2(a: number, b: number): number;
}
interface CanAction3 {
  action3(): void;
}
interface CanToState1 {
  toState1(): State1;
}
interface CanToState2 {
  toState2(a: number): State2;
}
interface CanToState3 {
  toState3(a: string, b: string): State3;
}

/**
 * Definición de los estados
 */

export class State1 implements CanAction1, CanToState2 {
  @transition
  toState2(param: number): State2 {
    console.log(`${this.constructor.name}: método '${State1.prototype.toState2.name}'. Parámetros: ${param}`);

    return new State2();
  }

  action1(): void {
    console.log(`${this.constructor.name}: método '${State1.prototype.action1.name}'.`);
  }
};

@state( {
  transitions: {
    pattern: /toState+/,
  },
} )
export class State2 implements CanAction2, CanToState1, CanToState3 {
  toState3(a: string, b: string): State3 {
    console.log(`${this.constructor.name}: método '${State2.prototype.toState3.name}'. Parámetros: ${a}, ${b}`);

    return new State3();
  }

  toState1(): State1 {
    console.log(`${this.constructor.name}: método '${State2.prototype.toState1.name}'.`);

    return new State1();
  }

  action2(a: number, b: number): number {
    const result = a + b;

    console.log(`${this.constructor.name}: método '${State2.prototype.action2.name}'. Parámetros: ${a}, ${b}. Resultado: ${result}.`);

    return result;
  }
}

@state( {
  transitions: {
    pattern: /toState+/,
  },
} )
export class State3 implements CanAction1, CanAction2, CanAction3, CanToState2 {
  action1(): void {
    console.log(`${this.constructor.name}: método '${State1.prototype.action1.name}'.`);
  }

  action2(a: number, b: number): number {
    const result = a * b;

    console.log(`${this.constructor.name}: método '${State3.prototype.action3.name}'. Parámetros: ${a}, ${b}. Resultado: ${result}`);

    return result;
  }

  action3(): void {
    console.log(`${this.constructor.name}: método '${State3.prototype.action3.name}'.`);
  }

  @transition
  toState2(): State2 {
    console.log(`${this.constructor.name}: método '${State3.prototype.toState2.name}'.`);

    return new State2();
  }
}

export type StateMachine = State1 | State2 | State3;
// ✔️ Si se olvida de añadir un nuevo estado definido aquí, el compilador avisará cuando se intenten usar sus métodos