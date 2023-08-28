export enum IDState {
  State1 = "State1",
  State2 = "State2",
  State3 = "State3",
  State4 = "State4",
  State5 = "State5",
  State6 = "State6",
  State7 = "State7",
  // ❌ Existe State8, pero no su ID y no se lanza ningún error
}

/*
Forzar que no se pueda repetir el string de una ID por error

Soluciones:
✔️ Se podría usar una regla de linter como https://typescript-eslint.io/rules/no-duplicate-enum-values/
✔️ Forzar una comprobación estática para comprobar que los values deben existir en el conjunto de keys y las keys en el conjunto de values

Problema:
❌ Si hay key-values cruzados no daría error (ejemplo: State6=>"State5", State5=>"State6")
*/

type IDStateKeys = keyof typeof IDState;
type IDStateValues = `${IDState}`;
type Checker = IDStateValues extends IDStateKeys ? "OK" : `El valor '${Exclude<IDStateValues, IDStateKeys>}' no está definido como key`;
type Checker2 = IDStateKeys extends IDStateValues ? "OK" : `La key '${Exclude<IDStateKeys, IDStateValues>}' no está definida como valor`;
const _1: Checker = "OK";
const _2: Checker2 = "OK";

/*
❌ Nada puede forzar a que existiendo un estado exista una ID para ese estado, debido a que los estados son tipos y se borran en compilación

- No se puede guardar un string de ID en el tipo y usarlo para definir los valores del enum de IDs, ya que los tipos se borran en la transpilación. Tampoco se puede en un const enum.
- Tampoco hay forma de convertir el union AnyState a literales para compararlos con las key/value del enum IDState
- Tampoco se puede hacer la restricción en ejecución, porque los estados son tipos y se borran en ejecución
*/

/** Definición de los permisos individuales de cada estado */
interface CanAction1 {
  action1(): void;
}
interface CanAction2 {
  action2(): void;
}
interface CanAction3 {
  action3(): void;
}
interface CanAction4 {
  action4(): void;
}
interface CanAction5 {
  action5(): void;
}
interface CanToState1 {
  toState1(): State1;
}
interface CanToState2 {
  toState2(): State2;
}
interface CanToState3 {
  toState3(): State3;
}
interface CanToState4 {
  toState4(): State4;
}
interface CanToState5 {
  toState5(): State5;
}
interface CanToState6 {
  toState6(): State6;
}
interface CanToState7 {
  toState7(): State7;
}
interface CanToState8 {
  toState8(): State8;
}

/**
 * Definición de los estados
 */

interface State {
  getCurrentState(): IDState;
}
export type State1 = State & CanAction1 & CanToState2;
export type State2 = State & CanAction2 & CanToState1 & CanToState3;
export type State3 = State & CanAction1 & CanAction2 & CanAction3 & CanToState2 & CanToState4;
export type State4 = State & CanAction3 & CanAction4 & CanToState5;
export type State5 = State & CanAction1 & CanAction2 & CanAction4 & CanToState1 & CanToState6;
export type State6 = State & CanAction2 & CanToState5 & CanToState7;
export type State7 = State & CanAction2 & CanAction4 & CanAction5 & CanToState5 & CanToState8;
export type State8 = State & CanToState4 & CanToState5;

export type AnyState = State1|State2|State3|State4|State5|State6;
// ✔️ Si se olvida de añadir un nuevo estado definido aquí, el compilador avisará cuando se intenten usar sus métodos

type UnionToIntersection<U> = (U extends any ? (arg: U) => any : never) extends ((arg: infer I) => void)
  ? I
  : never;

export type AllStates = UnionToIntersection<AnyState>;