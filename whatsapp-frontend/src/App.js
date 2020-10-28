import React, {useEffect, useState} from 'react';
import './App.css';
import Chat from './Chat';
import Sidebar from './Sidebar';
import Pusher from 'pusher-js';
import axios from './axios';


function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios.get("./messages.sync")
      .then(response => {
        setMessages(response.data);
      })
  }, [])

  useEffect(() => {
    const pusher = new Pusher('e6cd545a673436242ea3', {
      cluster: 'us2'
    });

    var channel = pusher.subscribe('messages');
    channel.bind('inserted', (newMessage) => {
      alert(JSON.stringify(newMessage));
      setMessages([...messages, newMessage])
      console.log(newMessage, "NMsagge")
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages]);

  console.log(messages, "mess");


  return (
    <div className="app">
      <div className="app-body">
        <Sidebar />
        <Chat messages={messages} />
      </div>
    </div>
  );
}

export default App;
