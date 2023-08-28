import { AnyState } from "./States";
import SuperState, { assertState3 } from "./SuperState";

/*
Instanciación de los estados

❌ Si se hace mediante constructor, da igual que se asignara la idState = enum.State1 en el constructor, porque se podrían hacer cosas inconsistentes con el tipado como: const a: State2 = new SuperState(); a.action2(); , cuando el estado interno State1 no tiene action2.

✔️ Debe hacerse mediante un método estático init que fuerza tanto el estado inicial de ejecución (idState = enum.State1) como el estado inicial estático. Esto permite que la elección del estado inicial de tipado sea de la propia instancia.

❌ En cualquier casos, puede existir fallo humano y asignar un estado de ejecución distinto al estado de tipado.
*/

const _: State2 = new SuperState(); // ✔️ error estático: no se permite instanciar SuperState diréctamente.

/*
Tipado de la variable de la instancia del estado

❌ Si se usa el tipo de estado concreto que devuelve la inicialización, obligaría a crear una variable diferente por cada estado, lo que no es práctico.

✔️ Si se usa un tipo que sea la unión de todos los estados, en principio se puede usar una única variable para todos los estados y dejar que actúe el narrowing de tipos, que determinará el tipo correcto en cada contexto.

❌ En casos de variable única, el narrowing no es perfecto y puede fallar, como se verá más adelante
*/
let state: AnyState = SuperState.init();

console.log(state.getCurrentState()); // ✔️ Estado en ejecución: State 1
state.action1(); // ✔️ El narrowing determina que state es de tipo State1 y permite llamar a action1
state.action2(); // ✔️ El narrowing determina que state es de tipo State1 y no permite llamar a action2

state = state.toState2(); // ✔️ El narrowing determina que state pasa a ser de tipo State2
console.log(state.getCurrentState()); // ✔️ Estado en ejecución: State 2
state.action1(); // ✔️ El narrowing determina que state es de tipo State1 y no permite llamar a action1
state.action2(); // ✔️ El narrowing determina que state es de tipo State2 y permite llamar a action2
// ❌ Olvido interno de break/return en el switch, se ejecuta action2 como si fuera State2 (lo único que debería hacer) y también como si fuera State3 (lo que no debería hacer)

/*
❌ Error de narrowing por usar un tipo de unión de estados

❌ El narrowing no es capaz de determinar que el tipo de state es únicamente State3, y dice que es de tipo State1 | State3, ya que State1 es un subconjunto de State3 y state es en realidad de tipo AnyState, que incluye todos los tipos posibles: State1 | State2 | State3 | State4 . No tiene nada que ver con que antes haya sido de tipo State1 según el narrowing, esto también ocurre si se determinara que el estado inicial fuera State3 y se asignara a la variable de estado de tipo AnyState.
*/

state = state.toState3();
console.log(state.getCurrentState()); // ✔️ Estado en ejecución: State 3
state.action2(); // ❌ error de narrowing

/* Soluciones (imperfectas) al error de narrowing

Posibilidades:
 - ✔️ Aserciones explícitas: assertState3(state);
  - ✔️ Narrowing perfecto
  - ✔️ No hay que crear nuevas variables (facilita la lectura y elimina el tener múltiples referencias al mismo objeto)
  - ❌ Redundancia de comprobación de tipos en compilación y en ejecución
  - ❌ Podrían cometerse errores en la comprobación de tipo de ejecución (por ejemplo, decir que lanzara un error cuando no fuera State2) y aún así el narrowing diría que sería de tipo State3 mientras que en ejecución fallaría. Implicaría hacer testing sobre las aserciones.
 - ❌ Casting explícito: const castedState3 = state as State3;
   - ❌ Implica utilizar una nueva variable. Esto no sirve: state = state as State3;
   - ❌ Podrías hacer un casting de "State1 | State3" a "State1" y no daría ningún error. Los estados de ejecución y de compilación serían diferentes.

❌ En cambos casos, implica escribir la comprobación de forma explícita
*/

assertState3(state);
state.action2(); // ✔️ El narrowing determina que state es de tipo State3 y permite llamar a action2

/*
❌ Fallo humano al cambiar de estado de ejecución

Si en la función de transición se olvida cambiar el estado interno o se asigna uno equivocado, el estado de ejecución y el estado de tipado serán diferentes y el tipado estático no serviría de nada.
*/
state = state.toState4();
console.log(state.getCurrentState()); // ❌ Estado en ejecución: State 3
state.action1(); // ❌ Error estático, State 4 no tiene action1, aunque el estado en ejecución State3 sí tiene action1
state.action3(); // ❌ Llama a action3 como si fuera State3
state.action4(); // ❌ No da errores estáticos, pero como el estado en ejecución es State3, que no tiene action4, lanzará un error en ejecución

/*
❌ Fallo humano al gestionar la implementación de la acción para cada estado
*/
state = state.toState5();
// state.action1(); // ❌ Se supone que según el tipado estático puede hacer esta acción, pero como internamente está hecho con if-else, y se ha olvidado implementar
// state.action2(); // ❌ Se supone que según el tipado estático puede hacer esta acción, pero como internamente está hecho con switch y el 'case State5' dice que no se puede hacer y lanza un error en ejecución
state.action4(); // ❌ No existe narrowing en la gestión interna de las acciones y se pueden llamar acciones o propiedades que no existen en el estado actual. En este caso, se llama internamente a action3, que no existe en State5


state = state.toState6();
state.action2(); // ❌ Olvido de break/return en la gestión de la action1. Se ejecuta también el caso de State3
// @ts-ignore
state.action1(); // ❌ action1 está implementada para State6, pero el tipado estático no la permite

state = state.toState7(); // ✔️ El tipado estático avisa de que no se ha añadido State7 a la lista de estados en AnyState.