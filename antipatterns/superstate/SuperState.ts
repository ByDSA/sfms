import { AllStates, AnyState, IDState, State1, State2, State3, State4, State5, State6, State7, State8 } from "./States";

export default class SuperState implements AllStates {
  #idState!: IDState;

  private constructor() {
  }
  toState8(): State8 {
    throw new Error("Method not implemented.");
  }
  toState7(): State7 {
    this.#idState = IDState.State7;
    // @ts-ignore // ✔️ El compilador avisa de que se ha olvidado añadir State7 a la lista de estados en AnyState
    return this;
  }
  toState6(): State6 {
    this.#idState = IDState.State6;
    return this;
  }
  action4(): void {
    switch(this.#idState) {
      case IDState.State4:
        console.log("action4. State real: " + this.getCurrentState() + "State esperado: State4");
        break;
    case IDState.State5:
      console.log("action4. State real: " + this.getCurrentState() + "State esperado: State6");
      break;
    case IDState.State3:
    case IDState.State1:
    case IDState.State2:
      impossible();
      break;
    default:
        (this.#idState);
    }
  }

  static init(): State1 {
    const ret = new SuperState();
    return ret.toState1();
  }

  toState5(): State5 {
    this.#idState = IDState.State5;
    return this;
  }
  toState4(): State4 {
    // Olvido de cambiar el idState
    return this;
  }
  action3(): void {
    if (this.#idState === IDState.State3) {
      console.log("action3. State real: " + this.getCurrentState() + " State esperado: State3");
    } else {
      impossible();
    }
  }
  toState1(): State1 {
    this.#idState = IDState.State1;
    return this;
  }
  toState3(): State3 {
    this.#idState = IDState.State3;
    return this;
  }
  init(): asserts this is State1 {
    console.log("init");
  }
  action2(): void {
    switch (this.#idState) {
      case IDState.State2:
        console.log("action2. State real: " + this.getCurrentState() + " State esperado: State2");
      case IDState.State6:
          console.log("action2. State real: " + this.getCurrentState() + " State esperado: State6");
          // Riesgo de olvido break o return
      case IDState.State3:
        console.log("action2. State real: " + this.getCurrentState() + " State esperado: State3");
        return;
      case IDState.State1:
      case IDState.State4:
      case IDState.State5:
      case IDState.State7:
        impossible();
        return;
      default:
        neverCase(this.#idState);
    }
  }
  action1(): void {
    if (this.#idState === IDState.State1) {
      console.log("action1. State real: " + this.getCurrentState() + " State esperado: State1");
    } else if (this.#idState === IDState.State3) {
      console.log("action1. State real: " + this.getCurrentState() + " State esperado: State3");
    } else if (this.#idState === IDState.State6) {
      console.log("action1. State real: " + this.getCurrentState() + " State esperado: State6");
    } else {
      impossible();
    }
  }
  toState2(): State2 {
    this.#idState = IDState.State2;
    return this;
  }

  getCurrentState(): IDState {
    return this.#idState;
  }
};

/**
 * Asserts
 */
export function assertState3(state: AnyState): asserts state is State3 {
  if (state.getCurrentState() !== IDState.State3) {
    throw new Error("Not State3");
  }
}

/**
 * Utils
 */
function neverCase(_: never): never {
  throw new Error("Never case");
}

/*
  Transiciones imposibles. Posibles formas de gestionarlas:
  - No hacer nada (función vacía)
  - Lanzar un error en ejecución
*/
function impossible(): void {
  throw new Error("Method not implemented.");
}