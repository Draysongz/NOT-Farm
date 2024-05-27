/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

export function useAsyncInitialze<T>(func: () => Promise<T>, deps: any[] = []) {
  const [state, setState] = useState<T | undefined>();

  useEffect(() => {
    (async () => {
      try {
        setState(await func());
      } catch (err) {
        console.log(err);
      }
    })();

    return () => {};
  }, deps);

  return state;
}
