import React from 'react';
import uuid from 'uuid';
import { createStore } from 'redux';

function reducer(state, action) {
  return {
    activeThreadId: activeThreadIdReducer(state.activeThreadId, action),
    threads: threadsReducer(state.threads, action)
  };
}

//! Responsible for managing which thread in the application is "active"
function activeThreadIdReducer(state, action) {
  if (action.type === 'OPEN_THREAD') {
    return action.id;
  } else {
    return state;
  }
}

//! Responsible for managing messages in the thread
function threadsReducer(state, action) {
  switch (action.type) {
    case 'ADD_MESSAGE':
    case 'DELETE_MESSAGE': {
      const threadIndex = findThreadIndex(state, action);
      const oldThread = state[threadIndex];
      const newThread = { ...oldThread, messages: messagesReducer(oldThread.messages, action) };
      return [...state.slice(0, threadIndex), newThread, ...state.slice(threadIndex + 1, state.length)];
    }
    default: {
      return state;
    }
  }
}
// TODO 1. Message Reducer will create new message array. 2. Return a new array with the new message appended at the end of it.
function messagesReducer(state, action) {
  if (action.type === 'ADD_MESSAGE') {
    const newMessage = {
      text: action.text,
      timestamp: Date.now(),
      id: uuid.v4()
    };
    return {
      messages: state.concat(newMessage)
    };
  } else {
    return state;
  }
}
const initialState = {
  activeThreadId: '1-fca2', // New state property
  threads: [
    // Two threads in state
    {
      id: '1-fca2', // hardcoded pseudo-UUID
      title: 'Buzz Aldrin',
      messages: [
        {
          // This thread starts with a single message already
          text: 'Twelve minutes to ignition.',
          timestamp: Date.now(),
          id: uuid.v4()
        }
      ]
    },
    {
      id: '2-be91',
      title: 'Michael Collins',
      messages: []
    }
  ]
};

function findThreadIndex(threads, action) {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return threads.findIndex((t) => t.id === action.threadId);
    case 'DELETE_MESSAGE':
      return threads.findIndex((t) => t.messages.find((m) => m.id === action.id));
    default:
      return threads;
  }
}

const store = createStore(reducer, initialState);

class App extends React.Component {
  componentDidMount() {
    store.subscribe(() => this.forceUpdate());
  }

  render() {
    const state = store.getState();
    const activeThreadId = state.activeThreadId;
    const threads = state.threads;
    const activeThread = threads.find((t) => t.id === activeThreadId);
    const tabs = threads.map((t, i) => ({
      title: t.title,
      active: t.id === activeThreadId,
      id: t.id
    }));

    return (
      <div className="ui segment">
        <ThreadTabs tabs={tabs} />
        <Thread thread={activeThread} />
      </div>
    );
  }
}

class MessageInput extends React.Component {
  state = {
    value: ''
  };

  onChange = (e) => {
    this.setState({
      value: e.target.value
    });
  };

  handleSubmit = () => {
    store.dispatch({
      type: 'ADD_MESSAGE',
      text: this.state.value,
      threadId: this.props.threadId
    });
    this.setState({
      value: ''
    });
  };

  render() {
    return (
      <div className="ui input">
        <input onChange={this.onChange} value={this.state.value} type="text" />
        <button onClick={this.handleSubmit} className="ui primary button" type="submit">
          Submit
        </button>
      </div>
    );
  }
}

class Thread extends React.Component {
  handleClick = (id) => {
    store.dispatch({
      type: 'DELETE_MESSAGE',
      id: id
    });
  };

  render() {
    const messages = this.props.thread.messages.map((message, index) => (
      <div className="comment" key={index} onClick={() => this.handleClick(message.id)}>
        <div className="text">
          {message.text}
          <span className="metadata">@{message.timestamp}</span>
        </div>
      </div>
    ));
    return (
      <div className="ui center aligned basic segment">
        <div className="ui comments">{messages}</div>
        <MessageInput threadId={this.props.thread.id} />
      </div>
    );
  }
}

const ThreadTabs = (props) => {
  const handleClick = (id) => store.dispatch({ type: 'OPEN_THREAD', id: id });
  const tabs = props.tabs.map((tab, index) => {
    return (
      <div className={tab.active ? 'active item' : 'item'} key={index} onClick={() => handleClick(tab.id)}>
        {tab.title}
      </div>
    );
  });
  return <div className="ui top attached tabular menu">{tabs}</div>;
};

export default App;
