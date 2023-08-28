import { isProxy } from "node:util/types";

export type OnErrorFunction = (target: object)=> void;
const DEFAULT_ON_ERROR: OnErrorFunction = (target: object) => console.log(`${target.constructor.name}: no está permitido interactuar con estados anteriores.`);

type Params = {
  onError?: OnErrorFunction;
};
export function newSFMS<T extends object>(initialState: T, params?: Params): T {
  const id = Symbol("id");

  proxyInstanceToId.set(initialState, id);
  idParams[id] = params;

  return transiteTo(id, initialState);
}

export function deleteSFMS<T extends object>(sfms: T): void {
  const id = proxyInstanceToId.get(sfms);

  if (!id)
    throw new Error("No se ha encontrado el id del estado");

  delete idToCurrentInstance[id];
  proxyInstanceToId.delete(sfms);
  delete idParams[id];
}

/* eslint-disable no-invalid-this */
const idToCurrentInstance: {[key: symbol]: any} = {
};
const proxyInstanceToId = new Map<object, symbol>();
const idParams: {[key: symbol]: Params | undefined} = {
};

export function transition(originalMethod: any, _: ClassMethodDecoratorContext): any {
  function replacementMethod(this: any, ...args: any[]) {
    const id = proxyInstanceToId.get(this);

    if (!id)
      throw new Error("No se ha encontrado el id del estado");

    const result = originalMethod.call(this, ...args);

    if (isProxy(result)) // Ya se ha llamado a transition desde el decorador 'state'
      return result;

    if (result === undefined || result === null || !(result instanceof Object))
      throw new Error("El método no devuelve un estado");

    proxyInstanceToId.delete(this);

    return transiteTo(id, result);
  };

  // Mantener 'name' del método original en el método decorado
  // eslint-disable-next-line accessor-pairs
  Object.defineProperty(replacementMethod, "name", {
    get: () => `${originalMethod.name}`,
  } );

  return replacementMethod;
}

type StateParams = {
  transitions: {
    pattern: RegExp;
  };
};
export function state( {transitions}: StateParams): any {
  return (constructor: any) => {
    for (const fStr of Object.getOwnPropertyNames(constructor.prototype)) {
      if (fStr.match(transitions.pattern)) {
        const originalMethod = constructor.prototype[fStr];

        // eslint-disable-next-line no-param-reassign
        constructor.prototype[fStr] = transition(originalMethod, null as any);
      }
    }

    return constructor;
  };
}

function transiteTo<T extends object>(this: any, id: symbol, obj: T): T {
  const newProxyInstance = new Proxy(obj, {
    get(target: any, prop: string) {
      if (idToCurrentInstance[id] === target)
        return target[prop];

      const onError = idParams[id]?.onError ?? DEFAULT_ON_ERROR;

      return ()=>onError(target);
    },
  } );

  idToCurrentInstance[id] = obj;
  proxyInstanceToId.set(newProxyInstance, id);

  return newProxyInstance;
}