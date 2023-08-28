import { deleteSFMS, newSFMS } from "./SFMS";
import { State1, State2, State3, StateMachine } from "./States";

let sfms: StateMachine = newSFMS(new State1(), {
  onError: (e: object) => {
    console.log(`${e.constructor.name}: Custom error de estado invalidado.`);
  },
} );

sfms.action1();
sfms = sfms.toState2(1234);

sfms.action2(2, 3);

const state2: State2 = sfms;

sfms = sfms.toState3("a", "b");
assertT<State3, typeof sfms>(sfms);

sfms.action1();
state2.action2(2, 3);
sfms.action2(2, 3);
const state3 = sfms;

sfms = sfms.toState2();
sfms.action2(2, 3);
state3.action1();
state2.action2(2, 3); // No permitida, el contexto del estado guardado en la instancia puede haber cambiado y ser inválido, por eso no vuelve a funcionar.

deleteSFMS(sfms);

// eslint-disable-next-line no-empty-function, no-use-before-define, no-undef
function assertT<T extends U, U>(instance: U): asserts instance is T {
}