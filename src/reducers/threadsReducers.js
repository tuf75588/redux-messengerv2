import uuid from 'uuid';
export function activeThreadIdReducer(state = '1-fca2', action) {
  if (action.type === 'OPEN_THREAD') {
    return action.id;
  } else {
    return state;
  }
}

export function threadsReducer(
  state = [
    {
      id: '1-fca2',
      title: 'Andrew Davis',
      messages: messagesReducer(undefined, {})
    },
    {
      id: '2-be91',
      title: 'Michael Collins',
      messages: messagesReducer(undefined, {})
    }
  ],
  action
) {
  switch (action.type) {
    case 'ADD_MESSAGE':
    case 'DELETE_MESSAGE': {
      const threadIndex = findThreadIndex(state, action);
      const oldThread = state[threadIndex];
      const newThread = {
        ...oldThread,
        messages: messagesReducer(oldThread.messages, action)
      };
      return [...state.slice(0, threadIndex), newThread, ...state.slice(threadIndex + 1, state.length)];
    }
    default:
      return state;
  }
}
export function messagesReducer(state = [], action) {
  switch (action.type) {
    case 'ADD_MESSAGE':
      const newMessage = {
        text: action.text,
        timestamp: Date.now(),
        id: uuid.v4()
      };
      return state.concat(newMessage);
    case 'DELETE_MESSAGE':
      return state.filter((m) => m.id !== action.id);
    default: {
      return state;
    }
  }
}
function findThreadIndex(threads, action) {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return threads.findIndex((m) => m.id === action.threadId);
    case 'DELETE_MESSAGE':
      return threads.findIndex((t) => t.messages.find((m) => m.id === action.id));
    default:
      return threads;
  }
}
