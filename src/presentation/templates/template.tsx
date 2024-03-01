import { useState } from 'react';
import {
  GptMessage,
  MyMessage,
  TypingLoader,
  TextMessageBox,
} from '../components';

interface Message {
  text: string;
  isGpt: boolean;
}

export const ChatTemplate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text, isGpt: false }]);

    //TODO: USE CASE

    setIsLoading(false);

    //Todo: Añadir el mensaje
  };

  return (
    <div className='chat-container'>
      <div className='chat-messages'>
        <div className='grid grid-cols-12 gap-y-2'>
          <GptMessage text='Hola, puedes escribir tu texto en español'></GptMessage>
          {messages.map((message, index) =>
            message.isGpt ? (
              <GptMessage key={index} text='Gpi'></GptMessage>
            ) : (
              <MyMessage key={index} text={message.text}></MyMessage>
            )
          )}
          {isLoading && (
            <div className='col-start-1 col-end-12 fade-in'>
              <TypingLoader className='fade-in' />
            </div>
          )}
        </div>
      </div>

      <TextMessageBox
        onSendMessage={handlePost}
        placeholder='Escribe aqui lo que deseas'
        disableCorrections
      />
    </div>
  );
};
