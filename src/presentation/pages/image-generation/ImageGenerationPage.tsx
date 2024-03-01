import { useState } from 'react';
import {
  GptMessage,
  MyMessage,
  TypingLoader,
  TextMessageBox,
  GptMessageImage,
} from '../../components';
import { imageGenerationUseCase } from '../../../core/use-cases';

interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    imageUrl: string;
    alt: string;
  };
}

export const ImageGenerationPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text, isGpt: false }]);

    const imageInfo = await imageGenerationUseCase(text);

    if (!imageInfo) {
      return setMessages((prev) => [
        ...prev,
        { text: 'No se puedo generar la imagen', isGpt: true },
      ]);
    }

    setMessages((prev) => [
      ...prev,
      {
        text,
        isGpt: true,
        info: {
          imageUrl: imageInfo.url,
          alt: imageInfo.alt,
        },
      },
    ]);

    setIsLoading(false);
  };

  return (
    <div className='chat-container'>
      <div className='chat-messages'>
        <div className='grid grid-cols-12 gap-y-2'>
          <GptMessage text='¿Qué imagen deseas generar hoy?'></GptMessage>
          {messages.map((message, index) =>
            message.isGpt ? (
              <GptMessageImage
                key={index}
                text={message.text}
                {...message.info!}
              ></GptMessageImage>
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
      />
    </div>
  );
};
