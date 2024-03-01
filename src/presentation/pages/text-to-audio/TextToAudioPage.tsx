import { useState } from 'react';
import {
  GptMessage,
  MyMessage,
  TypingLoader,
  TextMessageBox,
  TextMessageBoxSelect,
  GptMessageAudio,
} from '../../components';
import { textToAudioUseCase } from '../../../core/use-cases';

const displaimer = `## ¿Qué audio quieres generar hoy?
* Todo el audio es generado por AI`;

const voices = [
  { id: 'nova', text: 'Nova' },
  { id: 'alloy', text: 'Alloy' },
  { id: 'echo', text: 'Echo' },
  { id: 'fable', text: 'Fable' },
  { id: 'onyx', text: 'Onyx' },
  { id: 'shimmer', text: 'Shimmer' },
];
interface TextMessage {
  text: string;
  isGpt: boolean;
  type: 'text';
}

interface AudioMessage {
  text: string;
  isGpt: boolean;
  audio: string;
  type: 'audio';
}

type Message = TextMessage | AudioMessage;

export const TextToAudioPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string, selectedVoice: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text, isGpt: false, type: 'text' }]);

    const { ok, message, audioUrl } = await textToAudioUseCase(
      text,
      selectedVoice
    );

    if (!ok) return;

    setMessages((prev) => [
      ...prev,
      {
        text: `${selectedVoice} - ${message}`,
        isGpt: true,
        type: 'audio',
        audio: audioUrl!,
      },
    ]);

    setIsLoading(false);
  };

  return (
    <div className='chat-container'>
      <div className='chat-messages'>
        <div className='grid grid-cols-12 gap-y-2'>
          <GptMessage text={displaimer}></GptMessage>
          {messages.map((message, index) =>
            message.isGpt ? (
              message.type === 'audio' ? (
                <GptMessageAudio
                  key={index}
                  text={message.text}
                  audio={message.audio}
                ></GptMessageAudio>
              ) : (
                <GptMessage key={index} text={message.text}></GptMessage>
              )
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
        options={voices}
        onSendMessage={handlePost}
        placeholder='Escribe aqui lo que deseas'
      />
    </div>
  );
};
