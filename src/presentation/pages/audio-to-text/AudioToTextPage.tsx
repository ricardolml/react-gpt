import { useState } from 'react';
import {
  GptMessage,
  MyMessage,
  TypingLoader,
  TextMessageBoxFile,
} from '../../components';
import { audioToTextUseCase } from '../../../core/use-cases';

interface Message {
  text: string;
  isGpt: boolean;
}

export const AudioToTextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string, audioFile: File) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text, isGpt: false }]);

    const resp = await audioToTextUseCase(audioFile, text);

    if (!resp) return;

    const gptMessage = `
## Transcripción:
__Duración:__ ${Math.round(resp.duration)} segundos
## El texto es:
${resp.text}
    `;
    setMessages((prev) => [...prev, { text: gptMessage, isGpt: true }]);

    resp.segments.forEach((segment) => {
      const segmentMessage = `__De ${Math.round(segment.start)} a ${Math.round(
        segment.end
      )} segundos:__
        ${segment.text}
      `;
      setMessages((prev) => [...prev, { text: segmentMessage, isGpt: true }]);
    });
    setIsLoading(false);
  };

  return (
    <div className='chat-container'>
      <div className='chat-messages'>
        <div className='grid grid-cols-12 gap-y-2'>
          <GptMessage text='Hola, ¿Qué audio quieres generar hoy?'></GptMessage>
          {messages.map((message, index) =>
            message.isGpt ? (
              <GptMessage key={index} text={message.text}></GptMessage>
            ) : (
              <MyMessage
                key={index}
                text={
                  message.text === '' ? 'Transcribe el audio' : message.text
                }
              ></MyMessage>
            )
          )}
          {isLoading && (
            <div className='col-start-1 col-end-12 fade-in'>
              <TypingLoader className='fade-in' />
            </div>
          )}
        </div>
      </div>

      <TextMessageBoxFile
        onSendMessage={handlePost}
        placeholder='Escribe aqui lo que deseas'
        accept='audio/*'
      />
    </div>
  );
};
