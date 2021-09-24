import { Component } from 'react';
import { alert } from '@pnotify/core';

import { socket } from './socket';
import Message from '../message';
import Send from '../send';
import './chat.css';

export default class Chat extends Component {
  socket = socket;
  state = {
    currentUser: '',
    messages: [],
    message: '',
    isLogin: false,
    users: {},
  };

  componentDidMount() {
    this.socket.on('message', data => {
      if (this.state.isLogin) {
        this.setState(({ messages }) => {
          const newMessages = [...messages];
          if (newMessages.length > 10) {
            newMessages.shift();
          }
          return {
            messages: [...newMessages, { user: data.user, text: data.message }],
          };
        });
      }
    });

    this.socket.on('users', data => {
      this.setState({ users: data });
    });
  }

  changeName = event => {
    this.setState({ currentUser: event.target.value });
  };

  inputName = e => {
    e.preventDefault();
    const user = this.state.currentUser;
    if (Object.values(this.state.users).includes(user)) {
      alert({
        title: 'Oh No!',
        text: `Sorry, the name "${user}" is already taken!`,
        delay: 5000,
      });
      return;
    }
    if (user.trim().length > 0) {
      this.socket.emit('change:name', user);
      this.setState({ isLogin: true });
    }
  };

  sendMessage = e => {
    e.preventDefault();
    const { message, currentUser } = this.state;
    if (message.trim().length > 0) {
      this.socket.emit('message', {
        user: currentUser,
        message: message.trim(),
      });
      this.setState({ message: '' });
    }
  };

  changeMessage = event => {
    this.setState({ message: event.target.value });
  };

  render() {
    const { message, messages, currentUser, isLogin, users } = this.state;
    if (!isLogin) {
      return (
        <main className="form-signin">
          <h4 className="form-floating mb-3">Please, introduce yourself</h4>
          <form onSubmit={this.inputName}>
            <div className="form-floating mb-3">
              <input
                className="form-control"
                value={currentUser}
                onChange={this.changeName}
                placeholder="Введите ваш никнейм"
                id="floatingInput"
              />
              <label for="floatingInput">Nickname</label>
            </div>
            <button className="w-100 btn btn-lg btn-primary" type="submit">
              Sign in
            </button>
          </form>
        </main>
      );
    }
    return (
      <>
        <div className="container">
          <h1>Welcome {currentUser}</h1>
          <div className="row align-items-start">
            <div className="message-list col-md-9">
              <Send
                value={message}
                onChange={this.changeMessage}
                onSend={this.sendMessage}
              />
              <div className="messages">
                {messages.map((item, key) => (
                  <Message item={item} currentUser={currentUser} key={key} />
                ))}
              </div>
            </div>
            <ul className="list-group col-md-3">
              {Object.values(users).map((user, i) => (
                <li className="list-group-item" key={i}>
                  {user}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </>
    );
  }
}
