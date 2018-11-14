import React from 'react';
import { createStore } from 'redux';
import { activeThreadIdReducer, threadsReducer } from './reducers/threadsReducers';
import uuid from 'uuid';
function reducer(state, action) {
  return {
    // these new properties are only passed the part of our state they are concerned with, before we had to take into consideration our entire state tree.
    activeThreadId: activeThreadIdReducer(state.activeThreadId, action),
    threads: threadsReducer(state.threads, action)
  };
}
const initialState = {
  //! keep track of which thread is currently "active" in the view
  activeThreadId: '1-fca2',
  threads: [
    {
      //! individual threadId which for now is a hard coded pseudo-id
      id: '1-fca2',
      //! title of user who conversation is with in the current thread.
      title: 'Andrew Davis',
      //! messages metadata which includes the messages themselves, along with a timestamp and unique identifier.
      messages: [
        {
          text: 'Test from the chat application v2 with redux',
          timestamp: Date.now(),
          id: uuid.v4()
        }
      ]
    },
    //! new thread object separate from our first.
    {
      id: '2-be91',
      title: 'Buzz Aldrin',
      messages: []
    }
  ]
};
const store = createStore(reducer, initialState);

class App extends React.Component {
  componentDidMount() {
    store.subscribe(() => this.forceUpdate());
  }
  render() {
    //! new declaration of store subscription
    const state = store.getState();

    //! value of our current active thread.
    const activeThreadId = state.activeThreadId;
    //! our newly created threads array.
    const threads = state.threads;
    console.log(threads);
    //! running a find higher order function, to find which individual thread matches our states top level activethreadId property.
    const activeThread = threads.find((thread) => thread.id === activeThreadId);
    //! tabs object for each thread (including active) in our application
    const tabs = threads.map((t) => ({
      title: t.title,
      // TODO active property is for styling purposes.
      active: t.id === activeThreadId,
      id: t.id
    }));

    return (
      <div className='ui segment'>
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
  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState(() => ({
      [name]: value
    }));
  };
  handleSubmit = (id) => {
    store.dispatch({
      type: 'ADD_MESSAGE',
      text: this.state.value,
      threadId: this.props.threadId
    });
    this.setState(() => ({
      value: ''
    }));
  };
  render() {
    return (
      <div className='ui input'>
        <input type='text' value={this.state.value} name='value' onChange={this.handleInputChange} />
        <button className='ui primary button' onClick={this.handleSubmit} type='submit'>
          Submit Message
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
    //! updated messages variable to reflect our states new thread based paradigm.
    const messages = this.props.thread.messages.map((message, index) => {
      return (
        <div className='comment' key={index} onClick={() => this.handleClick(message.id)}>
          <div className='text'>
            {message.text}
            {` `}
            <span className='metadata'>@{message.timestamp}</span>
          </div>
        </div>
      );
    });
    return (
      <div className='ui comments'>
        {messages}
        <div>
          <MessageInput threadId={this.props.thread.id} />
        </div>
      </div>
    );
  }
}

const ThreadTabs = (props) => {
  //! we will render a new tab view for each thread in our chat app through props from App
  //! openthread variable handles switching between different thread views based on the passed in id
  const handleClick = (id) => store.dispatch({ type: 'OPEN_THREAD', id: id });
  const tabs = props.tabs.map((tab, index) => {
    return (
      <div className={tab.active ? 'active item' : 'item'} key={index} onClick={() => handleClick(tab.id)}>
        {/* title is coming from each tab objects "title" property specifying the chat recipients name */}
        {tab.title}
      </div>
    );
  });
  return <div className='ui top attached tabular menu'>{tabs}</div>;
};

export default App;
