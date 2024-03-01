export async function* prosConsDiscusserStreamGeneratorUseCase(
  prompt: string,
  abortSignal: AbortSignal
) {
  try {
    const resp = await fetch(
      `${import.meta.env.VITE_GPI_API}/pros-cons-discusser-stream`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
        signal: abortSignal,
      }
    );
    if (!resp.ok) throw new Error('No se pudo realizar la comparación ');

    const reader = resp.body?.getReader();
    if (!reader) {
      console.log('no se puedo generar el reader');
      return null;
    }

    const decoder = new TextDecoder();
    let text = '';

    while (true) {
      const { value, done } = await reader.read();

      if (done) {
        break;
      }

      const decodedChunk = decoder.decode(value, { stream: true });
      text += decodedChunk;
      yield text;
    }

    return reader;
  } catch (error) {
    return null;
  }
}
