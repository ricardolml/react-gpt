import { useState } from 'react';
import {
  GptMessage,
  MyMessage,
  TypingLoader,
  TextMessageBox,
} from '../../components';
import { prosConsDiscusserUseCase } from '../../../core/use-cases';
interface Message {
  text: string;
  isGpt: boolean;
}
export const ProsConsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text, isGpt: false }]);
    const { ok, content } = await prosConsDiscusserUseCase(text);

    if (!ok) return;

    setMessages((prev) => [
      ...prev,
      {
        text: content,
        isGpt: true,
      },
    ]);

    setIsLoading(false);
  };

  return (
    <div className='chat-container'>
      <div className='chat-messages'>
        <div className='grid grid-cols-12 gap-y-2'>
          <GptMessage text='Puedes escribir lo que sea que quieres que compare y te de mis puntos de vista'></GptMessage>
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

      <TextMessageBox
        onSendMessage={handlePost}
        placeholder='Escribe aqui lo que deseas'
        disableCorrections={false}
      />
    </div>
  );
};
