import { useState } from 'react';
import {
  imageGenerationUseCase,
  imageVariationUseCase,
} from '../../../core/use-cases';
import {
  GptMessage,
  GptMessageImage,
  MyMessage,
  TypingLoader,
  TextMessageBox,
  GptMessageSelectableImage,
} from '../../components';

interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    imageUrl: string;
    alt: string;
  };
}

export const ImageTunningPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      isGpt: true,
      text: '',
      info: {
        imageUrl:
          'http://localhost:3000/gpt/image-generation/1709244749928.png',
        alt: 'Imagen base',
      },
    },
  ]);

  const [originalImageAndMask, setOriginalImageAndMask] = useState({
    original: undefined as string | undefined,
    mask: undefined as string | undefined,
  });
  //http://localhost:3000/gpt/image-generation/1708989457347.png

  const handleVariation = async () => {
    setIsLoading(true);

    const resp = await imageVariationUseCase(originalImageAndMask.original);

    if (!resp) return;

    setMessages((prev) => [
      ...prev,
      {
        text: 'Variación',
        isGpt: true,
        info: {
          imageUrl: resp.url,
          alt: resp.alt,
        },
      },
    ]);

    setIsLoading(false);
  };

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text, isGpt: false }]);

    const { original, mask } = originalImageAndMask;

    const imageInfo = await imageGenerationUseCase(text, original, mask);

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
    <>
      {originalImageAndMask.original && (
        <div className='fixed flex flex-col items-center top-10 right-10 z-10 fade-in '>
          <span>Editando</span>
          <img
            className=' border rounded-xl w-36 h-36 object-cover'
            src={originalImageAndMask.mask ?? originalImageAndMask.original}
            alt='Imagen origin '
          />
          <button onClick={handleVariation} className='btn-primary mt-2 '>
            Generar Variación
          </button>
        </div>
      )}
      <div className='chat-container'>
        <div className='chat-messages'>
          <div className='grid grid-cols-12 gap-y-2'>
            <GptMessage text='¿Qué imagen deseas generar hoy?'></GptMessage>
            {messages.map((message, index) =>
              message.isGpt ? (
                // <GptMessageImage
                <GptMessageSelectableImage
                  key={index}
                  text={message.text}
                  {...message.info!}
                  onImageSelected={(maskImageUrl) =>
                    setOriginalImageAndMask({
                      original: message.info?.imageUrl,
                      mask: maskImageUrl,
                    })
                  }
                />
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
    </>
  );
};
