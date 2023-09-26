import type { WebviewApi } from "vscode-webview";

/**
 * A utility wrapper around the acquireVsCodeApi() function, which enables
 * message passing and state management between the webview and extension
 * contexts.
 *
 * This utility also enables webview code to be run in a web browser-based
 * dev server by using native web browser features that mock the functionality
 * enabled by acquireVsCodeApi.
 */
class VSCodeAPIWrapper {
  private readonly vsCodeApi: WebviewApi<unknown> | undefined;

  constructor() {
    // Check if the acquireVsCodeApi function exists in the current development
    // context (i.e. VS Code development window or web browser)
    if (typeof acquireVsCodeApi === "function") {
      const vscode = acquireVsCodeApi();
      this.vsCodeApi = vscode;

      const getter = (t: { owner: any; }, k: any) => {
        return (...rest: any) => {
          const id = `${t.owner}-${k}-${new Date().getTime()}`;
          console.log('get arguments', rest);
          console.log('generate id', id);
          vscode.postMessage({
            command: t.owner,
            data: {
              type: k,
              id: id,
              args: rest,
            },
          });
          return new Promise((resolve) => {
            window.addEventListener('message', (event) => {
              const message = event.data;
              if (message.command === id) {
                console.log('response info', id, message.data);
                resolve(message.data);
              }
            });
          });
        };
      };
      (window as any).fs = new Proxy(
        {
          owner: 'fs',
        },
        {
          get: getter,
        }
      );
      (window as any).electron = {
        ipcRenderer: {
          send(...rest: any[]) {
            console.log('send', rest);
            vscode.postMessage({
              command: 'ipcRenderer',
              data: {
                type: 'send',
                args: rest,
              },
            });
          },
          once(...rest: any[]) {
            console.log('once', rest);
            const [name, callback] = rest;
            window.addEventListener('message', (event) => {
              const message = event.data;
              if (message.command === name) {
                callback();
              }
            });
          },
          on(...rest: any[]) {
            console.log('on', rest);
            const [name, callback] = rest;
            window.addEventListener('message', (event) => {
              const message = event.data;
              if (message.command === name) {
                callback();
              }
            });
          },
        },
      };
      
      (window as any).os = new Proxy(
        {
          owner: 'os',
        },
        {
          get: getter,
        }
      );
      /* eslint-disable camelcase */
      (window as any).child_process = new Proxy(
        {
          owner: 'child_process',
        },
        {
          get: getter,
        }
      );
    }
  }

  /**
   * Post a message (i.e. send arbitrary data) to the owner of the webview.
   *
   * @remarks When running webview code inside a web browser, postMessage will instead
   * log the given message to the console.
   *
   * @param message Abitrary data (must be JSON serializable) to send to the extension context.
   */
  public postMessage(message: unknown) {
    if (this.vsCodeApi) {
      this.vsCodeApi.postMessage(message);
    } else {
      console.log(message);
    }
  }

  /**
   * Get the persistent state stored for this webview.
   *
   * @remarks When running webview source code inside a web browser, getState will retrieve state
   * from local storage (https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
   *
   * @return The current state or `undefined` if no state has been set.
   */
  public getState(): unknown | undefined {
    if (this.vsCodeApi) {
      return this.vsCodeApi.getState();
    } else {
      const state = localStorage.getItem("vscodeState");
      return state ? JSON.parse(state) : undefined;
    }
  }

  /**
   * Set the persistent state stored for this webview.
   *
   * @remarks When running webview source code inside a web browser, setState will set the given
   * state using local storage (https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
   *
   * @param newState New persisted state. This must be a JSON serializable object. Can be retrieved
   * using {@link getState}.
   *
   * @return The new state.
   */
  public setState<T extends unknown | undefined>(newState: T): T {
    if (this.vsCodeApi) {
      return this.vsCodeApi.setState(newState);
    } else {
      localStorage.setItem("vscodeState", JSON.stringify(newState));
      return newState;
    }
  }
}
const vscode = new VSCodeAPIWrapper();
export default vscode;