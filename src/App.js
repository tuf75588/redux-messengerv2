import React from 'react';
import { createStore } from 'redux';
import uuid from 'uuid';
function reducer(state, action) {
  if (action.type === 'ADD_MESSAGE') {
    const newMessage = {
      text: action.text,
      timestamp: Date.now(),
      id: uuid.v4()
    };
    return {
      messages: state.messages.concat(newMessage)
    };
  } else if (action.type === 'DELETE_MESSAGE') {
    return {
      //! looks for message that does not equal the given action.id
      //! Here,we’re building a new array containing every object that does not have an id that corresponds to the action’s id.
      messages: state.messages.filter((message) => message.id !== action.id)
    };
  } else {
    return state;
  }
}
const initialState = { messages: [] };
const store = createStore(reducer, initialState);

class App extends React.Component {
  componentDidMount() {
    store.subscribe(() => this.forceUpdate());
  }
  render() {
    const messages = store.getState().messages;
    return (
      <div className="ui segment">
        <MessageView messages={messages} />
        <MessageInput />
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
  handleSubmit = () => {
    store.dispatch({
      type: 'ADD_MESSAGE',
      text: this.state.value
    });
    this.setState(() => ({
      value: ''
    }));
  };
  render() {
    return (
      <div className="ui input">
        <input type="text" value={this.state.value} name="value" onChange={this.handleInputChange} />
        <button className="ui primary button" onClick={this.handleSubmit} type="submit">
          Submit Message
        </button>
      </div>
    );
  }
}
class MessageView extends React.Component {
  handleClick = (id) => {
    store.dispatch({
      type: 'DELETE_MESSAGE',
      id: id
    });
  };
  render() {
    //! messages referes to each individual message object with the properties of "text,id,and timestamp attached to it"
    const messages = this.props.messages.map((message, index) => {
      return (
        <div className="comment" key={index} onClick={() => this.handleClick(message.id)}>
          <div className="text">
            {message.text}
            {` `}
            <span className="metadata">@{message.timestamp}</span>
          </div>
        </div>
      );
    });
    return <div className="ui comments">{messages}</div>;
  }
}

export default App;
