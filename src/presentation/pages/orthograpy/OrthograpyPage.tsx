import { useState } from 'react';
import {
  GptMessage,
  GptOrthographyMessage,
  MyMessage,
  TextMessageBox,
  TextMessageBoxFile,
  TextMessageBoxSelect,
  TypingLoader,
} from '../../components';
import { orthographyUseCase } from '../../../core/use-cases';

interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    userScore: number;
    errors: string[];
    message: string;
  };
}

export const OrthographyPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text, isGpt: false }]);

    const { ok, errors, message, userScore } = await orthographyUseCase(text);

    if (!ok) {
      setMessages((prev) => [
        ...prev,
        { text: 'No se puedo realizar la correción', isGpt: true },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          text: message,
          isGpt: true,
          info: {
            errors,
            message,
            userScore,
          },
        },
      ]);
    }
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
              <GptOrthographyMessage
                key={index}
                {...message.info!}
              ></GptOrthographyMessage>
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
