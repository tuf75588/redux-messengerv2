import uuid from 'uuid';
export function activeThreadIdReducer(state, action) {
  if (action.type === 'OPEN_THREAD') {
    return action.id;
  } else {
    return state;
  }
}

export function threadsReducer(state, action) {
  if (action.type === 'ADD_MESSAGE') {
    const newMessage = {
      text: action.text,
      timestamp: Date.now(),
      id: uuid.v4()
    };
    const threadIndex = state.findIndex((t) => t.id === action.threadId);
    const oldThread = state[threadIndex];
    const newThread = {
      ...oldThread,
      messages: oldThread.messages.concat(newMessage)
    };

    return [...state.slice(0, threadIndex), newThread, ...state.slice(threadIndex + 1, state.length)];
  } else if (action.type === 'DELETE_MESSAGE') {
    const threadIndex = state.findIndex((t) => t.messages.find((m) => m.id === action.id));
    const oldThread = state[threadIndex];

    const newThread = {
      ...oldThread,
      messages: oldThread.messages.filter((m) => m.id !== action.id)
    };

    return [...state.slice(0, threadIndex), newThread, ...state.slice(threadIndex + 1, state.length)];
  } else {
    return state;
  }
}
