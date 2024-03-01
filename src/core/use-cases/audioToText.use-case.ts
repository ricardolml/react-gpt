import type { AudioToTextResponse } from '../../interfaces';

export const audioToTextUseCase = async (audioFile: File, prompt?: string) => {
  try {
    const formData = new FormData();
    formData.append('file', audioFile);
    if (prompt) {
      formData.append('prompt', prompt);
    }
    const resp = await fetch(`${import.meta.env.VITE_GPI_API}/audio-to-text`, {
      method: 'POST',
      body: formData,
    });
    if (!resp.ok) throw new Error('No se pudo realizar la transcripción');

    const data = (await resp.json()) as AudioToTextResponse;
    return {
      ok: true,
      ...data,
    };
  } catch (error) {
    return null;
  }
};
