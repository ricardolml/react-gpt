import { useState } from 'react';
import {
  GptMessage,
  MyMessage,
  TypingLoader,
  TextMessageBoxSelect,
} from '../../components';
import { translateTextUseCase } from '../../../core/use-cases';

interface Message {
  text: string;
  isGpt: boolean;
}

const languages = [
  { id: 'alemán', text: 'Alemán' },
  { id: 'árabe', text: 'Árabe' },
  { id: 'bengalí', text: 'Bengalí' },
  { id: 'francés', text: 'Francés' },
  { id: 'hindi', text: 'Hindi' },
  { id: 'inglés', text: 'Inglés' },
  { id: 'japonés', text: 'Japonés' },
  { id: 'mandarín', text: 'Mandarín' },
  { id: 'portugués', text: 'Portugués' },
  { id: 'ruso', text: 'Ruso' },
];

export const TranslatePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string, selectedOption: string) => {
    setIsLoading(true);
    const newMessege = `Traduce: "${text}" al idioma ${selectedOption}`;
    setMessages((prev) => [...prev, { text: newMessege, isGpt: false }]);

    const { ok, message } = await translateTextUseCase(text, selectedOption);

    if (!ok) return;

    setMessages((prev) => [
      ...prev,
      {
        text: message,
        isGpt: true,
      },
    ]);

    setIsLoading(false);
  };

  return (
    <div className='chat-container'>
      <div className='chat-messages'>
        <div className='grid grid-cols-12 gap-y-2'>
          <GptMessage text='Hola, ¿Qué quieres que traduzca hoy?'></GptMessage>
          {messages.map((message, index) =>
            message.isGpt ? (
              <GptMessage key={index} text={message.text}></GptMessage>
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

      <TextMessageBoxSelect
        onSendMessage={handlePost}
        options={languages}
        placeholder='Escribe aqui lo que deseas'
      />
    </div>
  );
};
