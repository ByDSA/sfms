# Máquina de estados con validación de estática (Static FMS)

Máquina de estados (FMS) con validación estática de las acciones y transiciones que pueden o no hacer los estados y autoinvalidación de las referencias a estados anteriores.

## Uso
```ts
let sfms: StateMachine = newSFMS(new State1());

sfms.actionOfState1();
sfms = sfms.toState2();

sfms.actionOfState2(2, 3);
sfms.actionOfState1(); // ❌ Error estático

const state2: State2 = sfms;

sfms = sfms.toState3("a", "b");
state2.actionOfState2(2, 3); // ❌ No ejecuta la acción (comprobación en ejecución)
sfms = sfms.toState2();
state2.action2(2, 3); // ❌ Tampoco permitida.
```

El contexto privado del estado guardado en la referencia `state2` puede haber cambiado o el input de la transición de estado ser diferente. En ese caso el comportamiento del estado podría ser diferente, aunque de forma abstracta sea el mismo estado. Por eso no vuelve a funcionar la referencia de un estado anterior aunque se haya vuelto al mismo estado.

El tipo `StateMachine` se crea manualmente con la unión de todos los estados que se quiera que pueda contener la máquina de estados. Ejemplo:
```ts
type StateMachine = State1 | State2 | State3;
```

## Creación de estados
Se utilizan clases normales para crear los estados.
```ts
export class State {
  action1(): void {
   // ...
  }

  action2(a: number, b: number): number {
    // ...
  }

  action3(): void {
    // ...
  }

  toState2(): State2 {
   // ...
  }
}
```
Para el sistema de invalidación de estados, se necesita usar decoradores para indicar cuáles son los métodos de transición. Hay dos posibilidades.

Mediante decorador `@state` a nivel de clase:
```ts
@state( {
  transitions: {
    pattern: /toState+/,
  },
} )
class State1 {
  toState2(): State2 {
    return new State2();
  }

  toState3(): State3 {
    return new State3();
  }

  // ...
}
```

Mediante decorador `@transition` a nivel de método:
```ts
class State1 {
  @transition
  toState2(): State2 {
    return new State2();
  }

  // ...
}
```

## Delete SFMS
Ya que el sistema de invalidación de estados guarda información interna para poder identificar que las instancias de estado corresponden a la misma máquina de estados, es necesario eliminar la máquina de estados manualmente para liberar de memoria sus referencias. Esto se hace con esta función:
```ts
deleteSFMS(sfms);
```

## Custom error
Se puede personalizar el comportamiento cuando se intentan ejecutar acciones de estados invalidados.

```ts
let sfms: StateMachine = newSFMS(new State1(), {
  onError: (target: object) => {
    console.log(`${target.constructor.name}: Custom error de estado invalidado.`);
  },
} );

```