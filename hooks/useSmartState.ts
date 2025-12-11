import { useState, useCallback } from 'react';

interface HistoryState<T> {
    past: T[];
    present: T;
    future: T[];
}

export const useSmartState = <T>(initialState: T) => {
    const [state, setState] = useState<HistoryState<T>>({
        past: [],
        present: initialState,
        future: [],
    });

    const canUndo = state.past.length > 0;
    const canRedo = state.future.length > 0;

    const undo = useCallback(() => {
        setState((currentState) => {
            if (currentState.past.length === 0) {
                return currentState;
            }
            const previous = currentState.past[currentState.past.length - 1];
            const newPast = currentState.past.slice(0, currentState.past.length - 1);
            return {
                past: newPast,
                present: previous,
                future: [currentState.present, ...currentState.future],
            };
        });
    }, []);

    const redo = useCallback(() => {
        setState((currentState) => {
            if (currentState.future.length === 0) {
                return currentState;
            }
            const next = currentState.future[0];
            const newFuture = currentState.future.slice(1);
            return {
                past: [...currentState.past, currentState.present],
                present: next,
                future: newFuture,
            };
        });
    }, []);

    const set = useCallback((newStateOrFn: T | ((prev: T) => T)) => {
        setState((currentState) => {
            const newState = typeof newStateOrFn === 'function'
                ? (newStateOrFn as (prev: T) => T)(currentState.present)
                : newStateOrFn;

            // Don't update if the state is the same
            if (JSON.stringify(newState) === JSON.stringify(currentState.present)) {
                return currentState;
            }
            return {
                past: [...currentState.past, currentState.present],
                present: newState,
                future: [],
            };
        });
    }, []);

    const reset = useCallback(() => {
        setState({
            past: [],
            present: initialState,
            future: [],
        });
    }, [initialState]);

    return {
        state: state.present,
        set,
        undo,
        redo,
        reset,
        canUndo,
        canRedo,
    };
};
